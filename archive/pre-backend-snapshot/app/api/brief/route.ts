import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { BriefPayload, calculateQuote } from "../../../types/brief";
import { formatCSVRow, getNextProjectId } from "../../../lib/curationService";
import { generateAiBrandDesign } from "../../../lib/aiBrandDesignerService";
import { generateAndSaveMoodboard } from "../../../lib/pollinationsService";
import { ProjectRecord } from "../../../types/curation";

/**
 * API Route: /api/brief
 * Phương thức: POST
 * Chức năng: Tiếp nhận Brief từ Smart Brief Form
 * Tự động hóa 100%:
 * 1. Gọi `aiBrandDesignerService` sinh DNA thương hiệu + 3 Option Logo SVG theo đúng ngành nghề.
 * 2. Gọi `pollinationsService` sinh ảnh Moodboard photorealistic 1200x800 qua mô hình FLUX.1.
 * 3. Ghi đè dữ liệu hoàn chỉnh vào `curated_records/{project_id}.json` và đồng bộ vào `lumina_database.csv`.
 */
export async function POST(request: NextRequest) {
  try {
    const payload: BriefPayload = await request.json();

    // 1. Kiểm tra các trường thông tin bắt buộc
    if (!payload.brand_name || !payload.client_name || !payload.client_phone || !payload.client_email) {
      return NextResponse.json(
        { success: false, error: "Thiếu các thông tin bắt buộc trong Brief." },
        { status: 400 }
      );
    }

    // 2. Chuẩn hóa cấu hình đơn hàng
    const orderConfig = payload.order_config || {
      delivery_time: "24h",
      logo_options_count: 3,
      revision_rounds: 2,
      quote_price: calculateQuote("24h", 3, 2),
      currency: "VND" as const,
      payment_status: "Quotation_Accepted" as const,
    };

    // 3. Tính toán ID dự án tiếp theo một cách an toàn và tự động tăng dần (LUMINA-XX)
    const nextProjectId = getNextProjectId();

    console.log(`[API /api/brief] Đang xử lý dự án mới: ${nextProjectId} — "${payload.brand_name}"`);

    // 4. Kích hoạt động cơ AI:
    // - Động cơ Vector & Chiến lược: Gemini 2.5 Flash + Archetypes (3 Logo SVG + Bảng màu + Typography)
    // - Động cơ Hình ảnh thị giác: Pollinations.AI FLUX.1 Moodboard
    const styleVibesStr = (payload.style_vibes || []).join(", ") || "Modern Minimalist";
    const colorToneStr = payload.color_tone || "Tương phản thẩm mỹ cao";

    const aiDesign = await generateAiBrandDesign({
      brandName: payload.brand_name,
      clientName: payload.client_name,
      clientPhone: payload.client_phone,
      clientEmail: payload.client_email,
      industry: payload.industry,
      targetAudience: payload.target_audience,
      logoFormat: payload.logo_format,
      colorTone: payload.color_tone,
      styleVibes: payload.style_vibes,
      slogan: payload.slogan && !payload.slogan.includes("Chưa có") ? payload.slogan : undefined
    });

    const paletteHexes = aiDesign.palette.map((c) => c.hex);

    const moodboardUrl = await generateAndSaveMoodboard(
      payload.brand_name,
      payload.industry,
      styleVibesStr,
      colorToneStr,
      nextProjectId,
      paletteHexes
    );

    const slug = payload.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const primaryHex = aiDesign.palette[0]?.hex || "#111827";
    const secondaryHex = aiDesign.palette[1]?.hex || "#4B5563";
    const neutralHex = aiDesign.palette[2]?.hex || "#F9FAFB";

    // 5. Khởi tạo đối tượng dữ liệu hoàn chỉnh (ProjectRecord)
    const curatedRecord: ProjectRecord = {
      project_id: nextProjectId,
      brand_name: payload.brand_name,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      client_email: payload.client_email,
      industry: payload.industry,
      target_audience: payload.target_audience,
      logo_format: payload.logo_format || "Combination Mark",
      color_tone: payload.color_tone || "Tự nhiên / Chuẩn ngành",
      style_vibes: payload.style_vibes || ["Minimalist", "Modern"],
      submitted_at: new Date().toISOString(),
      status: payload.status || "Pending",

      // Gói đơn hàng & Cơ chế bàn giao
      order_tier: orderConfig.logo_options_count === 1 ? "standard" : "pro",
      logo_options: aiDesign.logo_options,
      selected_logo_id: "opt_1",
      delivery_mode: "client_choice",
      delivery_time: orderConfig.delivery_time || "24h",
      logo_options_count: (orderConfig.logo_options_count as 1 | 3) || 3,
      revision_rounds: orderConfig.revision_rounds || 2,
      current_revision: 1,
      review_status: "Pending_Review",

      // Chiến lược nội dung & Thị giác AI
      brand_story: aiDesign.brand_story,
      tagline: aiDesign.tagline,
      tagline_options: aiDesign.tagline_options || aiDesign.taglines,
      palette: aiDesign.palette,
      typography: aiDesign.typography,
      logo_svg: aiDesign.logo_options[0]?.svg || "",
      original_logo_svg: aiDesign.logo_options[0]?.svg || "",
      logo_layout: {
        layout: "stacked",
        iconScale: 1,
        letterSpacing: 0.18,
        iconColor: primaryHex,
        titleColor: primaryHex,
        taglineColor: secondaryHex,
        bgColor: neutralHex
      },
      mockups: aiDesign.mockups,
      moodboard_url: moodboardUrl,
      mockup_url: `/api/generate-mockup?projectId=${nextProjectId}`,
      export_links: {
        svg_url: `/downloads/${nextProjectId}/logo_master.svg`,
        png_url: `/downloads/${nextProjectId}/logo_transparent.png`,
        pdf_url: `/downloads/${nextProjectId}/brand_guideline.pdf`,
        client_proposal_url: `/p/${slug}`
      }
    };

    // 6. Ghi đè vào `curated_records/{project_id}.json` (Admin vào thấy ngay lập tức)
    const curatedDir = path.join(process.cwd(), "curated_records");
    if (!fs.existsSync(curatedDir)) {
      fs.mkdirSync(curatedDir, { recursive: true });
    }
    const curatedPath = path.join(curatedDir, `${nextProjectId}.json`);
    fs.writeFileSync(curatedPath, JSON.stringify(curatedRecord, null, 2), "utf8");

    // 7. Ghi nhận vào `brief_records/` phục vụ lưu trữ nhật ký đơn
    const recordsDir = path.join(process.cwd(), "brief_records");
    if (!fs.existsSync(recordsDir)) {
      fs.mkdirSync(recordsDir, { recursive: true });
    }
    const recordFile = path.join(
      recordsDir,
      `${nextProjectId}_${payload.brand_name.replace(/[^a-zA-Z0-9]/g, "_")}.json`
    );
    const fullSavedPayload = {
      ...payload,
      project_id: nextProjectId,
      order_config: orderConfig,
      brand_story: aiDesign.brand_story,
      slogan: aiDesign.tagline,
      palette: aiDesign.palette,
      typography: aiDesign.typography,
      logo_options: aiDesign.logo_options,
      moodboard_url: moodboardUrl
    };
    fs.writeFileSync(recordFile, JSON.stringify(fullSavedPayload, null, 2), "utf8");

    // 8. Định dạng và bổ sung dòng dữ liệu vào `lumina_database.csv`
    const clientContact = `${payload.client_phone} / ${payload.client_email}`;
    const industryTarget = `${payload.industry}. Target: ${payload.target_audience}`;
    const orderSummary = `Gói: ${orderConfig.delivery_time.toUpperCase()} (${orderConfig.logo_options_count} Option - ${orderConfig.revision_rounds} Duyệt - ${orderConfig.quote_price.toLocaleString("vi-VN")} VNĐ)`;
    const styleVibe = `${(payload.style_vibes || []).join(", ")}, Định dạng: ${payload.logo_format}, Tông màu: ${payload.color_tone}, ${orderSummary}`;
    const paletteSummary = aiDesign.palette.map((c) => `${c.hex} (${c.name})`).join(", ");
    const aiStoryFormatted = `${aiDesign.brand_story} Slogan: "${aiDesign.tagline}".`;
    const aiTypographyFormatted = `Header: ${aiDesign.typography.heading} | Body: ${aiDesign.typography.body}`;
    const aiMoodboardFormatted = moodboardUrl.startsWith("http") ? `=IMAGE("${moodboardUrl}")` : moodboardUrl;
    const aiMockupFormatted = `/api/generate-mockup?projectId=${nextProjectId}`;
    const designerPaletteFont = `[Đã sinh 3 Option Logo Vector | AI Palette: ${aiDesign.palette.map((c) => c.hex).join(", ")}]`;
    const designerVisualNotes = `[${orderSummary} | FLUX.1 Moodboard: ${moodboardUrl}]`;
    const status = payload.status || "Pending";
    const proposalUrl = `/proposal/${nextProjectId}`;

    const csvRow = formatCSVRow([
      nextProjectId,
      payload.client_name,
      clientContact,
      payload.brand_name,
      industryTarget,
      styleVibe,
      aiStoryFormatted,
      paletteSummary,
      aiTypographyFormatted,
      aiMoodboardFormatted,
      aiMockupFormatted,
      designerPaletteFont,
      designerVisualNotes,
      status,
      proposalUrl
    ]) + "\n";

    fs.appendFileSync(csvPath, csvRow, "utf8");

    console.log(`[API /api/brief] Đã hoàn tất lưu dự án ${nextProjectId} kèm 3 Option Vector và Moodboard FLUX.1!`);

    return NextResponse.json({
      success: true,
      message: `Brief "${payload.brand_name}" đã được phân tích tự động thành công với 3 Concept Logo và Moodboard FLUX.1!`,
      project_id: nextProjectId,
      payload: curatedRecord
    });
  } catch (error: any) {
    console.error("Lỗi khi xử lý Brief:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

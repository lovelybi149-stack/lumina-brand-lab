/**
 * LUMINA BRAND LAB — CURATION SERVICE
 * Quản lý đọc/ghi cơ sở dữ liệu `lumina_database.csv`, cập nhật trạng thái duyệt,
 * lưu trữ bản nháp, quản lý 3 Logo Options và cơ chế bàn giao theo gói.
 */

import fs from "fs";
import path from "path";
import { ProjectRecord, ProjectStatus, LogoOption } from "../types/curation";
import { generateBrandAssets } from "./exportGenerator";
import { buildDefaultLogoOptions, regenerateOptionSvg } from "./svgUtils";
import { detectIndustryCategory, getIndustryBrandKit } from "./industryBrandKit";

const CSV_PATH = path.join(process.cwd(), "lumina_database.csv");
const CURATED_DIR = path.join(process.cwd(), "curated_records");

// Default Brand Kit fallback (từ brand_identity.json)
function getDefaultBrandIdentity() {
  const jsonPath = path.join(process.cwd(), "brand_identity.json");
  if (fs.existsSync(jsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (e) {
      console.error("Lỗi đọc brand_identity.json:", e);
    }
  }
  return null;
}

// RFC-4180 CSV Parser
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\r") {
        // ignore carriage return
      } else if (char === "\n") {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

// Convert string array to CSV formatted row
export function formatCSVRow(fields: string[]): string {
  return fields
    .map((field) => {
      const f = field || "";
      if (f.includes('"') || f.includes(",") || f.includes("\n") || f.includes("\r")) {
        return `"${f.replace(/"/g, '""')}"`;
      }
      return f;
    })
    .join(",");
}

/**
 * Tính toán Mã dự án tiếp theo một cách an toàn và tự động tăng dần (LUMINA-XX)
 * Quét toàn bộ CSV, thư mục curated_records/ và brief_records/ để tìm ID cao nhất
 */
export function getNextProjectId(): string {
  const ids: number[] = [];

  // 1. Quét CSV
  if (fs.existsSync(CSV_PATH)) {
    try {
      const content = fs.readFileSync(CSV_PATH, "utf8");
      const matches = content.match(/LUMINA-(\d+)/gi) || [];
      for (const m of matches) {
        const num = parseInt(m.split("-")[1], 10);
        if (!isNaN(num)) ids.push(num);
      }
    } catch (_) {}
  }

  // 2. Quét curated_records
  if (fs.existsSync(CURATED_DIR)) {
    try {
      const files = fs.readdirSync(CURATED_DIR);
      for (const f of files) {
        const m = f.match(/LUMINA-(\d+)/i);
        if (m && m[1]) ids.push(parseInt(m[1], 10));
      }
    } catch (_) {}
  }

  // 3. Quét brief_records
  const briefDir = path.join(process.cwd(), "brief_records");
  if (fs.existsSync(briefDir)) {
    try {
      const files = fs.readdirSync(briefDir);
      for (const f of files) {
        const m = f.match(/LUMINA-(\d+)/i);
        if (m && m[1]) ids.push(parseInt(m[1], 10));
      }
    } catch (_) {}
  }

  const maxId = ids.length > 0 ? Math.max(...ids) : 4;
  return `LUMINA-${String(maxId + 1).padStart(2, "0")}`;
}

/**
 * Đọc toàn bộ danh sách dự án từ Database
 */
export async function getAllProjects(): Promise<ProjectRecord[]> {
  const defaultKit = getDefaultBrandIdentity();

  if (!fs.existsSync(CSV_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(CSV_PATH, "utf8");
  // Bỏ BOM nếu có
  const cleanRaw = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const rows = parseCSV(cleanRaw);

  if (rows.length <= 1) return [];

  const headers = rows[0];
  const dataRows = rows.slice(1).filter((r) => r.length > 1 && r[0].trim().length > 0);

  const projects: ProjectRecord[] = [];

  for (const r of dataRows) {
    const projectId = r[0]?.trim();
    const clientName = r[1]?.trim() || "Khách hàng Lumina";
    const contact = r[2]?.trim() || "";
    const brandName = r[3]?.trim() || "Thương hiệu";
    const industryTarget = r[4]?.trim() || "";
    const styleVibeStr = r[5]?.trim() || "";
    const aiStory = r[6]?.trim() || "";
    const aiPalette = r[7]?.trim() || "";
    const aiTypo = r[8]?.trim() || "";
    const moodboardUrl = r[9]?.trim() || "";
    const mockupUrl = r[10]?.trim() || "";
    const designerPaletteFont = r[11]?.trim() || "";
    const designerVisualNotes = r[12]?.trim() || "";
    const status = (r[13]?.trim() as ProjectStatus) || "Pending";
    const proposalUrl = r[14]?.trim() || "";

    // Phân tách SĐT và Email
    const contactParts = contact.split("/").map((s) => s.trim());
    const clientPhone = contactParts[0] || "0912.839.201";
    const clientEmail = contactParts[1] || "client@lumina.lab";

    // Phân tách Industry và Target
    const indParts = industryTarget.split(". Target: ");
    const industry = indParts[0] || "F&B Specialty Coffee";
    const targetAudience = indParts[1] || "Khách hàng yêu thích sự tinh tế, mộc mạc và chuẩn gu thẩm mỹ";

    // Phân tách Style vibes
    const styleVibes = styleVibeStr
      ? styleVibeStr.split(",").map((s) => s.trim())
      : ["Artisanal", "Modernism", "Warm & Earthy", "Wabi-sabi"];

    // Kiểm tra xem đã có bản ghi curated đã lưu trước đó không
    const curatedFile = path.join(CURATED_DIR, `${projectId}.json`);
    if (fs.existsSync(curatedFile)) {
      try {
        const savedProject: ProjectRecord = JSON.parse(fs.readFileSync(curatedFile, "utf8"));
        // Đảm bảo có đủ 3 logo_options
        if (!savedProject.logo_options || savedProject.logo_options.length === 0) {
          savedProject.logo_options = buildDefaultLogoOptions(
            savedProject.brand_name,
            savedProject.tagline,
            savedProject.palette,
            savedProject.typography,
            savedProject.logo_svg
          );
        }
        if (!savedProject.selected_logo_id) savedProject.selected_logo_id = "opt_1";
        if (!savedProject.order_tier) savedProject.order_tier = "pro";
        if (!savedProject.delivery_mode) savedProject.delivery_mode = "client_choice";
        if (!savedProject.revision_rounds) savedProject.revision_rounds = (savedProject.project_id === "LUMINA-02" ? 1 : 2);
        if (!savedProject.current_revision) savedProject.current_revision = 1;
        if (!savedProject.logo_options_count) savedProject.logo_options_count = (savedProject.order_tier === "pro" ? 3 : 1);
        if (!savedProject.delivery_time) savedProject.delivery_time = (savedProject.project_id === "LUMINA-01" || savedProject.project_id === "LUMINA-04" ? "24h" : "3d");
        if (!savedProject.review_status) savedProject.review_status = "Pending_Review";

        projects.push(savedProject);
        continue;
      } catch (err) {
        console.error(`Lỗi đọc file curated ${curatedFile}:`, err);
      }
    }

    // Phân loại ngành nghề và khởi tạo Brand Kit theo đúng ngành (không dùng fallback cà phê cho mọi ngành)
    const indCategory = detectIndustryCategory(industry, targetAudience, brandName);
    const dynamicKit = getIndustryBrandKit(indCategory, brandName, targetAudience);

    // Xác định tagline
    let tagline = dynamicKit.tagline;
    if (aiStory && !aiStory.startsWith("[Hệ thống AI đang khởi tạo")) {
      const matchSlogan = aiStory.match(/Slogan:\s*["“]([^"”]+)["”]/i);
      if (matchSlogan && matchSlogan[1]) {
        tagline = matchSlogan[1];
      }
    } else if (projectId === "LUMINA-01" || projectId === "LUMINA-03") {
      tagline = defaultKit?.taglines?.[0] || "Chạm chất mộc, lắng tiếng gió reo";
    }

    // Xác định Brand Story
    let brandStory = dynamicKit.brandStory;
    if (aiStory && !aiStory.startsWith("[Hệ thống AI đang khởi tạo")) {
      brandStory = aiStory;
    } else if ((projectId === "LUMINA-01" || projectId === "LUMINA-03") && defaultKit?.brand_story) {
      brandStory = defaultKit.brand_story;
    }

    // Xác định Palette
    let palette = dynamicKit.palette;
    if ((projectId === "LUMINA-01" || projectId === "LUMINA-03") && defaultKit?.color_palette) {
      palette = defaultKit.color_palette.map((c: any) => ({
        role: c.role.includes("Primary") ? "Primary" : c.role.includes("Secondary") ? "Secondary" : c.role.includes("Accent") ? "Accent" : "Neutral",
        name: c.name,
        hex: c.hex,
        rgb: c.rgb,
        usage: c.usage
      }));
    }

    // Xác định Typography
    const typography = ((projectId === "LUMINA-01" || projectId === "LUMINA-03") && defaultKit?.typography)
      ? {
          heading: defaultKit.typography.heading_font || "Fraunces",
          body: defaultKit.typography.body_font || "Be Vietnam Pro",
          pairing_rationale: defaultKit.typography.pairing_rationale,
          google_fonts_url: defaultKit.typography.google_fonts_url
        }
      : dynamicKit.typography;

    // Khởi tạo 3 Option Logo Master
    const logoOptions = (projectId === "LUMINA-01" || projectId === "LUMINA-03")
      ? buildDefaultLogoOptions(brandName, tagline, palette, typography, defaultKit?.logo_design_svg || "", industry)
      : dynamicKit.options;

    const selectedLogoId: "opt_1" | "opt_2" | "opt_3" = "opt_1";
    const activeLogoSvg = logoOptions[0]?.svg || dynamicKit.options[0]?.svg || "";

    // Kiểm tra brief_records để lấy order_config nếu có
    const briefDir = path.join(process.cwd(), "brief_records");
    let briefOrderConfig: any = null;
    if (fs.existsSync(briefDir)) {
      const briefFiles = fs.readdirSync(briefDir);
      const matched = briefFiles.find((f) => f.startsWith(`${projectId}_`));
      if (matched) {
        try {
          const rawBrief = JSON.parse(fs.readFileSync(path.join(briefDir, matched), "utf8"));
          if (rawBrief.order_config) {
            briefOrderConfig = rawBrief.order_config;
          }
        } catch (_) {}
      }
    }

    let orderTier: "standard" | "pro" = projectId === "LUMINA-02" ? "standard" : "pro";
    let deliveryMode: "single" | "client_choice" = projectId === "LUMINA-02" ? "single" : "client_choice";
    let deliveryTime: "24h" | "3d" = (projectId === "LUMINA-01" || projectId === "LUMINA-04") ? "24h" : "3d";
    let logoOptionsCount: 1 | 3 = (projectId === "LUMINA-03") ? 3 : 1;
    let revisionRounds: number = (projectId === "LUMINA-02") ? 1 : 2;
    let currentRevision: number = 1;

    if (briefOrderConfig) {
      orderTier = briefOrderConfig.logo_options_count === 3 ? "pro" : "standard";
      deliveryMode = briefOrderConfig.logo_options_count === 3 ? "client_choice" : "single";
      deliveryTime = briefOrderConfig.delivery_time || deliveryTime;
      logoOptionsCount = briefOrderConfig.logo_options_count || logoOptionsCount;
      revisionRounds = briefOrderConfig.revision_rounds || revisionRounds;
    }

    projects.push({
      project_id: projectId,
      brand_name: brandName,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      industry,
      target_audience: targetAudience,
      logo_format: "Combination Mark",
      color_tone: indCategory === "tech"
        ? "Cool & Tech (Electric Blue, Cyan Laser & Xám Chì)"
        : indCategory === "fashion"
        ? "Quiet Luxury (Đen Tuyền, Vàng Champagne & Be Lụa)"
        : indCategory === "printing"
        ? "Precision CMYK (Cyan Chuẩn, Xám Chì & Trắng Phủ)"
        : "Màu mộc ấm Wabi-sabi (Đất trầm, Thảo mộc & Kem cát)",
      style_vibes: styleVibes,
      submitted_at: "2026-10-31T22:30:00Z",
      status,
      approved_at: status === "Approved" ? "2026-11-01T00:15:00Z" : undefined,

      order_tier: orderTier,
      logo_options: logoOptions,
      selected_logo_id: selectedLogoId,
      delivery_mode: deliveryMode,

      // Cấu hình đơn hàng & Review portal
      delivery_time: deliveryTime,
      logo_options_count: logoOptionsCount,
      revision_rounds: revisionRounds,
      current_revision: currentRevision,
      review_status: "Pending_Review",

      brand_story: brandStory,
      tagline,
      tagline_options: dynamicKit.taglines,
      palette,
      typography,
      logo_svg: activeLogoSvg,
      original_logo_svg: activeLogoSvg,
      logo_layout: {
        layout: "stacked",
        iconScale: 1.0,
        iconPosX: 0,
        iconPosY: 0,
        iconShape: indCategory === "tech" ? "tech" : indCategory === "fashion" ? "luxury" : indCategory === "printing" ? "monogram" : "organic",
        letterSpacing: 0.16,
        iconColor: palette[0]?.hex || "#0A84FF",
        titleColor: palette[0]?.hex || "#0A84FF",
        taglineColor: palette[2]?.hex || "#00F2FE",
        bgColor: palette[3]?.hex || "#F5F5F7"
      },
      mockups: ((projectId === "LUMINA-01" || projectId === "LUMINA-03") && defaultKit?.mockup_directions)
        ? defaultKit.mockup_directions
        : dynamicKit.mockups,
      moodboard_url: moodboardUrl,
      mockup_url: mockupUrl,
      export_links: status === "Approved" ? {
        svg_url: `/downloads/${projectId}/logo_master.svg`,
        png_url: `/downloads/${projectId}/logo_transparent.png`,
        pdf_url: `/downloads/${projectId}/brand_guideline.pdf`,
        client_proposal_url: proposalUrl.startsWith("http") ? proposalUrl : `/p/${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      } : undefined
    });
  }

  // Đọc thêm tất cả các project có trong curated_records mà chưa có trong CSV
  if (fs.existsSync(CURATED_DIR)) {
    const existingIds = new Set(projects.map((p) => p.project_id.toUpperCase()));
    const curatedFiles = fs.readdirSync(CURATED_DIR).filter((f) => f.endsWith(".json"));
    for (const file of curatedFiles) {
      const pid = file.replace(".json", "");
      if (!existingIds.has(pid.toUpperCase())) {
        try {
          const saved: ProjectRecord = JSON.parse(fs.readFileSync(path.join(CURATED_DIR, file), "utf8"));
          if (saved && saved.project_id) {
            projects.push(saved);
            existingIds.add(saved.project_id.toUpperCase());
          }
        } catch (_) {}
      }
    }
  }

  // Sắp xếp đơn hàng mới nhất lên đầu danh sách (theo số hiệu LUMINA-XX giảm dần)
  projects.sort((a, b) => {
    const numA = parseInt((a.project_id.match(/\d+/) || ["0"])[0], 10);
    const numB = parseInt((b.project_id.match(/\d+/) || ["0"])[0], 10);
    return numB - numA;
  });

  return projects;
}

/**
 * Lấy chi tiết một dự án theo ID
 */
export async function getProjectById(projectId: string): Promise<ProjectRecord | null> {
  // Ưu tiên đọc trực tiếp từ hồ sơ curated_records (nhanh và lưu đầy đủ 3 Options Logo + Moodboard)
  const curatedFile = path.join(CURATED_DIR, `${projectId}.json`);
  if (fs.existsSync(curatedFile)) {
    try {
      const saved = JSON.parse(fs.readFileSync(curatedFile, "utf8"));
      if (saved && saved.project_id) return saved;
    } catch (e) {
      console.error(`Lỗi đọc file curated ${curatedFile}:`, e);
    }
  }

  const projects = await getAllProjects();
  return projects.find((p) => p.project_id.toLowerCase() === projectId.toLowerCase()) || null;
}

/**
 * Lưu bản nháp (Save Draft)
 */
export async function saveProjectDraft(project: ProjectRecord): Promise<void> {
  if (!fs.existsSync(CURATED_DIR)) {
    fs.mkdirSync(CURATED_DIR, { recursive: true });
  }

  const filePath = path.join(CURATED_DIR, `${project.project_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf8");
}

/**
 * Khách hàng hoặc Admin chọn Option chính thức
 */
export async function selectProjectLogoOption(
  projectId: string,
  optionId: "opt_1" | "opt_2" | "opt_3"
): Promise<{ success: boolean; project: ProjectRecord }> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);

  const chosenOption = project.logo_options?.find((o) => o.id === optionId) || project.logo_options?.[0];
  if (!chosenOption) throw new Error(`Không tìm thấy option: ${optionId}`);

  project.selected_logo_id = optionId;
  project.logo_svg = chosenOption.svg;

  // Nếu đã approved, tái xuất bản file xuất khẩu theo option mới
  if (project.status === "Approved") {
    const exportLinks = await generateBrandAssets(project);
    project.export_links = exportLinks;
  }

  await saveProjectDraft(project);

  return { success: true, project };
}

/**
 * Tái tạo riêng 1 Option bằng AI
 */
export async function regenerateProjectOption(
  projectId: string,
  optionId: "opt_1" | "opt_2" | "opt_3",
  prompt: string
): Promise<{ success: boolean; project: ProjectRecord; newSvg: string; rationale: string }> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);

  const optIndex = project.logo_options?.findIndex((o) => o.id === optionId) ?? -1;
  if (optIndex === -1) throw new Error(`Không tìm thấy option: ${optionId}`);

  const currentOpt = project.logo_options[optIndex];
  const { newSvg, rationale, title } = regenerateOptionSvg(optionId, prompt, currentOpt.svg, project.palette);

  project.logo_options[optIndex] = {
    ...currentOpt,
    svg: newSvg,
    title: `${currentOpt.title.split(" (")[0]} (AI Refined)`
  };

  if (project.selected_logo_id === optionId) {
    project.logo_svg = newSvg;
  }

  await saveProjectDraft(project);

  return { success: true, project, newSvg, rationale };
}

/**
 * Phê duyệt và Xuất bản trọn bộ file (Approve & Export)
 */
export async function approveAndPublishProject(
  projectId: string,
  curatedData: Partial<ProjectRecord>
): Promise<{
  success: boolean;
  project: ProjectRecord;
  export_links: {
    svg_url: string;
    png_url: string;
    pdf_url: string;
    client_proposal_url: string;
  };
}> {
  const existing = await getProjectById(projectId);
  if (!existing) {
    throw new Error(`Không tìm thấy dự án với mã: ${projectId}`);
  }

  const now = new Date().toISOString();

  // Xác định option được chọn
  const selectedLogoId = curatedData.selected_logo_id || existing.selected_logo_id || "opt_1";
  const logoOptions = curatedData.logo_options || existing.logo_options || [];
  const chosenOption = logoOptions.find((o) => o.id === selectedLogoId) || logoOptions[0];
  const finalSvg = chosenOption?.svg || curatedData.logo_svg || existing.logo_svg;

  // Hợp nhất dữ liệu mới nhất
  const updatedProject: ProjectRecord = {
    ...existing,
    ...curatedData,
    project_id: projectId,
    status: "Approved",
    approved_at: now,
    selected_logo_id: selectedLogoId,
    logo_svg: finalSvg,
    logo_options: logoOptions,
    delivery_mode: curatedData.delivery_mode || existing.delivery_mode || "client_choice",
    order_tier: curatedData.order_tier || existing.order_tier || "pro"
  };

  // 1. Tạo các file xuất bản thực tế (SVG master, 3 Option SVGs, PNG 300 DPI, PDF 4 trang)
  const exportLinks = await generateBrandAssets(updatedProject);
  updatedProject.export_links = exportLinks;

  // 2. Lưu file curated JSON
  await saveProjectDraft(updatedProject);

  // 3. Cập nhật lumina_database.csv
  if (fs.existsSync(CSV_PATH)) {
    const raw = fs.readFileSync(CSV_PATH, "utf8");
    const hasBOM = raw.charCodeAt(0) === 0xfeff;
    const cleanRaw = hasBOM ? raw.slice(1) : raw;
    const rows = parseCSV(cleanRaw);

    const updatedRows = rows.map((r, idx) => {
      if (idx === 0) return r; // Header row
      if (r[0]?.trim() === projectId) {
        // col 11: designer_final_palette_font
        const paletteSummary = updatedProject.palette.map((c) => `${c.hex} (${c.name})`).join(", ");
        r[11] = `ĐÃ DUYỆT THẨM MỸ: Bảng màu [${paletteSummary}]. Font [${updatedProject.typography.heading} / ${updatedProject.typography.body}]`;
        // col 12: designer_final_visual_notes
        const modeLabel = updatedProject.delivery_mode === "client_choice" ? "Khách chọn 1 trong 3" : "Bản chốt duy nhất";
        r[12] = `HOÀN TẤT CURATION: Gói [${updatedProject.order_tier?.toUpperCase()}]. Chế độ bàn giao [${modeLabel}]. Option chốt [${selectedLogoId}]. Xuất trọn bộ vector & brand guideline PDF.`;
        // col 13: status
        r[13] = "Approved";
        // col 14: proposal_url
        r[14] = exportLinks.client_proposal_url;
      }
      return r;
    });

    const csvOutput = (hasBOM ? "\ufeff" : "") + updatedRows.map((r) => formatCSVRow(r)).join("\n");
    fs.writeFileSync(CSV_PATH, csvOutput, "utf8");
  }

  return {
    success: true,
    project: updatedProject,
    export_links: exportLinks
  };
}

/**
 * Khách hàng nộp phản hồi duyệt mẫu từ Client Review Portal
 */
export async function submitClientReviewFeedback(
  projectId: string,
  selectedLogoId: "opt_1" | "opt_2" | "opt_3",
  comment: string,
  feedbackType: "revision" | "approve_final" = "revision"
): Promise<{ success: boolean; project: ProjectRecord; message: string }> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);

  // Chốt option được chọn
  project.selected_logo_id = selectedLogoId;
  const chosenOpt = project.logo_options?.find((o) => o.id === selectedLogoId);
  if (chosenOpt) {
    project.logo_svg = chosenOpt.svg;
  }

  // Khởi tạo feedback_history nếu chưa có
  if (!project.feedback_history) {
    project.feedback_history = [];
  }

  const currentRound = project.current_revision || 1;

  project.feedback_history.push({
    revision_round: currentRound,
    selected_option_id: selectedLogoId,
    comment: comment.trim(),
    submitted_at: new Date().toISOString(),
    feedback_type: feedbackType,
  });

  project.client_feedback = comment.trim();

  if (feedbackType === "approve_final") {
    project.review_status = "Final_Approved";
    project.status = "Awaiting_Payment";
    project.payment_status = "unpaid";
    project.payment_amount = project.order_tier === "standard" ? 1500000 : 2500000;
    project.has_unread_feedback = true;
    project.admin_notification = `Đơn hàng [${project.project_id}]: Khách hàng ${project.client_name} đã đồng ý nghiệm thu! Đang chờ thanh toán VietQR.`;
  } else {
    project.review_status = "Feedback_Submitted";
    project.status = "Admin_Revising";
    project.has_unread_feedback = true;
    project.admin_notification = `Đơn hàng [${project.project_id}]: Khách vừa gửi yêu cầu sửa đổi đợt ${currentRound}!`;
  }

  // Lưu lại vào file curated
  await saveProjectDraft(project);

  return {
    success: true,
    project,
    message: feedbackType === "approve_final"
      ? "Bạn đã phê duyệt chốt bản thiết kế thành công! Vui lòng hoàn tất thanh toán để tải trọn bộ file bàn giao."
      : `Phản hồi đợt ${currentRound} của bạn đã được chuyển đến Bàn làm việc của Giám đốc Sáng tạo! Đội ngũ Lumina sẽ tiến hành tinh chỉnh theo yêu cầu.`,
  };
}

/**
 * Admin gửi bản thiết kế cho khách duyệt (Đợt 1 hoặc Bản chốt nghiệm thu)
 */
export async function sendProjectToClientReview(
  projectId: string,
  isFinal: boolean = false
): Promise<{ success: boolean; project: ProjectRecord; notificationMessage: string }> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);

  // Đánh dấu đã đọc feedback cũ
  project.has_unread_feedback = false;
  project.admin_notification = undefined;

  const totalRounds = project.revision_rounds || (project.project_id === "LUMINA-02" ? 1 : 2);
  let currentRound = project.current_revision || 1;

  // Nếu đang ở trạng thái Admin_Revising và vừa sửa xong đợt 1 -> chuyển sang đợt 2
  if (project.status === "Admin_Revising" && currentRound === 1 && totalRounds > 1) {
    currentRound = 2;
    project.current_revision = 2;
  }

  const isFinalReview = isFinal || totalRounds === 1 || currentRound >= totalRounds;

  if (isFinalReview) {
    project.status = "Waiting_Client_Final_Approval";
    project.review_status = "Waiting_Client_Final_Approval";
  } else {
    project.status = "Client_Reviewing";
    project.review_status = "Pending_Review";
  }

  await saveProjectDraft(project);

  const notificationMessage = isFinalReview
    ? `Lumina đã gửi Bản chốt nghiệm thu cuối cùng tới khách hàng ${project.client_name} qua SĐT/Email. Mời khách truy cập mục Tra cứu để xem mẫu chốt!`
    : `Lumina đã hoàn tất Concept đợt ${currentRound}. Đã gửi thông báo đến khách hàng ${project.client_name}. Mời khách truy cập mục Tra cứu để xem mẫu!`;

  return {
    success: true,
    project,
    notificationMessage,
  };
}

/**
 * Đánh dấu đã đọc góp ý của khách hàng
 */
export async function markFeedbackAsRead(projectId: string): Promise<ProjectRecord> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);
  project.has_unread_feedback = false;
  project.admin_notification = undefined;
  await saveProjectDraft(project);
  return project;
}

/**
 * Khách hàng thanh toán VietQR thành công & Hoàn tất bàn giao đơn hàng
 * Tự động đồng bộ và lưu vào Thư viện mẫu thiết kế (data/libraryAssets.json)
 */
export async function completeAndArchiveProject(
  projectId: string,
  paymentRef?: string
): Promise<{
  success: boolean;
  project: ProjectRecord;
  export_links: {
    svg_url: string;
    png_url: string;
    pdf_url: string;
    client_proposal_url: string;
  };
}> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error(`Không tìm thấy dự án ${projectId}`);

  const now = new Date().toISOString();

  // 1. Cập nhật trạng thái hoàn tất
  project.status = "Completed";
  project.review_status = "Completed";
  project.payment_status = "paid";
  project.payment_time = now;
  project.payment_ref = paymentRef || `MB-${Math.floor(100000 + Math.random() * 900000)}`;
  project.approved_at = project.approved_at || now;
  project.has_unread_feedback = false;
  project.admin_notification = undefined;

  // 2. Biên dịch trọn bộ file bàn giao
  const exportLinks = await generateBrandAssets(project);
  project.export_links = exportLinks;

  // Lưu file curated JSON
  await saveProjectDraft(project);

  // 3. Sao chép tài nguyên vào thư mục /public/generated/${projectId} để Thư viện nhận diện
  const genDir = path.join(process.cwd(), "public", "generated", projectId);
  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir, { recursive: true });
  }

  const downloadsDir = path.join(process.cwd(), "public", "downloads", projectId);
  if (fs.existsSync(downloadsDir)) {
    const filesToCopy = ["logo_master.svg", "logo_transparent.png", "brand_guideline.pdf", "logo_option_1.svg", "logo_option_2.svg", "logo_option_3.svg"];
    for (const f of filesToCopy) {
      const src = path.join(downloadsDir, f);
      const dst = path.join(genDir, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
      }
    }
  }

  // 4. TỰ ĐỘNG LƯU VÀO data/libraryAssets.json
  const libraryDataPath = path.join(process.cwd(), "data", "libraryAssets.json");
  try {
    let assets: any[] = [];
    if (fs.existsSync(libraryDataPath)) {
      assets = JSON.parse(fs.readFileSync(libraryDataPath, "utf8"));
    }

    const assetId = `design-${projectId.toLowerCase()}`;
    const existingIndex = assets.findIndex((a) => a.id === assetId || a.id === projectId);

    const newLibraryAsset = {
      id: assetId,
      type: "mockup",
      title: `${project.brand_name} (${project.project_id})`,
      category: "Mẫu do Web thiết kế",
      industry: [project.industry || "All", "Mẫu do Web thiết kế"],
      preview_url: `/downloads/${projectId}/logo_master.svg`,
      dimensions: "1400 × 1200 px",
      file_format: "SVG / PNG 300 DPI",
      created_at: now,
      metadata: {
        brand_name: project.brand_name,
        tagline: project.tagline,
        order_tier: project.order_tier,
        client_name: project.client_name,
        download_svg: exportLinks.svg_url,
        download_png: exportLinks.png_url,
        download_pdf: exportLinks.pdf_url,
      }
    };

    if (existingIndex >= 0) {
      assets[existingIndex] = { ...assets[existingIndex], ...newLibraryAsset };
    } else {
      assets.unshift(newLibraryAsset); // Đưa lên đầu thư viện
    }

    fs.writeFileSync(libraryDataPath, JSON.stringify(assets, null, 2), "utf8");
  } catch (err) {
    console.error("Lỗi khi ghi vào libraryAssets.json:", err);
  }

  // 5. Cập nhật lumina_database.csv
  if (fs.existsSync(CSV_PATH)) {
    try {
      const raw = fs.readFileSync(CSV_PATH, "utf8");
      const hasBOM = raw.charCodeAt(0) === 0xfeff;
      const cleanRaw = hasBOM ? raw.slice(1) : raw;
      const rows = parseCSV(cleanRaw);

      const updatedRows = rows.map((r, idx) => {
        if (idx === 0) return r;
        if (r[0]?.trim() === projectId) {
          r[13] = "Approved"; // hoặc Completed
          r[14] = exportLinks.client_proposal_url;
        }
        return r;
      });

      const csvOutput = (hasBOM ? "\ufeff" : "") + updatedRows.map((r) => formatCSVRow(r)).join("\n");
      fs.writeFileSync(CSV_PATH, csvOutput, "utf8");
    } catch (e) {
      console.error("Lỗi cập nhật CSV khi hoàn tất:", e);
    }
  }

  return {
    success: true,
    project,
    export_links: exportLinks,
  };
}

import { NextRequest, NextResponse } from "next/server";
import { getProjectById, saveProjectDraft } from "../../../../../lib/curationService";
import { generateAiVariationSvg } from "../../../../../lib/svgUtils";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

/**
 * API Route: POST /api/projects/[id]/ai-variation
 * Gọi trực tiếp Google Gemini 2.5 Flash để vẽ lại mã vector SVG theo yêu cầu của Admin.
 * Có cơ chế Intelligent Parametric Fallback đảm bảo không bao giờ bị gián đoạn.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { prompt, currentSvg, optionId } = await request.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập yêu cầu biến thể cho AI." },
        { status: 400 }
      );
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy dự án ${projectId}` },
        { status: 404 }
      );
    }

    const baseSvg = currentSvg || project.logo_svg || "";
    let newSvg = "";
    let rationale = "";
    let variationName = "AI Gemini Vector Refined";

    // 1. Kết nối Google Gemini API thật qua thư viện @google/genai (model: gemini-2.5-flash)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are an expert SVG Vector Graphic Designer for LUMINA BRAND LAB design studio.
Your task is to redesign or adjust the provided SVG logo vector according to the Creative Director's instruction: "${prompt.trim()}".

Brand Context:
- Brand Name: "${project.brand_name}"
- Tagline: "${project.tagline}"
- Industry: "${project.industry}"
- Target Audience: "${project.target_audience}"
- Color Palette: ${JSON.stringify(project.palette?.map((c) => `${c.role}: ${c.hex} (${c.name})`))}

Current SVG Code:
\`\`\`xml
${baseSvg}
\`\`\`

CRITICAL DESIGN & CODE RULES:
1. Output MUST be ONLY valid SVG vector code inside <svg ...>...</svg>.
2. Dimensions: viewBox="0 0 500 500" width="100%" height="100%".
3. Root must contain:
   - <defs><style>...</style></defs> with proper Google fonts import and styles.
   - Background rect: <rect width="500" height="500" fill="..." rx="28"/>
   - Icon emblem group: <g id="logo-emblem" transform="translate(250, 185) scale(1)"> containing the symbol / icon vector paths.
   - Typography group: <g id="logo-typography"> containing the brand title and tagline.
4. MUST fully satisfy the user's command: "${prompt.trim()}". For example, if asked for an isometric 3D cube or tech nodes, draw precise geometric polygons. If asked for thicker lines, adjust strokes.
5. Do NOT use HTML entities (e.g. &bull;, &copy;, &mdash;). Use Unicode characters like • or clean ASCII.
6. Return only the raw SVG code (optionally inside \`\`\`xml ... \`\`\`). No conversational text or markdown explanation.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: systemPrompt
        });

        const rawText = response.text || "";
        const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch && svgMatch[0].length > 100) {
          newSvg = svgMatch[0]
            .replace(/&bull;/g, "•")
            .replace(/&mdash;/g, "—")
            .replace(/&ndash;/g, "–")
            .replace(/&copy;/g, "©");
          rationale = `Gemini 2.5 Flash đã tái tạo vector thành công theo yêu cầu: "${prompt.trim()}".`;
          variationName = "Gemini 2.5 Flash AI Refined";
        }
      } catch (geminiError: any) {
        console.warn("Gọi Gemini 2.5 Flash gặp sự cố, kích hoạt Parametric Engine fallback:", geminiError?.message || geminiError);
      }
    }

    // 2. Fallback sang Lumina Parametric Engine nếu chưa có API key hoặc network timeout
    if (!newSvg) {
      const fallback = generateAiVariationSvg(baseSvg, prompt.trim(), project.palette);
      newSvg = fallback.newSvg;
      rationale = apiKey
        ? `Đã tinh chỉnh vector theo yêu cầu: "${prompt.trim()}" (Lumina Parametric Engine).`
        : `Đã tinh chỉnh vector theo yêu cầu: "${prompt.trim()}". (Cấu hình GEMINI_API_KEY trong .env để gọi trực tiếp model Gemini 2.5 Flash).`;
      variationName = fallback.variationName;
    }

    // 3. Cập nhật vào Option và toàn bộ bản thiết kế
    const targetOptId =
      optionId && ["opt_1", "opt_2", "opt_3"].includes(optionId)
        ? optionId
        : project.selected_logo_id || "opt_1";

    // Phân tích scale từ newSvg để đồng bộ settings
    const scaleMatch = newSvg.match(/<g\s+id=["']logo-emblem["'][^>]*transform=["'][^"']*scale\(([\d.]+)\)[^"']*["']/i);
    const newScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1.0;

    // Nếu người dùng yêu cầu đổi sang tông hồng (PINK)
    const pLower = prompt.toLowerCase();
    if (pLower.includes("pink") || pLower.includes("hồng") || pLower.includes("rose")) {
      project.palette = [
        { role: "Primary", name: "Rose Pink (Hồng Phấn Quý Phái)", hex: "#E05283", rgb: "rgb(224, 82, 131)" },
        { role: "Secondary", name: "Champagne Gold (Vàng Ánh Kim)", hex: "#D4AF37", rgb: "rgb(212, 175, 55)" },
        { role: "Accent", name: "Cherry Blossom (Hồng Anh Đào)", hex: "#F4A7B9", rgb: "rgb(244, 167, 185)" },
        { role: "Neutral", name: "Silk White (Trắng Lụa Phấn)", hex: "#FFF6F8", rgb: "rgb(255, 246, 248)" }
      ];
    } else if (pLower.includes("gold") || pLower.includes("vàng") || pLower.includes("champagne")) {
      project.palette = [
        { role: "Primary", name: "Champagne Gold (Vàng Ánh Kim)", hex: "#D4AF37", rgb: "rgb(212, 175, 55)" },
        { role: "Secondary", name: "Deep Obsidian (Đen Tuyền)", hex: "#111111", rgb: "rgb(17, 17, 17)" },
        { role: "Accent", name: "Warm Amber (Hổ Phách Ấm)", hex: "#F3E5AB", rgb: "rgb(243, 229, 171)" },
        { role: "Neutral", name: "Raw Silk Cream (Be Lụa Thô)", hex: "#FAF7F2", rgb: "rgb(250, 247, 242)" }
      ];
    }

    if (project.logo_options && Array.isArray(project.logo_options)) {
      const optIndex = project.logo_options.findIndex((o) => o.id === targetOptId);
      if (optIndex >= 0) {
        project.logo_options[optIndex].svg = newSvg;
        project.logo_options[optIndex].title = `${project.logo_options[optIndex].title.split(" (")[0]} (AI Refined)`;
        if (!project.logo_options[optIndex].settings) {
          project.logo_options[optIndex].settings = {
            iconScale: newScale,
            iconPosX: 0,
            iconPosY: 0,
            iconShape: "luxury",
            letterSpacing: 0.16,
            primaryColor: project.palette[0]?.hex || "#111111",
            layout: "stacked"
          };
        } else {
          project.logo_options[optIndex].settings.iconScale = newScale;
        }

        if (project.selected_logo_id === targetOptId || !project.selected_logo_id) {
          project.logo_svg = newSvg;
          if (project.logo_layout) {
            project.logo_layout.iconScale = newScale;
          }
        }
      }
    } else {
      project.logo_svg = newSvg;
    }

    await saveProjectDraft(project);

    return NextResponse.json({
      success: true,
      variationName,
      rationale,
      newSvg,
      project,
      optionId: targetOptId
    });
  } catch (error: any) {
    console.error("Lỗi AI variation:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi xử lý biến thể AI" },
      { status: 500 }
    );
  }
}

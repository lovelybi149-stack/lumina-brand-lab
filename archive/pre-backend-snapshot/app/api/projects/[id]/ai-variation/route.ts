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

    // 3. Nếu chỉ định Option cụ thể, cập nhật thẳng vào Option đó
    if (optionId && ["opt_1", "opt_2", "opt_3"].includes(optionId) && project.logo_options) {
      const optIndex = project.logo_options.findIndex((o) => o.id === optionId);
      if (optIndex >= 0) {
        project.logo_options[optIndex].svg = newSvg;
        project.logo_options[optIndex].title = `${project.logo_options[optIndex].title.split(" (")[0]} (AI Refined)`;
        if (project.selected_logo_id === optionId) {
          project.logo_svg = newSvg;
        }
        await saveProjectDraft(project);
      }
    } else {
      project.logo_svg = newSvg;
      await saveProjectDraft(project);
    }

    return NextResponse.json({
      success: true,
      variationName,
      rationale,
      newSvg,
      project,
      optionId
    });
  } catch (error: any) {
    console.error("Lỗi AI variation:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi xử lý biến thể AI" },
      { status: 500 }
    );
  }
}

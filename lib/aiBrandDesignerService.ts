/**
 * LUMINA BRAND LAB — AI BRAND DESIGNER SERVICE (BỘ NÃO AI THIẾT KẾ THƯƠNG HIỆU)
 * 
 * Chức năng:
 * - Tiếp nhận Brief từ khách hàng (Tên thương hiệu, Ngành nghề, Khách hàng mục tiêu, Tông màu, Phong cách).
 * - Tích hợp Kho tri thức hình học thiết kế (lib/designArchetypes.ts).
 * - Kết nối trực tiếp Google Gemini API (model: gemini-2.5-flash) qua thư viện @google/genai.
 * - Khởi tạo toàn bộ bản sắc thương hiệu:
 *   1. Câu chuyện thương hiệu (Brand Story <100 từ) & 3 Slogan đắt giá.
 *   2. Bảng màu 4 mã HEX chuẩn quy tắc 60-30-10 (Primary, Secondary, Accent, Neutral).
 *   3. Cặp font chữ Google Fonts tối ưu cho tiếng Việt.
 *   4. 3 CONCEPT LOGO VECTOR SVG RIÊNG BIỆT:
 *      + opt_1: Tối giản hình học hiện đại (Modern Geometric Minimalist).
 *      + opt_2: Biểu tượng cảm xúc & ẩn dụ ngành nghề (Emotional & Industry Metaphor).
 *      + opt_3: Monogram chữ cái đầu cách điệu (Stylized Initial Monogram).
 *   5. Hướng dẫn ứng dụng thực tế (Mockups: danh thiếp, bao bì, biển hiệu).
 * - Đi kèm Intelligent Parametric Engine đảm bảo 100% không bao giờ gặp lỗi nếu thiếu API Key.
 */

import { GoogleGenAI } from "@google/genai";
import type {
  ColorItem,
  LogoOption,
  MockupDescriptions,
  TypographyConfig,
  LogoLayoutConfig
} from "../types/curation";
import {
  DESIGN_ARCHETYPES,
  formatArchetypesForGeminiPrompt,
  getArchetypeForIndustry
} from "./designArchetypes";
import {
  detectIndustryCategory,
  getIndustryBrandKit,
  renderEmblemShape
} from "./industryBrandKit";

export interface BrandBriefInput {
  brand_name?: string;
  brandName?: string;
  industry?: string;
  target_audience?: string;
  targetAudience?: string;
  logo_format?: string;
  logoFormat?: string;
  color_tone?: string;
  colorTone?: string;
  style_vibes?: string[];
  styleVibes?: string[];
  slogan?: string;
  client_name?: string;
  clientName?: string;
  client_phone?: string;
  clientPhone?: string;
  client_email?: string;
  clientEmail?: string;
  order_config?: any;
}

export interface NormalizedBrandBrief {
  brand_name: string;
  industry: string;
  target_audience: string;
  logo_format: string;
  color_tone: string;
  style_vibes: string[];
  slogan?: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  order_config?: any;
}

export interface GeneratedBrandKit {
  brand_name: string;
  brand_story: string;
  tagline: string;
  tagline_options: string[];
  taglines: string[];
  palette: ColorItem[];
  typography: TypographyConfig;
  mockups: MockupDescriptions;
  logo_options: LogoOption[];
  selected_logo_id: "opt_1" | "opt_2" | "opt_3";
  logo_svg: string;
  original_logo_svg: string;
  logo_layout: LogoLayoutConfig;
  ai_generated_via: "gemini-2.5-flash" | "parametric-archetypes-engine";
}

/**
 * Chuẩn hóa tham số đầu vào (hỗ trợ cả camelCase và snake_case)
 */
function normalizeBriefInput(raw: BrandBriefInput): NormalizedBrandBrief {
  return {
    brand_name: (raw.brand_name || raw.brandName || "Thương Hiệu Mới").trim(),
    industry: (raw.industry || "Sáng tạo & Lối sống").trim(),
    target_audience: (raw.target_audience || raw.targetAudience || "Khách hàng hiện đại").trim(),
    logo_format: (raw.logo_format || raw.logoFormat || "Combination Mark").trim(),
    color_tone: (raw.color_tone || raw.colorTone || "Tự nhiên / Chuẩn ngành").trim(),
    style_vibes: Array.isArray(raw.style_vibes) ? raw.style_vibes : Array.isArray(raw.styleVibes) ? raw.styleVibes : ["Modern", "Minimalist"],
    slogan: raw.slogan?.trim(),
    client_name: (raw.client_name || raw.clientName || "Khách hàng").trim(),
    client_phone: (raw.client_phone || raw.clientPhone || "").trim(),
    client_email: (raw.client_email || raw.clientEmail || "").trim(),
    order_config: raw.order_config
  };
}

/**
 * Trích xuất JSON sạch từ phản hồi của AI
 */
function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  // Xóa markdown block ```json ... ```
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```xml\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  // Tìm dấu ngoặc { đầu tiên và } cuối cùng
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Kiểm tra xem chuỗi SVG có hợp lệ không
 */
function isValidSvg(svg: string): boolean {
  if (!svg || typeof svg !== "string") return false;
  return svg.includes("<svg") && svg.includes("</svg>") && svg.length > 200;
}

/**
 * Tạo bản thiết kế dự phòng chất lượng cao dựa trên Dynamic Industry Kit & Design Archetypes
 */
export function generateFallbackBrandKit(brief: BrandBriefInput): GeneratedBrandKit {
  const safe = normalizeBriefInput(brief);
  const indCat = detectIndustryCategory(safe.industry, safe.target_audience, safe.brand_name);
  const archetypeInfo = getArchetypeForIndustry(safe.industry, safe.style_vibes);
  const cleanName = (safe.brand_name || "Lumina").trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initial1 = words[0]?.charAt(0).toUpperCase() || "L";
  const initial2 = words.length > 1 ? words[1]?.charAt(0).toUpperCase() : (cleanName.charAt(1)?.toUpperCase() || "B");
  const monogramPair = `${initial1}${initial2}`;

  const dynamicKit = getIndustryBrandKit(
    indCat,
    safe.brand_name,
    safe.target_audience,
    safe.slogan && !safe.slogan.includes("Chưa có") ? safe.slogan : undefined
  );

  const pColor = dynamicKit.palette[0]?.hex || "#0A84FF";
  const sColor = dynamicKit.palette[1]?.hex || "#1C1C1E";
  const aColor = dynamicKit.palette[2]?.hex || "#00F2FE";
  const nColor = dynamicKit.palette[3]?.hex || "#F5F5F7";
  const hFont = dynamicKit.typography.heading;
  const bFont = dynamicKit.typography.body;

  // Sử dụng trực tiếp 3 options chuyên sâu chuẩn Agency từ dynamicKit
  const logoOptions: LogoOption[] = (dynamicKit.options && dynamicKit.options.length >= 3)
    ? dynamicKit.options
    : [
        {
          id: "opt_1",
          title: "Option 1: Bold Geometric Duo-Ligature Monogram",
          concept_note: "Khối biểu tượng chữ ghép liền nét với vệt góc nghiêng động học (AS Creative Archetype).",
          svg: dynamicKit.options?.[0]?.svg || "",
          settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: pColor, layout: "stacked" }
        },
        {
          id: "opt_2",
          title: "Option 2: Continuous Infinity Ribbon Ligature",
          concept_note: "Dải ruy băng vô cực uốn lượn liên hoàn không đứt đoạn, tượng trưng cho vẻ đẹp trường tồn.",
          svg: dynamicKit.options?.[1]?.svg || "",
          settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: pColor, layout: "stacked" }
        },
        {
          id: "opt_3",
          title: "Option 3: Concentric Golden Ratio Target",
          concept_note: "Hệ vành đai 4 tầng đồng tâm với khe mở tỷ lệ vàng tạo hình ký tự mở và tâm ngọc hội tụ quyền uy.",
          svg: dynamicKit.options?.[2]?.svg || "",
          settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.18, primaryColor: pColor, layout: "stacked" }
        }
      ];

  const primaryLogoSvg = logoOptions[0]?.svg || "";

  return {
    brand_name: safe.brand_name,
    brand_story: dynamicKit.brandStory,
    tagline: dynamicKit.tagline,
    tagline_options: dynamicKit.taglines,
    taglines: dynamicKit.taglines,
    palette: dynamicKit.palette,
    typography: dynamicKit.typography,
    mockups: dynamicKit.mockups,
    logo_options: logoOptions,
    selected_logo_id: "opt_1",
    logo_svg: primaryLogoSvg,
    original_logo_svg: primaryLogoSvg,
    logo_layout: {
      layout: "stacked",
      iconScale: 1.0,
      iconPosX: 0,
      iconPosY: 0,
      letterSpacing: 0.16,
      iconColor: pColor,
      titleColor: sColor,
      taglineColor: pColor,
      bgColor: nColor
    },
    ai_generated_via: "parametric-archetypes-engine"
  };
}

/**
 * HÀM CỐT LÕI: Gọi Google Gemini API 2.5 Flash để thiết kế bản sắc thương hiệu hoàn chỉnh
 */
export async function generateBrandIdentityWithAI(
  brief: BrandBriefInput
): Promise<GeneratedBrandKit> {
  const safe = normalizeBriefInput(brief);
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  // Nếu không có API Key trong môi trường, kích hoạt Parametric Archetypes Engine ngay
  if (!apiKey) {
    console.warn("⚠️ [AI Brand Designer] Không tìm thấy GEMINI_API_KEY. Kích hoạt Parametric Archetypes Engine...");
    return generateFallbackBrandKit(safe);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const archetypesKnowledge = formatArchetypesForGeminiPrompt();

    const systemPrompt = `You are the Creative Director and Principal Brand Designer at LUMINA BRAND LAB — an elite digital branding studio.
You are tasked with generating a comprehensive, production-ready Brand Identity Kit for a client who just submitted their brief.

<CLIENT_BRIEF>
- Brand Name: "${safe.brand_name}"
- Industry / Business Field: "${safe.industry}"
- Target Audience: "${safe.target_audience}"
- Preferred Logo Format: "${safe.logo_format}"
- Color Tone Preference: "${safe.color_tone}"
- Aesthetic Style & Emotional Vibes: "${safe.style_vibes.join(", ")}"
- Slogan Request: "${safe.slogan || "AI proposes top 3"}"
</CLIENT_BRIEF>

${archetypesKnowledge}

### STRICT PRODUCTION DESIGN REQUIREMENTS:
1. Brand Story: Under 100 words in Vietnamese. Highly evocative, positioning the brand's unique philosophy.
2. Taglines: Return 1 primary tagline and an array of 3 distinct, poetic slogans.
3. Color Palette: 4 colors strictly adhering to the 60-30-10 harmonic distribution:
   - Primary (Main brand color, dominant 60%)
   - Secondary (Text/Contrast 30%)
   - Accent (Vibrant highlight 10%)
   - Neutral (Card/Canvas background)
   Provide exact HEX and RGB values, poetic Vietnamese name, and usage description.
4. Typography: Select a harmonious Google Fonts pair that supports Vietnamese:
   - Heading font (e.g. Fraunces, Syne, Space Grotesk, Cormorant Garamond, Montserrat)
   - Body font (e.g. Plus Jakarta Sans, Be Vietnam Pro)
   - Include rationale and valid Google Fonts URL.
5. Mockup Directions: Realistic physical production specs for Namecard, Packaging, and Signage.
6. 3 DISTINCT VECTOR LOGO SVG OPTIONS (MUST BE PURE VECTOR CODE):
   - opt_1: Modern Geometric Minimalist (bám sát hình học đa giác, vi mạch hoặc tỷ lệ vàng của ngành)
   - opt_2: Emotional & Industry Metaphor (ẩn dụ thị giác giàu xúc cảm theo bản chất ngành hàng)
   - opt_3: Stylized Initial Monogram (chữ cái đầu của "${safe.brand_name.charAt(0).toUpperCase()}" lồng ghép khung biểu tượng độc quyền)

### RULES FOR SVG CODE:
- Each SVG must be a valid, standalone document: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">\`
- ONLY pure vector tags: \`<path>\`, \`<circle>\`, \`<rect>\`, \`<polygon>\`, \`<line>\`, \`<text>\`, \`<g>\`. ABSOLUTELY NO bitmap <image> tags.
- Include \`<defs><style>...</style></defs>\` importing Google Fonts and defining \`.brand-title\`, \`.brand-sub\`, \`.brand-tagline\`.
- Canvas background: \`<rect width="500" height="500" fill="..." rx="28"/>\`
- Emblem group: \`<g id="logo-emblem" transform="translate(250, 185) scale(1)">\`
- Typography group: \`<g id="logo-typography">\` centered at x="250" with brand title at y="336", subtitle at y="368", separator at y="388", and tagline at y="414".
- Text MUST display "${safe.brand_name.toUpperCase()}".

### OUTPUT FORMAT:
Output MUST be ONLY a single valid JSON object starting with '{' and ending with '}'. No conversational markdown or extra text.

JSON SCHEMA:
{
  "brand_story": "string",
  "tagline": "string",
  "tagline_options": ["string", "string", "string"],
  "palette": [
    { "role": "Primary", "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "usage": "string" },
    { "role": "Secondary", "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "usage": "string" },
    { "role": "Accent", "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "usage": "string" },
    { "role": "Neutral", "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "usage": "string" }
  ],
  "typography": {
    "heading": "string",
    "body": "string",
    "pairing_rationale": "string",
    "google_fonts_url": "string"
  },
  "mockup_directions": {
    "namecard": { "front": "string", "back": "string" },
    "packaging": { "type": "string", "description": "string" },
    "signage": { "type": "string", "description": "string" }
  },
  "logo_options": [
    {
      "id": "opt_1",
      "title": "Option 1: Tối Giản Hình Học Hiện Đại",
      "concept_note": "string",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'>...</svg>"
    },
    {
      "id": "opt_2",
      "title": "Option 2: Biểu Tượng Cảm Xúc & Ẩn Dụ Ngành Nghề",
      "concept_note": "string",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'>...</svg>"
    },
    {
      "id": "opt_3",
      "title": "Option 3: Monogram Chữ Cái Đầu Cách Điệu",
      "concept_note": "string",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'>...</svg>"
    }
  ]
}`;

    console.log(`🤖 [AI Brand Designer] Đang gửi Brief "${brief.brand_name}" tới Gemini 2.5 Flash...`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt
    });

    const rawOutput = response.text || "";
    const parsed = cleanAndParseJson(rawOutput);

    // Kiểm tra tính toàn vẹn của kết quả
    if (
      !parsed.brand_story ||
      !Array.isArray(parsed.palette) ||
      parsed.palette.length < 3 ||
      !Array.isArray(parsed.logo_options) ||
      parsed.logo_options.length === 0
    ) {
      throw new Error("Phản hồi từ Gemini 2.5 Flash thiếu các trường cốt lõi.");
    }

    // Đảm bảo 3 options logo có SVG hợp lệ
    const validatedLogoOptions: LogoOption[] = [];
    const fallbackKit = generateFallbackBrandKit(brief);

    for (let i = 0; i < 3; i++) {
      const optId = (`opt_${i + 1}`) as ("opt_1" | "opt_2" | "opt_3");
      const optFromAi = parsed.logo_options.find((o: any) => o.id === optId) || parsed.logo_options[i];
      const fallbackOpt = fallbackKit.logo_options[i];

      const svgToUse = isValidSvg(optFromAi?.svg) ? optFromAi.svg : fallbackOpt.svg;
      const titleToUse = optFromAi?.title || fallbackOpt.title;
      const noteToUse = optFromAi?.concept_note || fallbackOpt.concept_note;

      validatedLogoOptions.push({
        id: optId,
        title: titleToUse,
        concept_note: noteToUse,
        svg: svgToUse,
        settings: {
          iconScale: 1,
          iconPosX: 0,
          iconPosY: 0,
          iconShape: optId === "opt_1" ? "tech" : optId === "opt_2" ? "circle" : "monogram",
          letterSpacing: 0.16,
          primaryColor: parsed.palette[0]?.hex || "#0A84FF",
          layout: "stacked"
        }
      });
    }

    const mainSvg = validatedLogoOptions[0].svg;
    const pColor = parsed.palette[0]?.hex || "#0A84FF";
    const sColor = parsed.palette[1]?.hex || "#1C1C1E";
    const nColor = parsed.palette[3]?.hex || "#F5F5F7";

    console.log(`✅ [AI Brand Designer] Gemini 2.5 Flash đã tạo thành công bộ nhận diện cho "${safe.brand_name}" kèm 3 Logo SVG!`);

    const taglinesList = parsed.tagline_options || [parsed.tagline || safe.slogan || "Kiến tạo bản sắc độc bản"];

    return {
      brand_name: safe.brand_name,
      brand_story: parsed.brand_story,
      tagline: parsed.tagline || safe.slogan || "Kiến tạo bản sắc độc bản",
      tagline_options: taglinesList,
      taglines: taglinesList,
      palette: parsed.palette,
      typography: {
        heading: parsed.typography?.heading || "Space Grotesk",
        body: parsed.typography?.body || "Plus Jakarta Sans",
        pairing_rationale: parsed.typography?.pairing_rationale || "Cặp font tối ưu hiển thị số và hỗ trợ tiếng Việt sắc nét.",
        google_fonts_url: parsed.typography?.google_fonts_url || "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
      },
      mockups: parsed.mockup_directions || fallbackKit.mockups,
      logo_options: validatedLogoOptions,
      selected_logo_id: "opt_1",
      logo_svg: mainSvg,
      original_logo_svg: mainSvg,
      logo_layout: {
        layout: "stacked",
        iconScale: 1.0,
        iconPosX: 0,
        iconPosY: 0,
        letterSpacing: 0.16,
        iconColor: pColor,
        titleColor: sColor,
        taglineColor: pColor,
        bgColor: nColor
      },
      ai_generated_via: "gemini-2.5-flash"
    };
  } catch (error: any) {
    console.warn(`⚠️ [AI Brand Designer] Lỗi xử lý Gemini (${error?.message || error}), kích hoạt Parametric Archetypes Engine fallback:`, error);
    return generateFallbackBrandKit(safe);
  }
}

/**
 * Bí danh hàm tương thích với các route hiện tại
 */
export const generateAiBrandDesign = generateBrandIdentityWithAI;

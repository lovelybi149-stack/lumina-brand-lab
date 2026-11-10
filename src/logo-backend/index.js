/**
 * FILE 6: src/logo-backend/index.js
 * Main Entry Controller & Universal Frontend Adapter
 */

const { BRAND_PRESETS } = require("./presets");
const { searchVectorIcons } = require("./iconifyService");
const { buildCompleteLogoCandidate } = require("./svgGenerator");
const { cleanSvgCode, buildBrandKitBundle } = require("./brandKitExporter");

/**
 * Chuẩn hóa dữ liệu đầu vào từ bất kỳ Form Frontend nào (chống lỗi lệch tên trường)
 */
function normalizeFrontendInput(raw = {}) {
  const brandName = raw.brandName || raw.name || raw.companyName || raw.title || raw.brand_name || "GOBITA.AI";
  const tagline = raw.tagline !== undefined
    ? raw.tagline
    : (raw.slogan !== undefined ? raw.slogan : "Go Big, Take Action");
  const industry = raw.industry || raw.category || raw.sector || "ai-tech";
  const count = Math.min(Math.max(Number(raw.count || raw.limit || 12), 1), 24);

  const industryConfig = BRAND_PRESETS.industries[industry] || BRAND_PRESETS.industries["ai-tech"];
  const keywords = Array.isArray(raw.keywords) && raw.keywords.length > 0
    ? raw.keywords
    : (raw.keyword ? [raw.keyword] : industryConfig.keywords);

  return {
    brandName: String(brandName).trim() || "GOBITA.AI",
    tagline: String(tagline).trim(),
    industry,
    keywords,
    preferredLayout: raw.layout || "auto",
    preferredContainer: raw.container || "auto",
    preferredPalette: raw.colorPalette || raw.palette || null,
    preferredFont: raw.fontFamily || raw.fontId || null,
    animated: Boolean(raw.animated),
    offlineOnly: Boolean(raw.offlineOnly),
    count
  };
}

/**
 * Hàm chính sinh danh sách Logo (POST /api/logo/generate)
 */
async function generateLogoBatch(rawInput = {}) {
  const startMs = Date.now();
  const input = normalizeFrontendInput(rawInput);
  const industryConfig = BRAND_PRESETS.industries[input.industry] || BRAND_PRESETS.industries["ai-tech"];

  // 1. Tìm danh sách biểu tượng từ Iconify API (hoặc Fallback nội bộ)
  const icons = await searchVectorIcons(input.keywords, 8, { offlineOnly: input.offlineOnly });

  // 2. Lấy bảng màu, font chữ và bố cục xoay vòng để tạo 12-24 phương án đa dạng
  const layouts = input.preferredLayout !== "auto"
    ? [input.preferredLayout]
    : ["horizontal", "stacked", "badge", "monogram", "horizontal", "stacked"];
  const containers = input.preferredContainer !== "auto"
    ? [input.preferredContainer]
    : industryConfig.defaultContainers;
  const containerStyles = ["gradient", "filled", "outline", "gradient"];

  const palettes = input.preferredPalette
    ? [input.preferredPalette]
    : industryConfig.defaultPaletteIds
        .map((id) => BRAND_PRESETS.palettes.find((p) => p.id === id))
        .filter(Boolean);

  const logos = [];
  for (let i = 0; i < input.count; i++) {
    const iconObj = icons[i % icons.length];
    const paletteObj = palettes[i % palettes.length] || BRAND_PRESETS.palettes[0];
    const layout = layouts[i % layouts.length];
    const container = containers[i % containers.length];
    const containerStyle = containerStyles[i % containerStyles.length];
    const fontId = input.preferredFont || industryConfig.defaultFonts[i % industryConfig.defaultFonts.length];

    const candidate = buildCompleteLogoCandidate({
      id: `logo_${i + 1}`,
      brandName: input.brandName,
      tagline: input.tagline,
      industry: input.industry,
      layout,
      container,
      containerStyle,
      fontId,
      palette: paletteObj,
      iconId: iconObj.id,
      iconName: iconObj.name,
      iconInnerSvg: iconObj.innerSvg,
      animated: input.animated
    });

    candidate.svg = cleanSvgCode(candidate.svg);
    candidate.svgCode = candidate.svg;
    logos.push(candidate);
  }

  return {
    status: "success",
    generationTimeMs: Date.now() - startMs,
    count: logos.length,
    logos,
    data: logos,   // Alias cho Frontend dùng response.data
    results: logos // Alias cho Frontend dùng response.results
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BRAND_PRESETS,
    normalizeFrontendInput,
    generateLogoBatch,
    buildCompleteLogoCandidate,
    buildBrandKitBundle
  };
}


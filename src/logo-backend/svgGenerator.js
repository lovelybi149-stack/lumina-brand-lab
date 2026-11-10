/**
 * FILE 4: src/logo-backend/svgGenerator.js
 * Pure Mathematical SVG Logo Synthesis Engine
 * Supports 5 Layouts x 7 Geometric Containers x 5 Color Modes + Animated SVG
 */

const { BRAND_PRESETS } = require("./presets");
const { auditLogoSVG } = require("./opticalAudit");

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Tách tên thương hiệu thành 2 phần để phối màu nhấn (VD: "GOBITA.AI" -> ["GOBITA", ".AI"])
 */
function splitBrandNameParts(brandName) {
  const raw = String(brandName || "GOBITA.AI").trim();
  if (raw.includes(".")) {
    const idx = raw.lastIndexOf(".");
    return [raw.slice(0, idx), raw.slice(idx)];
  }
  const words = raw.split(/\s+/);
  if (words.length >= 2) {
    return [words.slice(0, -1).join(" ") + " ", words[words.length - 1]];
  }
  if (raw.length > 5) {
    return [raw.slice(0, -2), raw.slice(-2)];
  }
  return [raw, ""];
}

/**
 * Vẽ khung hình học (Container) trên hệ tọa độ chuẩn 120x120 (tâm tại 60, 60)
 */
function buildContainerShapeMarkup(containerType, styleType, primaryColor, secondaryColor, gradId) {
  const fillVal = styleType === "gradient"
    ? `url(#${gradId})`
    : styleType === "outline"
      ? "none"
      : primaryColor;
  const strokeVal = styleType === "outline" ? `url(#${gradId})` : secondaryColor;
  const strokeW = styleType === "outline" ? 5 : 2;

  switch (containerType) {
    case "hexagon":
      return `<polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
    case "squircle":
      return `<rect x="10" y="10" width="100" height="100" rx="28" ry="28" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}"/>`;
    case "circle":
      return `<circle cx="60" cy="60" r="50" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}"/>`;
    case "diamond":
      return `<polygon points="60,6 114,60 60,114 6,60" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
    case "shield":
      return `<path d="M60 8 L106 24 V58 C106 88 60 112 60 112 C60 112 14 88 14 58 V24 Z" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
    case "octagon":
      return `<polygon points="39,8 81,8 112,39 112,81 81,112 39,112 8,81 8,39" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
    case "none":
    default:
      return `<circle cx="60" cy="60" r="50" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-dasharray="6 6" opacity="0.35"/>`;
  }
}

/**
 * Dựng khối Biểu tượng (Icon Box 120x120) đặt tại tọa độ (offsetX, offsetY) với tỷ lệ scale
 */
function buildIconMarkGroup({
  offsetX,
  offsetY,
  boxScale = 1,
  container = "hexagon",
  containerStyle = "gradient",
  iconInnerSvg = "",
  primaryColor = "#F97300",
  secondaryColor = "#FAD45C",
  iconForeground = "#FFFFFF",
  gradId = "grad_main"
}) {
  const effectiveIconColor = (container === "none" || containerStyle === "outline")
    ? primaryColor
    : iconForeground;
  const shapeMarkup = buildContainerShapeMarkup(container, containerStyle, primaryColor, secondaryColor, gradId);
  const recoloredInner = String(iconInnerSvg || "")
    .replace(/currentColor/g, effectiveIconColor)
    .replace(/stroke-width=["']2["']/g, 'stroke-width="2.2"');

  return `<g transform="translate(${offsetX}, ${offsetY}) scale(${boxScale})">
    ${shapeMarkup}
    <g transform="translate(26, 26) scale(2.8333)" style="color:${effectiveIconColor}">
      ${recoloredInner}
    </g>
  </g>`;
}

/**
 * Hàm chính: Sinh mã SVG chuẩn theo Cấu hình & Chế độ màu (colorMode: 'primary' | 'dark' | 'monoBlack' | 'monoWhite' | 'iconOnly')
 */
function generateSingleLogoSVG(config = {}, colorMode = "primary") {
  const brandName = config.brandName || "GOBITA.AI";
  const tagline = config.tagline !== undefined ? config.tagline : "Go Big, Take Action";
  const layout = colorMode === "iconOnly" ? "icon-only" : (config.layout || "horizontal");
  const container = config.container || "hexagon";
  const containerStyle = config.containerStyle || "gradient";
  const fontObj = BRAND_PRESETS.fonts.find((f) => f.id === config.fontId || f.name === config.fontFamily) || BRAND_PRESETS.fonts[0];
  const basePalette = config.palette || BRAND_PRESETS.palettes[0];

  // Xác định bảng màu theo từng chế độ xuất (Primary, Dark, Monochrome Black, Monochrome White)
  let primary = basePalette.primary || "#F97300";
  let secondary = basePalette.secondary || "#FAD45C";
  let textMain = basePalette.text || "#6B4C3B";
  let bg = basePalette.bg || "#FFFDF7";
  let iconFg = "#FFFFFF";
  let effectiveContainerStyle = containerStyle;

  if (colorMode === "dark") {
    bg = basePalette.darkBg || "#141210";
    textMain = "#FFFFFF";
  } else if (colorMode === "monoBlack") {
    primary = "#000000";
    secondary = "#000000";
    textMain = "#000000";
    bg = "#FFFFFF";
    iconFg = "#FFFFFF";
    effectiveContainerStyle = container === "none" ? "outline" : "filled";
  } else if (colorMode === "monoWhite") {
    primary = "#FFFFFF";
    secondary = "#FFFFFF";
    textMain = "#FFFFFF";
    bg = "#000000";
    iconFg = "#000000";
    effectiveContainerStyle = container === "none" ? "outline" : "filled";
  }

  const uid = String(config.id || "logo").replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `grad_${uid}_${colorMode}`;
  const [namePart1, namePart2] = splitBrandNameParts(brandName);
  const accentTextColor = (colorMode === "monoBlack" || colorMode === "monoWhite") ? textMain : primary;

  const animStyle = config.animated
    ? `<style>
        @keyframes logoPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .logo-anim-mark { transform-origin: center; animation: logoPulse 3s ease-in-out infinite; }
      </style>`
    : "";

  const defs = `<defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${secondary}"/>
    </linearGradient>
    ${animStyle}
  </defs>`;

  const iconInnerSvg = config.iconInnerSvg ||
    '<path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>';

  // 1. CHẾ ĐỘ ICON-ONLY (200x200 — Dùng cho App Icon & Favicon 16px/32px)
  if (layout === "icon-only") {
    const bgRect = config.transparentBg ? "" : `<rect width="200" height="200" rx="36" fill="${bg}"/>`;
    const iconGroup = buildIconMarkGroup({
      offsetX: 28,
      offsetY: 28,
      boxScale: 1.2,
      container,
      containerStyle: effectiveContainerStyle,
      iconInnerSvg,
      primaryColor: primary,
      secondaryColor: secondary,
      iconForeground: iconFg,
      gradId
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">${defs}${bgRect}${iconGroup}</svg>`;
  }

  // 2. BỐ CỤC STACKED (Icon ở trên, Tên & Slogan căn giữa ở dưới — viewBox 500x380)
  if (layout === "stacked") {
    const bgRect = config.transparentBg ? "" : `<rect width="500" height="380" rx="20" fill="${bg}"/>`;
    const iconGroup = buildIconMarkGroup({
      offsetX: 190,
      offsetY: 42,
      boxScale: 1.0,
      container,
      containerStyle: effectiveContainerStyle,
      iconInnerSvg,
      primaryColor: primary,
      secondaryColor: secondary,
      iconForeground: iconFg,
      gradId
    });
    const taglineMarkup = tagline
      ? `<line x1="190" y1="276" x2="310" y2="276" stroke="${primary}" stroke-width="2" opacity="0.5"/>
         <text x="250" y="304" text-anchor="middle" font-family="${fontObj.taglineFont}" font-size="14" font-weight="600" letter-spacing="0.18em" fill="${textMain}" opacity="0.82">${escapeXml(tagline.toUpperCase())}</text>`
      : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="100%" height="100%">${defs}${bgRect}${iconGroup}<text x="250" y="242" text-anchor="middle" font-family="${fontObj.family}" font-size="42" font-weight="${fontObj.weight}" letter-spacing="${fontObj.tracking}" fill="${textMain}">${escapeXml(namePart1)}<tspan fill="${accentTextColor}">${escapeXml(namePart2)}</tspan></text>${taglineMarkup}</svg>`;
  }

  // 3. BỐ CỤC BADGE / EMBLEM (Khung huy hiệu bao quanh toàn bộ — viewBox 500x380)
  if (layout === "badge") {
    const bgRect = config.transparentBg ? "" : `<rect width="500" height="380" rx="20" fill="${bg}"/>`;
    const outerFrame = `<rect x="46" y="28" width="408" height="324" rx="28" fill="none" stroke="${primary}" stroke-width="3" opacity="0.85"/>
      <rect x="56" y="38" width="388" height="304" rx="22" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.6"/>`;
    const iconGroup = buildIconMarkGroup({
      offsetX: 196,
      offsetY: 58,
      boxScale: 0.9,
      container,
      containerStyle: effectiveContainerStyle,
      iconInnerSvg,
      primaryColor: primary,
      secondaryColor: secondary,
      iconForeground: iconFg,
      gradId
    });
    const taglineMarkup = tagline
      ? `<text x="250" y="298" text-anchor="middle" font-family="${fontObj.taglineFont}" font-size="13" font-weight="600" letter-spacing="0.2em" fill="${textMain}" opacity="0.85">${escapeXml(tagline.toUpperCase())}</text>`
      : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="100%" height="100%">${defs}${bgRect}${outerFrame}${iconGroup}<text x="250" y="244" text-anchor="middle" font-family="${fontObj.family}" font-size="38" font-weight="${fontObj.weight}" letter-spacing="0.06em" fill="${textMain}">${escapeXml(namePart1)}<tspan fill="${accentTextColor}">${escapeXml(namePart2)}</tspan></text>${taglineMarkup}</svg>`;
  }

  // 4. BỐ CỤC MONOGRAM + WORDMARK (1 hoặc 2 chữ cái đầu lồng ghép hoàng gia theo bí quyết SDmedia)
  if (layout === "monogram" || layout === "monogram-duo") {
    const bgRect = config.transparentBg ? "" : `<rect width="600" height="240" rx="20" fill="${bg}"/>`;
    const cleanBrand = String(brandName || "GOBITA.AI").trim();
    const words = cleanBrand.split(/\s+/).filter(Boolean);
    const char1 = escapeXml(words[0]?.charAt(0).toUpperCase() || "G");
    const char2 = escapeXml(words.length > 1 ? words[1]?.charAt(0).toUpperCase() : (cleanBrand.charAt(1)?.toUpperCase() || "B"));
    const shapeMarkup = buildContainerShapeMarkup(container === "none" ? "hexagon" : container, effectiveContainerStyle, primary, secondary, gradId);
    
    // Nếu là monogram 2 chữ cái (SDmedia Interlocking monogram)
    const isDuo = layout === "monogram-duo" || words.length >= 2 || cleanBrand.length > 3;
    const monoGroup = isDuo
      ? `<g transform="translate(48, 54) scale(1.1)">
          ${shapeMarkup}
          <circle cx="48" cy="60" r="28" fill="none" stroke="${secondary}" stroke-width="1.8" stroke-opacity="0.5"/>
          <circle cx="72" cy="60" r="28" fill="none" stroke="${primary}" stroke-width="1.8" stroke-opacity="0.5" stroke-dasharray="6 3"/>
          <text x="46" y="74" text-anchor="middle" font-family="${fontObj.family}" font-size="40" font-weight="900" fill="${iconFg}">${char1}</text>
          <text x="74" y="74" text-anchor="middle" font-family="${fontObj.family}" font-size="40" font-weight="900" fill="${secondary}" opacity="0.95">${char2}</text>
        </g>`
      : `<g transform="translate(48, 54) scale(1.1)">
          ${shapeMarkup}
          <text x="60" y="78" text-anchor="middle" font-family="${fontObj.family}" font-size="56" font-weight="900" fill="${iconFg}">${char1}</text>
        </g>`;

    const taglineMarkup = tagline
      ? `<text x="206" y="158" font-family="${fontObj.taglineFont}" font-size="14" font-weight="600" letter-spacing="0.16em" fill="${textMain}" opacity="0.8">${escapeXml(tagline.toUpperCase())}</text>`
      : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="100%" height="100%">${defs}${bgRect}${monoGroup}<text x="204" y="122" font-family="${fontObj.family}" font-size="46" font-weight="${fontObj.weight}" letter-spacing="${fontObj.tracking}" fill="${textMain}">${escapeXml(namePart1)}<tspan fill="${accentTextColor}">${escapeXml(namePart2)}</tspan></text>${taglineMarkup}</svg>`;
  }

  // 5. MẶC ĐỊNH: BỐ CỤC HORIZONTAL (Icon bên trái, Tên thương hiệu & Slogan bên phải — viewBox 600x240)
  const bgRect = config.transparentBg ? "" : `<rect width="600" height="240" rx="20" fill="${bg}"/>`;
  const iconGroup = buildIconMarkGroup({
    offsetX: 48,
    offsetY: 54,
    boxScale: 1.1,
    container,
    containerStyle: effectiveContainerStyle,
    iconInnerSvg,
    primaryColor: primary,
    secondaryColor: secondary,
    iconForeground: iconFg,
    gradId
  });
  const taglineMarkup = tagline
    ? `<text x="206" y="158" font-family="${fontObj.taglineFont}" font-size="14" font-weight="600" letter-spacing="0.16em" fill="${textMain}" opacity="0.8">${escapeXml(tagline.toUpperCase())}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="100%" height="100%">${defs}${bgRect}${iconGroup}<text x="204" y="122" font-family="${fontObj.family}" font-size="46" font-weight="${fontObj.weight}" letter-spacing="${fontObj.tracking}" fill="${textMain}">${escapeXml(namePart1)}<tspan fill="${accentTextColor}">${escapeXml(namePart2)}</tspan></text>${taglineMarkup}</svg>`;
}

/**
 * Sinh trọn bộ 1 Phương án Logo hoàn chỉnh (bao gồm 5 biến thể màu + kết quả chấm điểm Quang học)
 */
function buildCompleteLogoCandidate(config = {}) {
  const primarySvg = generateSingleLogoSVG(config, "primary");
  const darkSvg = generateSingleLogoSVG(config, "dark");
  const monoBlackSvg = generateSingleLogoSVG(config, "monoBlack");
  const monoWhiteSvg = generateSingleLogoSVG(config, "monoWhite");
  const iconOnlySvg = generateSingleLogoSVG(config, "iconOnly");

  const palette = config.palette || BRAND_PRESETS.palettes[0];
  const audit = auditLogoSVG(primarySvg, palette);

  return {
    id: config.id || `logo_${Date.now()}`,
    brandName: config.brandName || "GOBITA.AI",
    tagline: config.tagline !== undefined ? config.tagline : "Go Big, Take Action",
    industry: config.industry || "ai-tech",
    layout: config.layout || "horizontal",
    container: config.container || "hexagon",
    containerStyle: config.containerStyle || "gradient",
    iconSource: config.iconId || "builtin:neural-hex",
    iconName: config.iconName || "Neural Hexagon",
    svg: primarySvg,
    svgCode: primarySvg, // Alias tương thích cho mọi Frontend
    variants: {
      primary: primarySvg,
      dark: darkSvg,
      monoBlack: monoBlackSvg,
      monoWhite: monoWhiteSvg,
      iconOnly: iconOnlySvg
    },
    palette: {
      id: palette.id || "custom",
      name: palette.name || "Brand Palette",
      primary: palette.primary || "#F97300",
      secondary: palette.secondary || "#FAD45C",
      text: palette.text || "#6B4C3B",
      background: palette.bg || "#FFFDF7",
      darkBackground: palette.darkBg || "#18120E"
    },
    typography: {
      fontId: config.fontId || "montserrat",
      headingFont: config.fontFamily || "Montserrat",
      taglineFont: "Poppins"
    },
    audit
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateSingleLogoSVG,
    buildCompleteLogoCandidate,
    splitBrandNameParts
  };
}


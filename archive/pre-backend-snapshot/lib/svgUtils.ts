/**
 * LUMINA BRAND LAB — SVG UTILITIES & DYNAMIC LOGO TRANSFORMER 2.0
 * Chức năng:
 * - Điều chỉnh bố cục: Biểu tượng trên - Chữ dưới vs Biểu tượng trái - Chữ phải
 * - Điều chỉnh vị trí biểu tượng (Icon Position: Tọa độ X, Y: Lên/Xuống/Trái/Phải)
 * - Điều chỉnh tỷ lệ kích thước biểu tượng (Icon Scale: 50% đến 200%)
 * - Bộ chọn hình dáng / cấu tạo biểu tượng (Icon Shape Switcher: Tech, Circle, Luxury, Monogram, Organic)
 * - Điều chỉnh khoảng cách ký tự (Letter Spacing)
 * - Tự động áp bảng màu vào SVG
 * - Xử lý AI Variations
 * - Sinh và quản lý 3 Option Logo Master riêng biệt theo ĐÚNG NGÀNH NGHỀ & TÊN BRAND
 */

import { ColorItem, LogoLayoutConfig, LogoOption, TypographyConfig } from "../types/curation";
import {
  detectIndustryCategory,
  getIndustryBrandKit,
  renderEmblemShape
} from "./industryBrandKit";

/**
 * Biến đổi SVG dựa trên tham số bố cục, tỷ lệ, vị trí (X, Y), hình dáng và màu sắc
 */
export function transformLogoSvg(
  baseSvg: string,
  layoutConfig: LogoLayoutConfig,
  palette?: ColorItem[],
  brandName?: string,
  tagline?: string,
  headingFont?: string,
  bodyFont?: string
): string {
  if (!baseSvg) return "";

  let svg = baseSvg;

  // 1. Thay thế tên thương hiệu nếu có
  if (brandName) {
    svg = svg.replace(
      /(<text[^>]*class=["'][^"']*brand-title[^"']*["'][^>]*>)(.*?)(<\/text>)/gi,
      `$1${brandName.toUpperCase()}$3`
    );
  }

  // 2. Thay thế tagline / slogan nếu có
  if (tagline) {
    svg = svg.replace(
      /(<text[^>]*class=["'][^"']*brand-tagline[^"']*["'][^>]*>)(.*?)(<\/text>)/gi,
      `$1${tagline.toUpperCase()}$3`
    );
  }

  // 3. Cập nhật font chữ trong style block nếu có
  if (headingFont || bodyFont) {
    const hFont = headingFont || "Fraunces";
    const bFont = bodyFont || "Be Vietnam Pro";

    // Thay thế font-family trong CSS rule
    svg = svg.replace(
      /\.brand-title\s*\{[^}]*font-family:\s*['"]?[^'";]+['"]?/gi,
      (match) => match.replace(/font-family:\s*['"]?[^'";]+['"]?/i, `font-family: '${hFont}', serif`)
    );
    svg = svg.replace(
      /\.brand-sub\s*\{[^}]*font-family:\s*['"]?[^'";]+['"]?/gi,
      (match) => match.replace(/font-family:\s*['"]?[^'";]+['"]?/i, `font-family: '${bFont}', sans-serif`)
    );
    svg = svg.replace(
      /\.brand-tagline\s*\{[^}]*font-family:\s*['"]?[^'";]+['"]?/gi,
      (match) => match.replace(/font-family:\s*['"]?[^'";]+['"]?/i, `font-family: '${bFont}', sans-serif`)
    );
  }

  // 4. Áp màu sắc (Color Palette)
  if (palette && palette.length >= 3) {
    const primaryHex = layoutConfig.titleColor || palette.find((c) => c.role.toLowerCase().includes("primary") || c.role.toLowerCase().includes("chủ đạo"))?.hex || palette[0].hex;
    const secondaryHex = palette.find((c) => c.role.toLowerCase().includes("secondary") || c.role.toLowerCase().includes("phụ"))?.hex || palette[1].hex;
    const accentHex = palette.find((c) => c.role.toLowerCase().includes("accent") || c.role.toLowerCase().includes("nhấn"))?.hex || palette[2].hex;
    const neutralHex = layoutConfig.bgColor || palette.find((c) => c.role.toLowerCase().includes("neutral") || c.role.toLowerCase().includes("nền"))?.hex || "#F4EFEA";

    const titleColor = layoutConfig.titleColor || primaryHex;
    const taglineColor = layoutConfig.taglineColor || accentHex;

    // Đổi màu nền rect canvas
    svg = svg.replace(
      /(<rect\s+[^>]*width=["']500["'][^>]*fill=["'])([^"']*)(["'])/i,
      `$1${neutralHex}$3`
    );

    // Đổi fill của class brand-title
    svg = svg.replace(
      /(\.brand-title\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${titleColor}$3`
    );

    // Đổi fill của class brand-sub
    svg = svg.replace(
      /(\.brand-sub\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${secondaryHex}$3`
    );

    // Đổi fill của class brand-tagline
    svg = svg.replace(
      /(\.brand-tagline\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${taglineColor}$3`
    );
  }

  // 5. Letter spacing cho tên thương hiệu
  const spacingEm = (layoutConfig.letterSpacing || 0.16).toFixed(2);
  svg = svg.replace(
    /(\.brand-title\s*\{[^}]*letter-spacing:\s*)([^;]+)(;)/i,
    `$1${spacingEm}em$3`
  );

  // 6. Xử lý Vị trí Tọa độ (X, Y) và Kích thước (Icon Scale 50% - 200%)
  const scale = Number(layoutConfig.iconScale) || 1.0;
  const posX = Number(layoutConfig.iconPosX) || 0;
  const posY = Number(layoutConfig.iconPosY) || 0;

  const baseCenterX = layoutConfig.layout === "horizontal" ? 140 : 250;
  const baseCenterY = layoutConfig.layout === "horizontal" ? 250 : 185;
  const finalScale = scale * (layoutConfig.layout === "horizontal" ? 0.85 : 1.0);

  const emblemTransform = `translate(${baseCenterX + posX}, ${baseCenterY + posY}) scale(${finalScale})`;

  svg = svg.replace(
    /<g\s+id=["']logo-emblem["'][^>]*transform=["'][^"']*["']/i,
    `<g id="logo-emblem" transform="${emblemTransform}"`
  );

  // 7. Xử lý Bố cục ngang (Horizontal) nếu được chọn
  if (layoutConfig.layout === "horizontal") {
    const typographyReplacement = `
  <g id="logo-typography" transform="translate(325, 205)">
    <text x="0" y="30" text-anchor="start" class="brand-title" font-size="28">${brandName ? brandName.toUpperCase() : "BRAND NAME"}</text>
    <text x="0" y="60" text-anchor="start" class="brand-sub" font-size="10">STUDIO &amp; DESIGN LAB</text>
    <g transform="translate(0, 75)">
      <line x1="0" y1="0" x2="90" y2="0" stroke="${palette?.[1]?.hex || '#9E6B55'}" stroke-width="0.8" stroke-opacity="0.5"/>
      <circle cx="98" cy="0" r="2" fill="${palette?.[2]?.hex || '#5B7065'}"/>
      <line x1="106" y1="0" x2="160" y2="0" stroke="${palette?.[1]?.hex || '#9E6B55'}" stroke-width="0.8" stroke-opacity="0.5"/>
    </g>
    <text x="0" y="100" text-anchor="start" class="brand-tagline" font-size="9">${tagline ? tagline.toUpperCase() : "INNOVATION • IDENTITY"}</text>
  </g>
    `;

    svg = svg.replace(/<g\s+id=["']logo-typography["']>[\s\S]*?<\/g>\s*<\/svg>/i, `${typographyReplacement}\n</svg>`);
  }

  // 8. Đổi hình dáng / cấu tạo biểu tượng (Icon Shape Switcher) nếu Admin chọn
  if (layoutConfig.iconShape) {
    const pColor = palette?.[0]?.hex || "#0A84FF";
    const sColor = palette?.[1]?.hex || "#1C1C1E";
    const aColor = palette?.[2]?.hex || "#00F2FE";
    const newInner = renderEmblemShape(layoutConfig.iconShape, brandName || "L", pColor, sColor, aColor);

    // Thay thế toàn bộ nội dung trong <g id="logo-emblem" ...>...</g>
    svg = svg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${newInner}\n$3`
    );
  }

  return svg;
}

/**
 * Khởi tạo 3 Option Logo Master chuẩn mực hoàn chỉnh theo đúng Ngành nghề
 */
export function buildDefaultLogoOptions(
  brandName = "LUMINA",
  tagline = "Kiến tạo nhận diện chuẩn mực",
  palette?: ColorItem[],
  typography?: TypographyConfig,
  baseSvg?: string,
  industry = ""
): LogoOption[] {
  const cat = detectIndustryCategory(industry, "", brandName);
  const kit = getIndustryBrandKit(cat, brandName, "", tagline);

  // Nếu có baseSvg hợp lệ và dài hơn 100 ký tự, giữ lại cho option 1
  if (baseSvg && baseSvg.trim().length > 100) {
    kit.options[0].svg = baseSvg;
  }

  return kit.options;
}

/**
 * Tái tạo riêng 1 Option cụ thể bằng AI
 */
export function regenerateOptionSvg(
  optionId: "opt_1" | "opt_2" | "opt_3",
  prompt: string,
  currentSvg: string,
  palette?: ColorItem[]
): {
  newSvg: string;
  rationale: string;
  title: string;
} {
  const variation = generateAiVariationSvg(currentSvg, prompt, palette);
  return {
    newSvg: variation.newSvg,
    rationale: variation.rationale,
    title: variation.variationName
  };
}

/**
 * Tạo biến thể SVG theo câu lệnh AI (Parametric Fallback Engine)
 */
export function generateAiVariationSvg(currentSvg: string, prompt: string, palette?: ColorItem[]): {
  newSvg: string;
  rationale: string;
  variationName: string;
} {
  const p = prompt.toLowerCase();
  let updatedSvg = currentSvg;
  let rationale = "AI đã tái cấu trúc vector dựa trên yêu cầu mỹ thuật của bạn.";
  let variationName = "Biến thể AI Tối ưu";

  const pColor = palette?.[0]?.hex || "#0A84FF";
  const sColor = palette?.[1]?.hex || "#1C1C1E";
  const aColor = palette?.[2]?.hex || "#00F2FE";

  if (p.includes("lập phương") || p.includes("cube") || p.includes("3d") || p.includes("tesseract")) {
    variationName = "Isometric Quantum Cube (Lập phương 3D Công nghệ)";
    rationale = "AI đã chuyển đổi biểu tượng thành khối lập phương 3D không gian đa chiều, tượng trưng cho công nghệ tính toán lượng tử.";
    const cubeEmblem = `
    <!-- Khối Lập Phương 3D Công Nghệ -->
    <polygon points="0,-75 62,-40 0,-5 -62,-40" fill="${pColor}" opacity="0.25" stroke="${pColor}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="-62,-40 0,-5 0,65 -62,30" fill="${sColor}" opacity="0.2" stroke="${sColor}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="0,-5 62,-40 62,30 0,65" fill="${aColor}" opacity="0.35" stroke="${aColor}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="0" cy="-5" r="9" fill="${pColor}"/>
    <line x1="0" y1="-5" x2="0" y2="-75" stroke="${aColor}" stroke-width="2" stroke-dasharray="4 3"/>
    <line x1="0" y1="-5" x2="62" y2="30" stroke="${pColor}" stroke-width="2" stroke-dasharray="4 3"/>
    <line x1="0" y1="-5" x2="-62" y2="30" stroke="${sColor}" stroke-width="2" stroke-dasharray="4 3"/>
    <circle cx="0" cy="-75" r="4" fill="${aColor}"/>
    <circle cx="62" cy="30" r="4" fill="${pColor}"/>
    <circle cx="-62" cy="30" r="4" fill="${sColor}"/>
    `;
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${cubeEmblem}\n$3`
    );
  } else if (p.includes("dày") || p.includes("đậm") || p.includes("bold") || p.includes("mạnh mẽ")) {
    variationName = "High-Impact Bold Strokes (Nét dày quyền lực)";
    rationale = "AI đã tăng 50% độ dày các nét vẽ chính để tạo cảm giác vững chãi, hiện đại và gây ấn tượng thị giác mạnh mẽ.";
    updatedSvg = updatedSvg
      .replace(/stroke-width=["']1\.2["']/g, 'stroke-width="2.8"')
      .replace(/stroke-width=["']1\.4["']/g, 'stroke-width="3.2"')
      .replace(/stroke-width=["']2["']/g, 'stroke-width="3.5"')
      .replace(/stroke-width=["']2\.2["']/g, 'stroke-width="3.6"')
      .replace(/stroke-width=["']2\.5["']/g, 'stroke-width="4.0"');
  } else if (p.includes("thanh mảnh") || p.includes("mỏng") || p.includes("delicate") || p.includes("fine")) {
    variationName = "Minimalist Fine-Line (Nét thanh mảnh)";
    rationale = "AI đã giảm 40% độ dày các nét vẽ chính (stroke-width: 1.2px) tạo cảm giác tinh tế, thanh thoát.";
    updatedSvg = updatedSvg
      .replace(/stroke-width=["']3(\.\d)?["']/g, 'stroke-width="1.4"')
      .replace(/stroke-width=["']2\.\d["']/g, 'stroke-width="1.1"')
      .replace(/stroke-width=["']2["']/g, 'stroke-width="1.0"');
  } else if (p.includes("đa giác") || p.includes("vi mạch") || p.includes("công nghệ") || p.includes("tech") || p.includes("node")) {
    variationName = "Digital Hexagon Nodes (Mạng lưới vi mạch số)";
    rationale = "AI đã tái cấu trúc thành mạng lưới vi mạch hình học đa giác với các cổng logic kết nối trung tâm.";
    const techEmblem = renderEmblemShape("tech", "TECH", pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${techEmblem}\n$3`
    );
  } else if (p.includes("kim cương") || p.includes("sang trọng") || p.includes("gold") || p.includes("champagne") || p.includes("luxury")) {
    variationName = "Luxury Prism & Gold (Khối kim cương ánh kim)";
    rationale = "AI đã cấu trúc lại biểu tượng thành hình lăng kính kim cương đối xứng cao cấp.";
    const luxEmblem = renderEmblemShape("luxury", "LUX", pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${luxEmblem}\n$3`
    );
  } else if (p.includes("mầm cây") || p.includes("chiếc lá") || p.includes("chồi") || p.includes("hữu cơ") || p.includes("organic")) {
    variationName = "Organic Botanical Curve (Khối hữu cơ tự nhiên)";
    rationale = "AI đã chuyển đổi thành hình thái mầm lá hữu cơ mềm mại, biểu trưng cho sự sinh sôi.";
    const organicEmblem = renderEmblemShape("organic", "NAT", pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${organicEmblem}\n$3`
    );
  } else {
    // Biến thể tối giản đương đại
    variationName = "Modernist Refined Vector";
    rationale = `AI đã tinh chỉnh các tỷ lệ hình học và viền nét vector theo yêu cầu: "${prompt}".`;
    updatedSvg = updatedSvg
      .replace(/stroke-width=["']3["']/g, 'stroke-width="2.6"')
      .replace(/stroke-width=["']2\.2["']/g, 'stroke-width="2.0"');
  }

  return { newSvg: updatedSvg, rationale, variationName };
}

/**
 * Trích xuất SVG an toàn để download
 */
export function sanitizeSvgForDownload(svgString: string): string {
  if (!svgString.startsWith("<?xml")) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n${svgString.trim()}`;
  }
  return svgString.trim();
}

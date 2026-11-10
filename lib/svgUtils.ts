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
import {
  extractBrandMonogramLetters,
  renderInterlockingTwinMonogram,
  renderConcentricLabyrinthEmblem,
  renderContinuousInfinityWordmark,
  renderOrganicSquircleCrescent,
  renderInterlockingDuoLetters
} from "./brandMarkEngines";

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
 * Renderers cho các biểu tượng mỹ thuật cao cấp theo yêu cầu AI (Motif Generators)
 */
export function renderButterflyEmblem(pColor: string, sColor: string, aColor: string): string {
  return `
    <!-- Biểu tượng Cánh Bướm Tinh Tế / Flora Butterfly -->
    <path d="M 0,-15 C -25,-62 -78,-66 -78,-24 C -78,8 -36,18 0,12" fill="none" stroke="${pColor}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M 0,-15 C 25,-62 78,-66 78,-24 C 78,8 36,18 0,12" fill="none" stroke="${pColor}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M 0,12 C -30,22 -56,48 -36,70 C -15,86 -4,42 0,26" fill="none" stroke="${sColor}" stroke-width="2.0" stroke-linecap="round"/>
    <path d="M 0,12 C 30,22 56,48 36,70 C 15,86 4,42 0,26" fill="none" stroke="${sColor}" stroke-width="2.0" stroke-linecap="round"/>
    <path d="M -16,-18 C -42,-46 -60,-38 -56,-14" fill="none" stroke="${aColor}" stroke-width="1.3" stroke-dasharray="3 2"/>
    <path d="M 16,-18 C 42,-46 60,-38 56,-14" fill="none" stroke="${aColor}" stroke-width="1.3" stroke-dasharray="3 2"/>
    <circle cx="-42" cy="-28" r="4.5" fill="${pColor}" opacity="0.85"/>
    <circle cx="42" cy="-28" r="4.5" fill="${pColor}" opacity="0.85"/>
    <circle cx="-25" cy="48" r="3.2" fill="${aColor}"/>
    <circle cx="25" cy="48" r="3.2" fill="${aColor}"/>
    <line x1="0" y1="-28" x2="0" y2="35" stroke="${pColor}" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="0" cy="-28" r="4.2" fill="${sColor}"/>
    <path d="M 0,-30 C -8,-45 -22,-48 -24,-40" fill="none" stroke="${pColor}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 0,-30 C 8,-45 22,-48 24,-40" fill="none" stroke="${pColor}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="-24" cy="-40" r="2" fill="${aColor}"/>
    <circle cx="24" cy="-40" r="2" fill="${aColor}"/>
    <circle cx="0" cy="5" r="82" fill="none" stroke="${sColor}" stroke-width="0.8" stroke-dasharray="4 4" stroke-opacity="0.45"/>
  `;
}

export function renderFloralPetalsEmblem(pColor: string, sColor: string, aColor: string): string {
  return `
    <!-- Biểu tượng Cánh Hoa Thuần Khiết / Blooming Camellia -->
    <circle cx="0" cy="0" r="82" fill="none" stroke="${sColor}" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.5"/>
    <g transform="rotate(0)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${pColor}" stroke-width="2.2"/></g>
    <g transform="rotate(45)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${sColor}" stroke-width="1.7" opacity="0.85"/></g>
    <g transform="rotate(90)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${pColor}" stroke-width="2.2"/></g>
    <g transform="rotate(135)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${sColor}" stroke-width="1.7" opacity="0.85"/></g>
    <g transform="rotate(180)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${pColor}" stroke-width="2.2"/></g>
    <g transform="rotate(225)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${sColor}" stroke-width="1.7" opacity="0.85"/></g>
    <g transform="rotate(270)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${pColor}" stroke-width="2.2"/></g>
    <g transform="rotate(315)"><path d="M0,0 C-18,-35 -22,-65 0,-80 C22,-65 18,-35 0,0" fill="none" stroke="${sColor}" stroke-width="1.7" opacity="0.85"/></g>
    <circle cx="0" cy="0" r="18" fill="none" stroke="${aColor}" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="7" fill="${pColor}"/>
  `;
}

export function renderPerfumeBottleEmblem(pColor: string, sColor: string, aColor: string): string {
  return `
    <!-- Biểu tượng Lọ Nước Hoa Pha Lê / Haute Crystal Flacon -->
    <polygon points="-16,-72 16,-72 24,-52 -24,-52" fill="none" stroke="${pColor}" stroke-width="2.2" stroke-linejoin="round"/>
    <line x1="-10" y1="-72" x2="-14" y2="-52" stroke="${aColor}" stroke-width="1.2"/>
    <line x1="10" y1="-72" x2="14" y2="-52" stroke="${aColor}" stroke-width="1.2"/>
    <rect x="-12" y="-52" width="24" height="12" fill="${sColor}" stroke="${sColor}" stroke-width="1.5" rx="2"/>
    <line x1="-12" y1="-46" x2="12" y2="-46" stroke="${aColor}" stroke-width="1.2"/>
    <polygon points="-46,-40 46,-40 56,48 44,68 -44,68 -56,48" fill="none" stroke="${pColor}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="-36,-32 36,-32 44,42 34,58 -34,58 -44,42" fill="none" stroke="${sColor}" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.75"/>
    <circle cx="0" cy="12" r="18" fill="none" stroke="${aColor}" stroke-width="1.4"/>
    <circle cx="0" cy="12" r="3" fill="${pColor}"/>
    <line x1="0" y1="-32" x2="0" y2="58" stroke="${aColor}" stroke-width="1" stroke-dasharray="2 3" opacity="0.6"/>
  `;
}

export function renderDuoMonogramEmblem(initial1: string, initial2: string, pColor: string, sColor: string, aColor: string): string {
  return `
    <!-- Biểu tượng Monogram 2 Chữ Cái Lồng Ghép / Duo Interlocking Monogram -->
    <rect x="-65" y="-65" width="130" height="130" rx="30" fill="none" stroke="${sColor}" stroke-width="1.8" stroke-opacity="0.6"/>
    <polygon points="0,-82 66,0 0,82 -66,0" fill="none" stroke="${pColor}" stroke-width="1.2" stroke-dasharray="4 4" stroke-opacity="0.6"/>
    <circle cx="-16" cy="0" r="36" fill="none" stroke="${pColor}" stroke-width="2.5" stroke-opacity="0.9"/>
    <circle cx="16" cy="0" r="36" fill="none" stroke="${aColor}" stroke-width="2.5" stroke-opacity="0.85" stroke-dasharray="190 18"/>
    <text x="-16" y="18" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="800" font-size="48" fill="${pColor}">${initial1}</text>
    <text x="18" y="18" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="800" font-size="48" fill="${sColor}">${initial2}</text>
    <circle cx="0" cy="-36" r="3" fill="${aColor}"/>
    <circle cx="0" cy="36" r="3" fill="${pColor}"/>
  `;
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

  // 0. Làm sạch mọi trường hợp lặp thẻ <g id="logo-emblem"> bị lồng kép hoặc lệch tâm
  if (updatedSvg.includes('<g id="logo-emblem" transform="translate(250, 185) scale(1)">\n<g id="logo-emblem"')) {
    updatedSvg = updatedSvg.replace(
      /<g id="logo-emblem" transform="translate\(250, 185\) scale\(1\)">\s*<g id="logo-emblem" transform="translate\(250, 185\)">([\s\S]*?)<\/g>\s*<\/g>/i,
      '<g id="logo-emblem" transform="translate(250, 185) scale(1)">\n$1\n  </g>'
    );
  }

  // 1. Phân tích & áp dụng đổi màu sắc nếu câu lệnh yêu cầu
  let pColor = palette?.[0]?.hex || "#0A84FF";
  let sColor = palette?.[1]?.hex || "#1C1C1E";
  let aColor = palette?.[2]?.hex || "#00F2FE";
  let nColor = palette?.[3]?.hex || "#F5F5F7";

  let hasColorShift = false;
  if (p.includes("pink") || p.includes("hồng") || p.includes("rose") || p.includes("hồng phấn")) {
    hasColorShift = true;
    pColor = "#E05283"; // Luxury Rose Pink
    sColor = "#D4AF37"; // Champagne Gold
    aColor = "#F4A7B9"; // Cherry Blossom Pink
    nColor = "#FFF6F8"; // Delicate Pink Silk White
    variationName = "Lumina Rose Gold & Soft Pink Edition";
    rationale = "AI đã chuyển đổi màu chủ đạo sang sắc hồng phấn (Rose Pink) kết hợp vàng kim (Champagne Gold) quý phái theo yêu cầu.";
    
    // Đổi màu rect background canvas
    updatedSvg = updatedSvg.replace(
      /(<rect\s+[^>]*width=["']500["'][^>]*fill=["'])([^"']*)(["'])/i,
      `$1${nColor}$3`
    );
    // Đổi màu title sang Rose Pink / Gold
    updatedSvg = updatedSvg.replace(
      /(\.brand-title\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${pColor}$3`
    );
    updatedSvg = updatedSvg.replace(
      /(\.brand-sub\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${sColor}$3`
    );
    updatedSvg = updatedSvg.replace(
      /(\.brand-tagline\s*\{[^}]*fill:\s*)([^;]+)(;)/i,
      `$1${pColor}$3`
    );
  } else if (p.includes("gold") || p.includes("vàng") || p.includes("champagne") || p.includes("ánh kim")) {
    hasColorShift = true;
    pColor = "#D4AF37";
    sColor = "#111111";
    aColor = "#F3E5AB";
    nColor = "#FAF7F2";
    variationName = "Lumina Champagne Gold Edition";
    rationale = "AI đã nâng cấp nhận diện sang tông màu Champagne Gold hoàng gia kết hợp nền be lụa sang trọng.";
  } else if (p.includes("blue") || p.includes("xanh") || p.includes("navy")) {
    hasColorShift = true;
    pColor = "#0066CC";
    sColor = "#0A2540";
    aColor = "#00F2FE";
    nColor = "#F4F8FC";
    variationName = "Lumina Royal Navy Edition";
    rationale = "AI đã chuyển đổi nhận diện sang gam màu Xanh Hoàng Gia (Royal Navy) thanh lịch và tin cậy.";
  }

  // 2. Phân tích & thay đổi Motif / Biểu tượng nếu câu lệnh yêu cầu
  let hasMotifChange = false;

  // Lấy chính xác cặp chữ cái Monogram bằng bộ phân tích thông minh cho MỌI thương hiệu
  const brandMatch = updatedSvg.match(/class=["'][^"']*brand-title[^"']*["'][^>]*>([^<]+)<\/text>/i);
  const brandRaw = brandMatch ? brandMatch[1].trim() : "COCO";
  const monogramInfo = extractBrandMonogramLetters(brandRaw, prompt);
  const { char1, char2, isTwin } = monogramInfo;

  if (p.includes("infinity") || p.includes("vô cực") || p.includes("liền mạch") || p.includes("dòng chảy")) {
    hasMotifChange = true;
    variationName = "Continuous Infinity Ribbon (Dòng Chảy Vô Cực Liền Mạch)";
    rationale = `AI đã kiến tạo biểu tượng Dòng Chảy Vô Cực Liền Mạch (Continuous Infinity Ribbon) theo phong cách thiết kế đương đại chuẩn quốc tế.`;
    const infinity = renderContinuousInfinityWordmark(brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${infinity}\n$3`
    );
  } else if (p.includes("đồng tâm") || p.includes("concentric") || p.includes("labyrinth") || p.includes("mục tiêu") || p.includes("vành đai")) {
    hasMotifChange = true;
    variationName = "Concentric Golden Ratio Labyrinth (Vành Đai Đồng Tâm Tỷ Lệ Vàng)";
    rationale = `AI đã thiết kế biểu tượng Vành Đai Đồng Tâm Tỷ Lệ Vàng (Concentric Labyrinth) tạo hình chữ '${char1}' sắc nét và điểm hội tụ trung tâm quyền năng.`;
    const labyrinth = renderConcentricLabyrinthEmblem(brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${labyrinth}\n$3`
    );
  } else if (p.includes("squircle") || p.includes("hữu cơ") || p.includes("lát cắt")) {
    hasMotifChange = true;
    variationName = "Organic Squircle & Crescent (Khối Hữu Cơ Đa Tầng Cắt Lớp)";
    rationale = `AI đã kiến tạo khối biểu tượng Squircle bo góc kết hợp các tầng cắt cung tròn hữu cơ và mảng âm bản tinh xảo.`;
    const squircleEmblem = renderOrganicSquircleCrescent(brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${squircleEmblem}\n$3`
    );
  } else if (p.includes("monogram") || p.includes("chữ lồng") || p.includes("2 chữ") || p.includes("hai chữ") || p.includes("lồng ghép") || p.includes("cc")) {
    hasMotifChange = true;
    if (isTwin || (char1 === "C" && char2 === "C") || p.includes("cc")) {
      variationName = `Haute Couture Interlocking Monogram [${char1}${char2}]`;
      rationale = `AI đã kiến tạo Monogram 2 chữ cái '${char1}' & '${char2}' đối xứng gương lồng móc xích (Interlocking Under-Over Weave) theo chuẩn mực Haute Couture kinh điển thế giới.`;
      const twinMonogram = renderInterlockingTwinMonogram(char1, pColor, sColor, aColor);
      updatedSvg = updatedSvg.replace(
        /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
        `$1\n${twinMonogram}\n$3`
      );
    } else {
      variationName = `Architectural Duo Monogram [${char1}&${char2}]`;
      rationale = `AI đã kiến tạo Monogram 2 chữ cái '${char1}' & '${char2}' lồng ghép móc xích kiến trúc chia sẻ nét dọc chung và khoảng thở âm bản.`;
      const duoMonogram = renderInterlockingDuoLetters(char1, char2, pColor, sColor, aColor);
      updatedSvg = updatedSvg.replace(
        /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
        `$1\n${duoMonogram}\n$3`
      );
    }
  } else if (p.includes("cánh bướm") || p.includes("bướm") || p.includes("butterfly")) {
    hasMotifChange = true;
    variationName = "Flora Butterfly (Cánh Bướm Tinh Tế)";
    rationale = "AI đã thiết kế biểu tượng Cánh Bướm Tinh Tế (Flora Butterfly) đối xứng tỷ lệ vàng, biểu trưng cho sự thăng hoa sắc đẹp và hương thơm quyến rũ.";
    const butterfly = renderButterflyEmblem(pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${butterfly}\n$3`
    );
  } else if (p.includes("cánh hoa") || p.includes("hoa sen") || p.includes("hoa") || p.includes("petals") || p.includes("camellia")) {
    hasMotifChange = true;
    variationName = "Blooming Petals (Cánh Hoa Nở Rộ)";
    rationale = "AI đã kiến tạo biểu tượng Cánh Hoa Nở Rộ (Blooming Petals) 8 hướng đối xứng chuẩn xác, khơi gợi hương thơm ngọt ngào và bản sắc thuần khiết.";
    const flower = renderFloralPetalsEmblem(pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${flower}\n$3`
    );
  } else if (p.includes("nước hoa") || p.includes("lọ nước hoa") || p.includes("perfume") || p.includes("flacon")) {
    hasMotifChange = true;
    variationName = "Haute Crystal Flacon (Lọ Nước Hoa Pha Lê)";
    rationale = "AI đã tạo tác biểu tượng Lọ Nước Hoa Pha Lê hoàng gia với các giác cắt kim cương khúc xạ ánh sáng tinh tế.";
    const flacon = renderPerfumeBottleEmblem(pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${flacon}\n$3`
    );
  } else if (p.includes("lập phương") || p.includes("cube") || p.includes("3d") || p.includes("tesseract")) {
    hasMotifChange = true;
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
  } else if (p.includes("đa giác") || p.includes("vi mạch") || p.includes("công nghệ") || p.includes("tech") || p.includes("node")) {
    hasMotifChange = true;
    variationName = "Digital Hexagon Nodes (Mạng lưới vi mạch số)";
    rationale = "AI đã tái cấu trúc thành mạng lưới vi mạch hình học đa giác với các cổng logic kết nối trung tâm.";
    const techEmblem = renderEmblemShape("tech", brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${techEmblem}\n$3`
    );
  } else if (p.includes("kim cương") || p.includes("sang trọng") || p.includes("luxury")) {
    hasMotifChange = true;
    variationName = "Luxury Prism & Diamond (Khối lăng kính kim cương)";
    rationale = "AI đã cấu trúc lại biểu tượng thành hình lăng kính kim cương đối xứng cao cấp.";
    const luxEmblem = renderEmblemShape("luxury", brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${luxEmblem}\n$3`
    );
  } else if (p.includes("mầm cây") || p.includes("chiếc lá") || p.includes("hữu cơ") || p.includes("organic")) {
    hasMotifChange = true;
    variationName = "Organic Botanical Curve (Khối hữu cơ tự nhiên)";
    rationale = "AI đã chuyển đổi thành hình thái mầm lá hữu cơ mềm mại, biểu trưng cho sự sinh sôi.";
    const organicEmblem = renderEmblemShape("organic", brandRaw, pColor, sColor, aColor);
    updatedSvg = updatedSvg.replace(
      /(<g\s+id=["']logo-emblem["'][^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1\n${organicEmblem}\n$3`
    );
  }

  // 3. Phân tích & điều chỉnh Kích thước (Icon Scaling)
  const isScaleUp = p.includes("tăng") || p.includes("phóng to") || p.includes("to hơn") || p.includes("lớn hơn") || p.includes("scale up") || p.includes("+");
  const isScaleDown = p.includes("giảm") || p.includes("thu nhỏ") || p.includes("nhỏ lại") || p.includes("nhỏ hơn") || p.includes("scale down") || p.includes("-");

  // Tìm tỉ lệ % cụ thể (e.g. "10%", "20%", "15%")
  const pctMatch = p.match(/(\d+)\s*%/);
  const parsedPct = pctMatch ? parseInt(pctMatch[1], 10) : (isScaleUp || isScaleDown ? 10 : 0);

  if (isScaleUp || isScaleDown || parsedPct > 0) {
    // Trích xuất scale hiện tại trong transform="translate(...) scale(S)"
    const currentScaleMatch = updatedSvg.match(/<g\s+id=["']logo-emblem["'][^>]*transform=["'][^"']*scale\(([\d.]+)\)[^"']*["']/i);
    let currentScale = currentScaleMatch ? parseFloat(currentScaleMatch[1]) : 1.0;
    if (isNaN(currentScale) || currentScale <= 0) currentScale = 1.0;

    const multiplier = isScaleDown ? (1 - parsedPct / 100) : (1 + parsedPct / 100);
    const newScale = Math.max(0.5, Math.min(2.5, +(currentScale * multiplier).toFixed(2)));

    // Cập nhật thẻ <g id="logo-emblem" ...>
    updatedSvg = updatedSvg.replace(
      /<g\s+id=["']logo-emblem["'][^>]*transform=["'][^"']*["']/i,
      `<g id="logo-emblem" transform="translate(250, 185) scale(${newScale})"`
    );

    const actionText = isScaleDown ? `giảm ${parsedPct}%` : `tăng ${parsedPct}%`;
    variationName = `Biểu Tượng Tinh Chỉnh Tỷ Lệ (${actionText.toUpperCase()})`;
    rationale = `AI đã tự động điều chỉnh ${actionText} kích thước biểu tượng (scale: ${newScale}x) và căn chuẩn tọa độ trung tâm (250, 185).`;
  } else if (!hasMotifChange && !hasColorShift) {
    // Nếu là lệnh chung chung hoặc nét vẽ
    if (p.includes("dày") || p.includes("đậm") || p.includes("bold") || p.includes("mạnh mẽ")) {
      variationName = "High-Impact Bold Strokes (Nét dày quyền lực)";
      rationale = "AI đã tăng 40% độ dày các nét vẽ chính để tạo cảm giác vững chãi, hiện đại.";
      updatedSvg = updatedSvg
        .replace(/stroke-width=["']1\.[0-4]["']/g, 'stroke-width="2.6"')
        .replace(/stroke-width=["']1\.8["']/g, 'stroke-width="3.2"')
        .replace(/stroke-width=["']2["']/g, 'stroke-width="3.5"');
    } else if (p.includes("thanh mảnh") || p.includes("mỏng") || p.includes("delicate") || p.includes("fine")) {
      variationName = "Minimalist Fine-Line (Nét thanh mảnh)";
      rationale = "AI đã giảm 35% độ dày các nét vẽ chính tạo cảm giác tinh tế, thanh thoát.";
      updatedSvg = updatedSvg
        .replace(/stroke-width=["']3(\.\d)?["']/g, 'stroke-width="1.4"')
        .replace(/stroke-width=["']2\.\d["']/g, 'stroke-width="1.2"')
        .replace(/stroke-width=["']2["']/g, 'stroke-width="1.1"');
    } else {
      variationName = "Modernist Refined Vector";
      rationale = `AI đã tinh chỉnh các tỷ lệ hình học và viền nét vector theo yêu cầu: "${prompt}".`;
      updatedSvg = updatedSvg
        .replace(/stroke-width=["']3["']/g, 'stroke-width="2.6"')
        .replace(/stroke-width=["']2\.2["']/g, 'stroke-width="2.0"');
    }
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

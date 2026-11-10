/**
 * LUMINA BRAND LAB — MOCKUP GENERATOR SERVICE 2.0
 * Xử lý:
 * - Quản lý và khởi tạo phôi ảnh mẫu (Blank Mockup Templates) tại /public/mockups/
 * - Tiếp nhận vector Logo SVG và mã màu (Color Hex)
 * - Tinh chỉnh vector (loại bỏ canvas nền đục, áp mã màu chuẩn, tạo hiệu ứng Letterpress/Deboss)
 * - Sử dụng thư viện Sharp để ghép (composite) logo lên phôi danh thiếp với độ phân giải cao 300 DPI
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { OverlayOptions } from "sharp";

export interface MockupPlacement {
  x?: number; // Tọa độ X tâm hoặc góc
  y?: number; // Tọa độ Y tâm hoặc góc
  maxWidth?: number; // Chiều rộng tối đa cho logo
  maxHeight?: number; // Chiều cao tối đa cho logo
}

export interface CompositeMockupOptions {
  svg: string; // Nội dung SVG của Logo
  color?: string; // Mã màu HEX (Ví dụ: #3D2B1F, #9E6B55)
  templateName?: string; // Tên file phôi (Mặc định: blank_namecard.png)
  scale?: number; // Tỷ lệ phóng to/thu nhỏ logo (0.5 -> 2.0)
  effect?: "letterpress" | "emboss" | "flat" | "gold_foil";
  cardBgColor?: string; // Tùy chọn đổi màu nền giấy danh thiếp
  placement?: MockupPlacement;
}

export interface CompositeMockupResult {
  buffer: Buffer;
  contentType: string;
  width: number;
  height: number;
  appliedColor: string;
  template: string;
}

const MOCKUPS_DIR = path.join(process.cwd(), "public", "mockups");

/**
 * Đảm bảo thư mục và phôi mẫu blank_namecard.png luôn tồn tại
 */
export async function ensureBlankNamecardTemplate(): Promise<string> {
  if (!fs.existsSync(MOCKUPS_DIR)) {
    fs.mkdirSync(MOCKUPS_DIR, { recursive: true });
  }

  const templatePath = path.join(MOCKUPS_DIR, "blank_namecard.png");
  if (fs.existsSync(templatePath)) {
    return templatePath;
  }

  // Khởi tạo phôi danh thiếp chuẩn Studio cao cấp (1600 x 1000 px)
  const width = 1600;
  const height = 1000;
  const cardW = 860;
  const cardH = 500;
  const cardX = (width - cardW) / 2; // 370
  const cardY = (height - cardH) / 2; // 250

  const templateSvg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Studio Surface (Warm Stone / Fine Concrete) -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EAE5DE" />
      <stop offset="45%" stop-color="#E0D9D0" />
      <stop offset="100%" stop-color="#D2C9BD" />
    </linearGradient>

    <!-- Studio Soft Directional Lighting from Top-Left -->
    <radialGradient id="studioLighting" cx="30%" cy="25%" r="85%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4" />
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.0" />
      <stop offset="100%" stop-color="#14110E" stop-opacity="0.18" />
    </radialGradient>

    <!-- Deep Ambient Drop Shadow for Card -->
    <filter id="ambientShadow" x="-20%" y="-20%" width="150%" height="160%">
      <feDropShadow dx="0" dy="36" stdDeviation="30" flood-color="#1E1712" flood-opacity="0.18" />
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#1E1712" flood-opacity="0.12" />
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1E1712" flood-opacity="0.22" />
    </filter>

    <!-- Card Cotton Paper Gradient -->
    <linearGradient id="cardPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF7" />
      <stop offset="65%" stop-color="#F8F4EE" />
      <stop offset="100%" stop-color="#F0E9DF" />
    </linearGradient>

    <!-- Card 3D Bevel Highlight -->
    <linearGradient id="topBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
    </linearGradient>

    <linearGradient id="leftBevel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
    </linearGradient>

    <filter id="leafBlur">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>

  <!-- Surface Backdrop -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#studioLighting)" />

  <!-- Botanical Leaf Ambient Shadow -->
  <g opacity="0.07" fill="#18130E" filter="url(#leafBlur)" transform="translate(-100, -80) scale(1.6)">
    <path d="M 120 40 Q 280 140 420 110 C 350 180 320 250 480 300 C 320 280 260 360 210 500 C 180 340 100 300 40 240 C 140 180 120 100 120 40 Z" />
    <path d="M 280 20 Q 380 90 490 70 C 440 120 410 180 540 220" stroke="#18130E" stroke-width="24" stroke-linecap="round" fill="none" />
  </g>

  <!-- Card Ambient Shadow -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" ry="10" fill="#E2DBD1" filter="url(#ambientShadow)" />

  <!-- Card Body -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" ry="10" fill="url(#cardPaperGrad)" />

  <!-- Card Bevel Highlights -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="3" rx="1.5" fill="url(#topBevel)" />
  <rect x="${cardX}" y="${cardY}" width="3" height="${cardH}" rx="1.5" fill="url(#leftBevel)" />
  <rect x="${cardX + 2}" y="${cardY + cardH - 2}" width="${cardW - 4}" height="2" rx="1" fill="#000000" opacity="0.08" />

  <!-- Blind Deboss Frame -->
  <rect x="${cardX + 32}" y="${cardY + 32}" width="${cardW - 64}" height="${cardH - 64}" rx="6" fill="none" stroke="#D3C9BD" stroke-width="0.8" stroke-opacity="0.6" stroke-dasharray="6 3" />

  <!-- Studio Typography Markers -->
  <text x="${cardX + 48}" y="${cardY + cardH - 42}" font-family="system-ui, -apple-system, sans-serif" font-size="10" letter-spacing="0.22em" fill="#AFA598" font-weight="600">LUMINA BRAND LAB • BLANK TEMPLATE</text>
  <text x="${cardX + cardW - 48}" y="${cardY + cardH - 42}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="10" letter-spacing="0.22em" fill="#AFA598" font-weight="600">380 GSM ARCHIVAL COTTON</text>
</svg>
  `;

  await sharp(Buffer.from(templateSvg))
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(templatePath);

  return templatePath;
}

/**
 * Chuẩn hóa mã màu HEX (Thêm '#' nếu thiếu)
 */
export function normalizeHexColor(color?: string, fallback: string = "#3D2B1F"): string {
  if (!color || typeof color !== "string") return fallback;
  const clean = color.trim().replace(/^#+/, "");
  if (/^[0-9A-Fa-f]{3}$/.test(clean)) {
    return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`.toUpperCase();
  }
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return `#${clean}`.toUpperCase();
  }
  return fallback;
}

/**
 * Tinh chỉnh SVG:
 * - Loại bỏ nền canvas đặc (Background Rect 500x500 hoặc bo góc) để logo trong suốt khi đặt lên danh thiếp
 * - Áp mã màu chỉ định vào các thành phần chính (CSS class hoặc inline fill/stroke)
 */
export function prepareLogoSvgForMockup(svg: string, colorHex: string): string {
  if (!svg) return "";

  let cleaned = svg;

  // 1. Loại bỏ các thẻ rect full canvas background (như <rect width="500" height="500" fill="#F4EFEA"...>)
  cleaned = cleaned.replace(/<rect\s+[^>]*width=["']500["'][^>]*height=["']500["'][^>]*\/>/gi, "");
  cleaned = cleaned.replace(/<rect\s+[^>]*rx=["']28["'][^>]*\/>/gi, "");
  cleaned = cleaned.replace(/<rect\s+[^>]*rx=["']20["'][^>]*\/>/gi, "");
  cleaned = cleaned.replace(/<rect\s+[^>]*width=["']100%["'][^>]*height=["']100%["'][^>]*\/>/gi, "");

  // 2. Cập nhật mã màu vào style block nếu có class .brand-title, .brand-sub, .brand-tagline
  cleaned = cleaned.replace(
    /(\.brand-title\s*\{[^}]*fill:\s*)([^;]+)(;)/gi,
    `$1${colorHex}$3`
  );

  // 3. Nếu có biểu tượng với stroke màu nâu cũ (#3D2B1F), thay bằng colorHex
  cleaned = cleaned.replace(/stroke=["']#3D2B1F["']/gi, `stroke="${colorHex}"`);
  cleaned = cleaned.replace(/fill=["']#3D2B1F["']/gi, `fill="${colorHex}"`);

  // 4. Nếu SVG không dùng class mà dùng inline fill trực tiếp trên text, áp colorHex
  cleaned = cleaned.replace(/(<text[^>]*fill=["'])([^"']*)(["'][^>]*>)/gi, `$1${colorHex}$3`);

  return cleaned;
}

/**
 * Ghép Logo SVG lên phôi Mockup bằng thư viện Sharp
 */
export async function compositeLogoOnMockup(
  options: CompositeMockupOptions
): Promise<CompositeMockupResult> {
  const {
    svg,
    color = "#3D2B1F",
    templateName = "blank_namecard.png",
    scale = 1.0,
    effect = "letterpress"
  } = options;

  const validHex = normalizeHexColor(color, "#3D2B1F");

  // 1. Đảm bảo phôi mẫu sẵn sàng
  await ensureBlankNamecardTemplate();
  let templatePath = path.join(MOCKUPS_DIR, templateName);
  const libraryMockupPath = path.join(process.cwd(), "public", "library", "mockups", templateName);
  
  if (fs.existsSync(libraryMockupPath)) {
    templatePath = libraryMockupPath;
  } else if (!fs.existsSync(templatePath)) {
    // Thử tìm phôi thay thế
    const fallbackPath = path.join(MOCKUPS_DIR, "blank_namecard.png");
    if (fs.existsSync(fallbackPath)) {
      templatePath = fallbackPath;
    } else {
      throw new Error(`Không tìm thấy file phôi mẫu: ${templateName}`);
    }
  }

  // 2. Tinh chế SVG với mã màu chỉ định
  const processedSvg = prepareLogoSvgForMockup(svg, validHex);

  // 3. Lấy kích thước phôi mẫu
  const templateMeta = await sharp(templatePath).metadata();
  const templateW = templateMeta.width || 1600;
  const templateH = templateMeta.height || 1000;

  // Tọa độ tâm của danh thiếp trên phôi:
  // Vùng danh thiếp: width 860, height 500, bắt đầu từ (370, 250) -> tâm là (800, 500)
  const cardCenterX = options.placement?.x ?? Math.round(templateW / 2); // 800
  const cardCenterY = options.placement?.y ?? Math.round(templateH / 2); // 500

  // Giới hạn kích thước logo tối đa trên danh thiếp (để giữ tỷ lệ cân đối tiêu chuẩn)
  const maxLogoW = Math.round((options.placement?.maxWidth ?? 480) * Math.min(Math.max(scale, 0.4), 2.2));
  const maxLogoH = Math.round((options.placement?.maxHeight ?? 320) * Math.min(Math.max(scale, 0.4), 2.2));

  // 4. Render SVG sang PNG buffer độ nét cao 300 DPI với nền trong suốt
  const renderedLogoBuffer = await sharp(Buffer.from(processedSvg), { density: 300 })
    .resize({
      width: maxLogoW,
      height: maxLogoH,
      fit: "inside",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  const renderedLogoMeta = await sharp(renderedLogoBuffer).metadata();
  const logoActualW = renderedLogoMeta.width || maxLogoW;
  const logoActualH = renderedLogoMeta.height || maxLogoH;

  // Tính toán tọa độ đặt logo căn giữa thẻ
  const logoLeft = Math.round(cardCenterX - logoActualW / 2);
  const logoTop = Math.round(cardCenterY - logoActualH / 2);

  // 5. Chuẩn bị các layer composite (có thể thêm hiệu ứng Letterpress / Emboss cao cấp)
  const compositeLayers: OverlayOptions[] = [];

  if (effect === "letterpress" || effect === "emboss") {
    // Tạo layer viền dập chìm nhẹ (Letterpress subtle highlight)
    // Dịch nhẹ xuống 1px để tạo cảm giác khắc chìm vào thớ giấy cotton
    try {
      const highlightBuffer = await sharp(renderedLogoBuffer)
        .tint({ r: 255, g: 255, b: 255 })
        .modulate({ brightness: 1.2 })
        .ensureAlpha(0.22)
        .png()
        .toBuffer();

      compositeLayers.push({
        input: highlightBuffer,
        left: logoLeft,
        top: logoTop + 1,
        blend: "over"
      });
    } catch {
      // Fallback an toàn nếu hệ thống không hỗ trợ modulate/alpha cụ thể
    }
  }

  // Layer chính: Logo sắc nét với mã màu chỉ định
  compositeLayers.push({
    input: renderedLogoBuffer,
    left: logoLeft,
    top: logoTop,
    blend: "over"
  });

  // 6. Ghép Logo lên phôi ảnh mẫu bằng Sharp
  const outputBuffer = await sharp(templatePath)
    .composite(compositeLayers)
    .png({ quality: 96, compressionLevel: 8 })
    .toBuffer();

  return {
    buffer: outputBuffer,
    contentType: "image/png",
    width: templateW,
    height: templateH,
    appliedColor: validHex,
    template: templateName
  };
}

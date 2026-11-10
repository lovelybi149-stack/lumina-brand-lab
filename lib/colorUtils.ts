/**
/**
 * LUMINA BRAND LAB — COLOR UTILITIES
 * Hỗ trợ chuyển đổi mã màu: HEX <-> RGB <-> CMYK
 * Phục vụ bảng màu tiêu chuẩn in ấn và hiển thị số cho Pitch Deck (Bước 5)
 */

export interface ColorConversionResult {
  hex: string;
  rgb: string;
  cmyk: string;
  rgbValues: { r: number; g: number; b: number };
  cmykValues: { c: number; m: number; y: number; k: number };
  isLight: boolean;
}

/**
 * Chuyển HEX sang RGB {r, g, b}
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 61, g: 43, b: 31 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Chuyển RGB {r, g, b} sang CMYK {c, m, y, k} (theo tỷ lệ phần trăm 0-100)
 */
export function rgbToCmyk(r: number, g: number, b: number): {
  c: number;
  m: number;
  y: number;
  k: number;
} {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.999) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

/**
 * Kiểm tra màu sáng hay tối để render tương phản chữ phù hợp
 */
export function isLightColor(r: number, g: number, b: number): boolean {
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150;
}

/**
 * Chuyển đổi mã màu tổng hợp
 */
export function convertColor(hex: string): ColorConversionResult {
  const rgb = hexToRgb(hex);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const isLight = isLightColor(rgb.r, rgb.g, rgb.b);

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    cmyk: `C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%`,
    rgbValues: rgb,
    cmykValues: cmyk,
    isLight
  };
}

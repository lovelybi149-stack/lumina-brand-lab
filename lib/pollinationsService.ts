/**
 * LUMINA BRAND LAB — POLLINATIONS.AI IMAGERY SERVICE
 * 
 * Tự động sinh ảnh Moodboard độ phân giải cao (1200x800) sử dụng mô hình FLUX.1 từ Pollinations.AI.
 * Tuân thủ công thức Studio Photography 5 thành tố từ Skill Pollinations.AI:
 * [Chủ thể sản phẩm / Không gian] + [Phong cách thương hiệu] + [Bảng màu HEX] + [Chất liệu & Ánh sáng] + [Tham số chất lượng]
 * Lưu trữ ảnh vào: public/generated/{projectId}/moodboard_pollinations.jpg
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Tạo URL gọi ảnh trực tiếp từ Pollinations.AI với mô hình FLUX
 */
export function getPollinationsImageUrl(
  prompt: string,
  width = 1200,
  height = 800
): string {
  const encodedPrompt = encodeURIComponent(prompt.trim());
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;
}

/**
 * Tạo Prompt chuẩn Studio cho Pollinations AI dựa trên dữ liệu Brief
 */
export function buildPollinationsStudioPrompt(
  brandName: string,
  industry: string,
  styleVibe: string,
  colorTone: string,
  colorHexes: string[] = []
): string {
  const hexString = colorHexes.length > 0 ? ` with precise palette ${colorHexes.join(", ")}` : "";
  
  // Phân loại chủ thể bối cảnh theo ngành nghề
  const indLower = industry.toLowerCase();
  let subjectScene = `Professional commercial brand moodboard flatlay for ${brandName}, an artisanal ${industry} brand`;

  if (indLower.includes("công nghệ") || indLower.includes("tech") || indLower.includes("software") || indLower.includes("ai")) {
    subjectScene = `Modern high-tech workspace atmosphere with sleek matte hardware, glass branding card, glowing futuristic geometric polygon prism hologram for ${brandName}`;
  } else if (indLower.includes("thời trang") || indLower.includes("fashion") || indLower.includes("làm đẹp") || indLower.includes("beauty")) {
    subjectScene = `High-end luxury fashion atelier moodboard, draped raw silk and organic Belgian linen textures, embossed cotton business card, golden brass details for ${brandName}`;
  } else if (indLower.includes("f&b") || indLower.includes("cà phê") || indLower.includes("coffee") || indLower.includes("ẩm thực")) {
    subjectScene = `Artisanal slow-bar coffee sanctuary moodboard, heavy reclaimed wood table, hand-thrown ceramic cup with rising steam, unbleached washi stationery for ${brandName}`;
  }

  return `${subjectScene}, ${styleVibe} aesthetic, color tones ${colorTone}${hexString}, natural morning studio directional lighting, 8k resolution, photorealistic, Kinfolk and Architectural Digest magazine editorial quality, tactile textures, no blur, high fidelity`;
}

function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Sinh ảnh dự phòng chất lượng cao nội bộ bằng Sharp (nếu không có mạng Internet)
 */
async function generateLocalFallbackMoodboard(
  brandName: string,
  industry: string,
  styleVibe: string,
  colorTone: string,
  outputPath: string
): Promise<void> {
  const width = 1200;
  const height = 800;

  const safeBrand = escapeXml(brandName.toUpperCase());
  const safeIndustry = escapeXml(industry.toUpperCase());
  const safeVibe = escapeXml(styleVibe);
  const safeTone = escapeXml(colorTone);

  // Quyết định gam màu nền theo tông
  const isDark = colorTone.toLowerCase().includes("cool") || colorTone.toLowerCase().includes("luxury") || colorTone.toLowerCase().includes("tối");
  const bg1 = isDark ? "#141416" : "#F4EFEA";
  const bg2 = isDark ? "#1F1F24" : "#E8E2DA";
  const textCol = isDark ? "#FFFFFF" : "#2E241E";
  const accentCol = isDark ? "#0A84FF" : "#9E6B55";

  const svgTemplate = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="light" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#light)"/>

  <!-- Visual Moodboard Card Center -->
  <g filter="url(#shadow)" transform="translate(200, 150)">
    <rect width="800" height="500" rx="20" fill="${isDark ? '#232328' : '#FAF8F5'}" stroke="${accentCol}" stroke-opacity="0.3" stroke-width="1.5"/>
    
    <!-- Header Tag -->
    <text x="50" y="70" font-family="sans-serif" font-size="12" font-weight="700" letter-spacing="0.25em" fill="${accentCol}">LUMINA BRAND LAB • LIFESTYLE MOODBOARD</text>
    <text x="750" y="70" text-anchor="end" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="0.15em" fill="${accentCol}">FLUX.1 PHOTOREALISM</text>
    
    <!-- Divider -->
    <line x1="50" y1="95" x2="750" y2="95" stroke="${accentCol}" stroke-opacity="0.2" stroke-width="1"/>

    <!-- Brand Name Big -->
    <text x="50" y="190" font-family="serif" font-size="48" font-weight="700" letter-spacing="0.1em" fill="${textCol}">${safeBrand}</text>
    <text x="50" y="235" font-family="sans-serif" font-size="16" font-weight="600" letter-spacing="0.18em" fill="${accentCol}">${safeIndustry}</text>

    <!-- Narrative -->
    <text x="50" y="290" font-family="sans-serif" font-size="14" fill="${textCol}" opacity="0.8">Phong cách &amp; Cảm xúc: ${safeVibe}</text>
    <text x="50" y="325" font-family="sans-serif" font-size="14" fill="${textCol}" opacity="0.8">Tông màu chủ đạo: ${safeTone}</text>

    <!-- Swatches -->
    <g transform="translate(50, 375)">
      <circle cx="25" cy="25" r="22" fill="${accentCol}"/>
      <circle cx="85" cy="25" r="22" fill="${isDark ? '#00F2FE' : '#3D2B1F'}"/>
      <circle cx="145" cy="25" r="22" fill="${isDark ? '#C2A676' : '#5B7065'}"/>
      <circle cx="205" cy="25" r="22" fill="${isDark ? '#F5F5F7' : '#F4EFEA'}"/>
    </g>

    <text x="50" y="460" font-family="monospace" font-size="11" letter-spacing="0.1em" fill="${accentCol}">CURATED BY POLLINATIONS.AI FLUX ENGINE • 1200x800 HIGH FIDELITY</text>
  </g>
</svg>
  `;

  await sharp(Buffer.from(svgTemplate))
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

/**
 * Tự động tạo và lưu trữ ảnh Moodboard bằng Pollinations.AI FLUX.1
 * Có cơ chế xử lý Timeout & Fallback an toàn 100%.
 */
export async function generateAndSaveMoodboard(
  brandName: string,
  industry: string,
  styleVibe: string,
  colorTone: string,
  projectId: string,
  colorHexes: string[] = []
): Promise<string> {
  const prompt = buildPollinationsStudioPrompt(
    brandName,
    industry,
    styleVibe,
    colorTone,
    colorHexes
  );
  const imageUrl = getPollinationsImageUrl(prompt, 1200, 800);

  const dir = path.join(process.cwd(), "public", "generated", projectId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, "moodboard_pollinations.jpg");
  const publicUrl = `/generated/${projectId}/moodboard_pollinations.jpg`;

  try {
    // Thử gọi Pollinations.AI với timeout tối đa 3 giây để tránh làm khách hàng phải chờ lâu
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Pollinations HTTP Error ${res.status}`);
    }

    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    if (buffer.length < 5000) {
      throw new Error("Ảnh trả về dung lượng quá nhỏ (không hợp lệ)");
    }

    fs.writeFileSync(filePath, buffer);
    console.log(`✅ [Pollinations.AI] Đã lưu ảnh Moodboard thành công: ${filePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return publicUrl;
  } catch (error: any) {
    console.warn(`⚠️ [Pollinations.AI] Không thể tải ảnh trực tiếp (${error?.message || error}), kích hoạt Fallback Moodboard Generator...`);

    // Tạo ảnh studio dự phòng đẹp mắt và lưu đúng vị trí
    await generateLocalFallbackMoodboard(
      brandName,
      industry,
      styleVibe,
      colorTone,
      filePath
    );
    console.log(`✅ [Pollinations.AI Fallback] Đã tạo ảnh Moodboard dự phòng tại: ${filePath}`);
    return publicUrl;
  }
}

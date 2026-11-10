/**
 * LUMINA BRAND LAB — GOOGLE IMAGEN 3 PROMPT ENGINEERING & MOODBOARD HELPER
 *
 * Chức năng:
 * - Tiếp nhận thông tin thương hiệu (Tên, Ngành hàng, Câu chuyện, Bảng màu 60-30-10, Vibe thẩm mỹ).
 * - Tự động biên soạn Prompt chuẩn Studio (Kinfolk/Cereal Magazine editorial photography) tối ưu riêng cho Google Imagen 3 (model: imagen-3.0-generate-002).
 * - Định hình chi tiết: Góc chụp, quang sai ống kính (Hasselblad/Leica 50mm f/1.8), ánh sáng tự nhiên (Golden Hour 45°), chất liệu xúc giác (linen, gỗ lũa, gốm men mộc, giấy dó).
 * - Cung cấp Negative Prompt tiêu chuẩn để ngăn chặn hiện tượng giả lập CGI, da sáp, hoặc chi tiết méo mó.
 * - Đi kèm hàm gọi trực tiếp API Google Imagen 3 (`callGoogleImagen3`) có cơ chế fallback thông minh.
 */

import type { ColorItem, ProjectRecord } from "../types/curation";

export type MoodboardSceneType =
  | "cafe_interior" // Không gian quán cà phê mộc mạc, tĩnh lặng
  | "flatlay_lifestyle" // Bộ sắp đặt tĩnh vật trên bàn làm việc / tạp chí
  | "desk_workspace" // Góc làm việc tối giản của nhà thiết kế / nghệ nhân
  | "fashion_editorial" // Không gian thời trang Quiet Luxury, kiến trúc tối giản
  | "wellness_nature" // Spa, mỹ phẩm thiên nhiên, sương mờ cao nguyên
  | "culinary_artisan" // Ẩm thực thủ công, bếp mộc ấm cúng
  | "custom"; // Kịch bản tùy chỉnh do Designer định nghĩa

export type Imagen3AspectRatio = "1:1" | "16:9" | "4:3" | "9:16" | "3:4";

export interface BrandMoodboardParams {
  brandName: string;
  industry?: string;
  brandStory?: string;
  targetAudience?: string;
  colorPalette?: ColorItem[] | Array<{ role?: string; name?: string; hex: string; usage?: string }>;
  styleVibes?: string[]; // Ví dụ: ["Minimalist", "Rustic", "Wabi-sabi", "Artisanal"]
  sceneType?: MoodboardSceneType;
  customSceneDetails?: string;
  aspectRatio?: Imagen3AspectRatio;
  cameraOptics?: string;
  lightingMood?: string;
}

export interface StudioPromptResult {
  brandName: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: Imagen3AspectRatio;
  model: string;
  promptBreakdown: {
    subject: string;
    environmentAndStyling: string;
    colorHarmonics: string;
    lightingAndOptics: string;
    artDirection: string;
  };
  apiPayload: {
    instances: Array<{ prompt: string }>;
    parameters: {
      sampleCount: number;
      aspectRatio: string;
      personGeneration: string;
      safetySetting: string;
      outputMimeType: string;
    };
  };
}

/**
 * Phân tích và chuyển đổi bảng màu HEX thành mô tả cảm xúc thị giác cho AI
 */
function translatePaletteToSensoryLanguage(
  palette?: ColorItem[] | Array<{ role?: string; name?: string; hex: string; usage?: string }>
): string {
  if (!palette || palette.length === 0) {
    return "Harmonious organic earth tones, deep espresso brown, warm terracotta clay, unbleached cotton cream, and subtle mountain sage accents.";
  }

  const descriptions = palette.map((color) => {
    const role = color.role ? `(${color.role})` : "";
    const name = color.name || "";
    const hex = color.hex || "";
    return `${name} ${role} with exact color code ${hex}`;
  });

  return `Color palette strictly anchored by: ${descriptions.join("; ")}. Applied with a refined 60-30-10 aesthetic ratio, creating a balanced, high-contrast yet organic atmosphere.`;
}

/**
 * Xác định kịch bản bối cảnh phong cách sống dựa trên ngành hàng và vibe
 */
function getSceneDirectionTemplate(
  sceneType: MoodboardSceneType | undefined,
  industry: string = "",
  styleVibes: string[] = []
): { scene: string; props: string } {
  const combined = ` ${industry} ${styleVibes.join(" ")} `.toLowerCase();

  // 1. Nếu chỉ định cụ thể sceneType
  if (sceneType === "fashion_editorial" || /thời trang|fashion|apparel|couture/i.test(combined)) {
    return {
      scene: "An airy, brutalist-inspired architectural fashion showroom with soaring concrete ceilings and floor-to-ceiling glass.",
      props: "A serene raw travertine stone plinth, draped organic raw silk and unbleached Belgian linen, a sculptural matte bronze vase with a single dried botanical branch, gentle diffused shadows."
    };
  }

  if (sceneType === "wellness_nature" || /mỹ phẩm|dưỡng da|skincare|\bspa\b|wellness|thảo mộc/i.test(combined)) {
    return {
      scene: "A tranquil Japanese spa corner bathed in morning mist and dappled bamboo shadows.",
      props: "A damp natural river slate stone tray, frosted amber glass dropper bottles catching morning dew droplets, fresh green tea leaves, smooth tactile river pebbles, unbleached linen towel."
    };
  }

  if (sceneType === "desk_workspace" || /workspace|văn phòng|thiết kế|atelier|creative studio/i.test(combined) && !/coffee|cà phê/i.test(combined)) {
    return {
      scene: "A sunlit minimalist designer atelier and slow workspace with expansive windows looking out onto pine trees.",
      props: "A solid aged oak timber desk, handcrafted ceramic coffee mug with soft rising steam, artisanal stationery notebook with blind-embossed cotton cover, matte fountain pen, brass paperweight."
    };
  }

  if (sceneType === "culinary_artisan" || /ẩm thực|bếp|nhà hàng|dining|bakery/i.test(combined) && !/coffee|cà phê/i.test(combined)) {
    return {
      scene: "A rustic artisanal kitchen sanctuary bathed in warm afternoon natural light.",
      props: "A hand-carved wooden cutting board, freshly baked artisanal sourdough bread wrapped in rough linen cloth, cast iron kettle, fresh rosemary sprigs, sea salt crystals on rough granite counter."
    };
  }

  // Mặc định: F&B Specialty Coffee & Artisanal Living (như Gió Mộc Coffee / Aura Roasters)
  return {
    scene: "A serene, quiet corner of an artisanal highland specialty coffee slow-bar sanctuary overlooking misty pine-covered hills in Đà Lạt.",
    props: "A heavy reclaimed pine wood table showing authentic organic tree rings and wabi-sabi imperfections, a bespoke hand-thrown ceramic cup of single-origin pour-over coffee with delicate rising steam, a rustic dried pine cone, unbleached washi paper menu cards with tactile deckle edges, subtle botanical shadows cast across warm plaster walls."
  };
}

/**
 * HÀM HELPER CHÍNH: Tạo prompt chuẩn Studio cho Google Imagen 3
 * Tuân thủ hướng dẫn Prompt Engineering tiên tiến của Google DeepMind Imagen 3:
 * - Diễn giải bằng văn phong tự nhiên phong phú (rich descriptive prose) thay vì từ khóa rời rạc.
 * - Mô tả chi tiết: Chủ thể, Bối cảnh, Ánh sáng, Quang học ống kính máy ảnh, và Chất liệu xúc giác.
 */
export function buildImagen3MoodboardPrompt(params: BrandMoodboardParams): StudioPromptResult {
  const {
    brandName,
    industry = "Thương hiệu sáng tạo & Lối sống đương đại",
    brandStory = "",
    targetAudience = "",
    colorPalette = [],
    styleVibes = ["Minimalist", "Rustic", "Artisanal", "Wabi-sabi"],
    sceneType = "cafe_interior",
    customSceneDetails = "",
    aspectRatio = "16:9",
    cameraOptics = "Hasselblad H6D-100c medium format camera, 80mm f/2.8 prime lens",
    lightingMood = "Natural morning daylight pouring at a 45-degree angle through sheer linen curtains, casting soft volumetric sunbeams and gentle dappled shadows"
  } = params;

  // 1. Phân tích kịch bản
  const sceneTemplate = getSceneDirectionTemplate(sceneType, industry, styleVibes);
  const sceneDescription = customSceneDetails ? customSceneDetails : sceneTemplate.scene;
  const propsDescription = sceneTemplate.props;

  // 2. Chuyển đổi màu sắc
  const colorHarmonics = translatePaletteToSensoryLanguage(colorPalette);

  // 3. Phân rã cấu trúc thành phần prompt (Prompt Breakdown)
  const vibesText = styleVibes.join(", ");
  const storyExcerpt = brandStory ? ` embodying the brand essence: "${brandStory.slice(0, 150)}..."` : "";

  const subject = `High-end editorial lifestyle moodboard and atmosphere photograph capturing the soulful identity of "${brandName}" (${industry}), celebrated for its ${vibesText} aesthetic${storyExcerpt}.`;

  const environmentAndStyling = `The scene unfolds within ${sceneDescription} Featuring meticulously styled physical touchpoints: ${propsDescription} Everything radiates an authentic sense of slow living, mindful intentionality, and tactile craftsmanship.`;

  const lightingAndOptics = `Cinematography & Camera: Shot on ${cameraOptics}, shallow depth of field with creamy natural bokeh. Lighting: ${lightingMood}. Tactile fine organic film grain reminiscent of Kodak Portra 400.`;

  const artDirection = `Art Direction: Featured in Kinfolk, Cereal Magazine, and Architectural Digest. Perfectly balanced golden ratio composition with ample negative breathing space. Pristine textures: rough cedar wood grain, soft matte ceramic glaze, fibrous unbleached cotton paper. No clutter, serene and quiet luxury.`;

  // 4. Tổng hợp thành prompt hoàn chỉnh cho Imagen 3
  const fullPrompt = `${subject} ${environmentAndStyling} ${colorHarmonics} ${lightingAndOptics} ${artDirection}`
    .replace(/\s+/g, " ")
    .trim();

  // 5. Negative Prompt chuẩn Studio để tránh dị tật AI
  const negativePrompt =
    "cgi, 3d computer render, cartoon, digital illustration, anime, distorted perspective, extra hands, deformed fingers, low resolution, blurry textures, pixelated, harsh artificial neon flash, garish oversaturated colors, cheap plastic shine, glossy synthetic reflections, cluttered composition, tacky stock photography, text watermark, typographic gibberish, fake signatures, frame borders";

  return {
    brandName,
    prompt: fullPrompt,
    negativePrompt,
    aspectRatio,
    model: "imagen-3.0-generate-002",
    promptBreakdown: {
      subject,
      environmentAndStyling,
      colorHarmonics,
      lightingAndOptics,
      artDirection
    },
    apiPayload: {
      instances: [{ prompt: fullPrompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        personGeneration: "ALLOW_ADULT",
        safetySetting: "BLOCK_MEDIUM_AND_ABOVE",
        outputMimeType: "image/jpeg"
      }
    }
  };
}

/**
 * Helper tạo nhanh Prompt từ một ProjectRecord có sẵn trong hệ thống
 */
export function generateLifestyleMoodboardPromptFromProject(
  project: Partial<ProjectRecord>,
  options?: Partial<BrandMoodboardParams>
): StudioPromptResult {
  return buildImagen3MoodboardPrompt({
    brandName: project.brand_name || "Lumina Studio",
    industry: project.industry || "F&B Specialty Coffee",
    brandStory: project.brand_story || "",
    targetAudience: project.target_audience || "",
    colorPalette: project.palette || [],
    styleVibes: project.style_vibes || ["Minimalist", "Rustic"],
    aspectRatio: options?.aspectRatio || "16:9",
    sceneType: options?.sceneType || "cafe_interior",
    customSceneDetails: options?.customSceneDetails
  });
}

/**
 * Gọi API Google Imagen 3 thực tế (Endpoint Google AI Studio / Gemini API)
 * Nếu chưa cấu hình API Key, tự động trả về bản mô phỏng kèm Prompt hoàn chỉnh và ảnh chất lượng cao
 */
export async function callGoogleImagen3(
  params: BrandMoodboardParams,
  customApiKey?: string
): Promise<{
  success: boolean;
  imageUrl?: string;
  base64?: string;
  prompt: string;
  negativePrompt: string;
  isSimulated: boolean;
  message: string;
}> {
  const promptData = buildImagen3MoodboardPrompt(params);
  const apiKey =
    customApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.IMAGEN_API_KEY;

  // Nếu không có API Key trong môi trường, chạy chế độ mô phỏng thiết kế Studio
  if (!apiKey) {
    // Trả về ảnh Unsplash tuyển chọn đúng vibe thương hiệu
    const curatedFallbacks: Record<string, string> = {
      cafe_interior: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85",
      desk_workspace: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85",
      fashion_editorial: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
      wellness_nature: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85"
    };

    const fallbackUrl =
      curatedFallbacks[params.sceneType || "cafe_interior"] ||
      curatedFallbacks.cafe_interior;

    return {
      success: true,
      imageUrl: fallbackUrl,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      isSimulated: true,
      message:
        "Prompt chuẩn Studio cho Google Imagen 3 đã được khởi tạo thành công. (Đang hiển thị chế độ xem trước do chưa thiết lập GEMINI_API_KEY trong file .env)."
    };
  }

  // Gọi trực tiếp Google Imagen 3 API: models/imagen-3.0-generate-002:predict
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(promptData.apiPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Google Imagen 3 API trả về lỗi:", response.status, errText);
      throw new Error(`Google Imagen 3 API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const firstPrediction = data.predictions?.[0];
    const base64Bytes =
      firstPrediction?.bytesBase64Encoded || firstPrediction?.image?.imageBytes;

    if (base64Bytes) {
      const mime = promptData.apiPayload.parameters.outputMimeType || "image/jpeg";
      const dataUri = `data:${mime};base64,${base64Bytes}`;
      return {
        success: true,
        imageUrl: dataUri,
        base64: base64Bytes,
        prompt: promptData.prompt,
        negativePrompt: promptData.negativePrompt,
        isSimulated: false,
        message: "Đã tạo ảnh Moodboard phong cách sống thành công bằng Google Imagen 3!"
      };
    }

    throw new Error("Không tìm thấy dữ liệu ảnh bytesBase64Encoded từ Google Imagen 3.");
  } catch (err: any) {
    console.error("Lỗi khi kết nối Google Imagen 3:", err);
    return {
      success: false,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      isSimulated: true,
      message: `Lỗi kết nối Imagen 3: ${err.message}. Đã tạo sẵn Prompt để sử dụng thủ công.`
    };
  }
}

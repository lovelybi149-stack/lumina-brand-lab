/**
 * LUMINA BRAND LAB — API ROUTE: GENERATE MOODBOARD & IMAGEN 3 PROMPT
 * Tuyến đường: /api/generate-moodboard
 *
 * Chức năng:
 * - Tiếp nhận thông tin thương hiệu (hoặc projectId)
 * - Tự động tạo Prompt chuẩn Studio cho Google Imagen 3 (model: imagen-3.0-generate-002)
 * - Tùy chọn gọi trực tiếp Google Imagen 3 nếu có API Key hoặc trả về payload sẵn sàng gọi AI
 */

import { NextRequest, NextResponse } from "next/server";
import {
  buildImagen3MoodboardPrompt,
  callGoogleImagen3,
  generateLifestyleMoodboardPromptFromProject
} from "../../../lib/imagenHelper";
import { getProjectById } from "../../../lib/curationService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      projectId,
      brandName,
      industry,
      brandStory,
      colorPalette,
      styleVibes,
      sceneType,
      aspectRatio,
      executeCall = false
    } = body;

    let promptResult;

    if (projectId) {
      const project = await getProjectById(projectId);
      if (project) {
        promptResult = generateLifestyleMoodboardPromptFromProject(project, {
          sceneType,
          aspectRatio
        });
      }
    }

    if (!promptResult) {
      promptResult = buildImagen3MoodboardPrompt({
        brandName: brandName || "Gió Mộc Coffee",
        industry: industry || "F&B Specialty Coffee & Slow Workspace",
        brandStory:
          brandStory ||
          "Ẩn mình giữa triền đồi thông lộng gió của Đà Lạt, Gió Mộc Coffee là nơi thời gian chậm lại để tâm hồn tìm về nguyên bản.",
        colorPalette: colorPalette || [
          { role: "Primary", name: "Nâu Vỏ Thông Già", hex: "#3D2B1F" },
          { role: "Secondary", name: "Đất Đỏ Bazan Mờ", hex: "#9E6B55" },
          { role: "Neutral", name: "Trắng Giấy Dó Mộc", hex: "#F4EFEA" },
          { role: "Accent", name: "Xanh Thông Núi Mờ", hex: "#5B7065" }
        ],
        styleVibes: styleVibes || ["Minimalist", "Rustic", "Wabi-sabi", "Artisanal"],
        sceneType: sceneType || "cafe_interior",
        aspectRatio: aspectRatio || "16:9"
      });
    }

    // Nếu người dùng yêu cầu thực thi gọi Google Imagen 3
    if (executeCall) {
      const apiResult = await callGoogleImagen3({
        brandName: promptResult.brandName,
        industry,
        brandStory,
        colorPalette,
        styleVibes,
        sceneType,
        aspectRatio
      });

      return NextResponse.json({
        success: true,
        data: {
          prompt_result: promptResult,
          execution: apiResult
        }
      });
    }

    // Trả về Prompt chuẩn Studio và payload định dạng Google Imagen 3
    return NextResponse.json({
      success: true,
      data: promptResult
    });
  } catch (error: any) {
    console.error("Lỗi tại /api/generate-moodboard:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi xử lý prompt Imagen 3" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || "LUMINA-03";
    const sceneType = (searchParams.get("sceneType") as any) || "cafe_interior";
    const aspectRatio = (searchParams.get("aspectRatio") as any) || "16:9";

    const project = await getProjectById(projectId);
    const promptResult = project
      ? generateLifestyleMoodboardPromptFromProject(project, { sceneType, aspectRatio })
      : buildImagen3MoodboardPrompt({
          brandName: "Gió Mộc Coffee",
          industry: "F&B Specialty Coffee & Slow Workspace",
          brandStory:
            "Ẩn mình giữa triền đồi thông lộng gió của Đà Lạt, Gió Mộc Coffee là nơi thời gian chậm lại để tâm hồn tìm về nguyên bản.",
          colorPalette: [
            { role: "Primary", name: "Nâu Vỏ Thông Già", hex: "#3D2B1F" },
            { role: "Secondary", name: "Đất Đỏ Bazan Mờ", hex: "#9E6B55" },
            { role: "Neutral", name: "Trắng Giấy Dó Mộc", hex: "#F4EFEA" },
            { role: "Accent", name: "Xanh Thông Núi Mờ", hex: "#5B7065" }
          ],
          styleVibes: ["Minimalist", "Rustic", "Wabi-sabi"],
          sceneType,
          aspectRatio
        });

    return NextResponse.json({
      success: true,
      data: promptResult
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi xử lý prompt Imagen 3" },
      { status: 500 }
    );
  }
}

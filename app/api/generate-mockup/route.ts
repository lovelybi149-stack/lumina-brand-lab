/**
 * LUMINA BRAND LAB — API ROUTE: GENERATE MOCKUP
 * Tuyến đường: /api/generate-mockup
 *
 * Chức năng:
 * - Tiếp nhận file Logo SVG (qua multipart/form-data hoặc JSON payload) và mã màu (color hex)
 * - Sử dụng thư viện Sharp để ghép logo lên phôi ảnh mẫu (/public/mockups/blank_namecard.png)
 * - Trả về ảnh hoàn thiện dạng PNG chất lượng cao (300 DPI, hiệu ứng dập chìm giấy mỹ thuật)
 * - Hỗ trợ cả GET để xem trước nhanh trên trình duyệt hoặc nhúng vào thẻ <img>
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { compositeLogoOnMockup, normalizeHexColor } from "../../../lib/mockupService";
import { getProjectById } from "../../../lib/curationService";

export const dynamic = "force-dynamic";

/**
 * Lấy SVG dự phòng nếu người dùng không truyền file
 */
function getDefaultLogoSvg(): { svg: string; color: string } {
  // Thử đọc logo_master.svg ở thư mục gốc
  const masterSvgPath = path.join(process.cwd(), "logo_master.svg");
  if (fs.existsSync(masterSvgPath)) {
    return {
      svg: fs.readFileSync(masterSvgPath, "utf8"),
      color: "#3D2B1F"
    };
  }

  // Thử đọc từ brand_identity.json
  const identityJsonPath = path.join(process.cwd(), "brand_identity.json");
  if (fs.existsSync(identityJsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(identityJsonPath, "utf8"));
      return {
        svg: parsed.logo_design_svg || "",
        color: parsed.color_palette?.[0]?.hex || "#3D2B1F"
      };
    } catch {
      // bỏ qua
    }
  }

  // SVG tối giản dự phòng cuối cùng
  const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <circle cx="250" cy="180" r="70" fill="none" stroke="#3D2B1F" stroke-width="4" stroke-dasharray="240 15" />
  <path d="M 220 180 Q 250 140 280 180 T 310 180" fill="none" stroke="#9E6B55" stroke-width="3" stroke-linecap="round" />
  <circle cx="250" cy="180" r="8" fill="#5B7065" />
  <text x="250" y="320" text-anchor="middle" font-family="'Times New Roman', serif" font-weight="700" font-size="34" letter-spacing="0.18em" fill="#3D2B1F">LUMINA STUDIO</text>
  <text x="250" y="360" text-anchor="middle" font-family="sans-serif" font-weight="500" font-size="11" letter-spacing="0.32em" fill="#9E6B55">ARCHIVAL BRANDING &amp; DESIGN</text>
</svg>
  `;
  return { svg: fallbackSvg, color: "#3D2B1F" };
}

/**
 * POST: Tiếp nhận Logo SVG & Mã màu để tạo ảnh Mockup PNG
 */
export async function POST(request: NextRequest) {
  try {
    let svgContent = "";
    let colorCode = "#3D2B1F";
    let mockupType = "blank_namecard.png";
    let scale = 1.0;
    let format = "image"; // 'image' hoặc 'json'

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Kiểm tra file SVG upload
      const fileEntry = formData.get("file") || formData.get("logo");
      if (fileEntry && typeof fileEntry === "object" && "text" in fileEntry) {
        svgContent = await (fileEntry as File).text();
      }

      // Hoặc chuỗi SVG trực tiếp trong form field
      if (!svgContent) {
        const textSvg = formData.get("svg") || formData.get("logo_svg");
        if (typeof textSvg === "string") {
          svgContent = textSvg;
        }
      }

      const inputColor = formData.get("color") || formData.get("hex") || formData.get("color_code");
      if (typeof inputColor === "string") {
        colorCode = inputColor;
      }

      const inputScale = formData.get("scale");
      if (inputScale) {
        const parsedScale = parseFloat(String(inputScale));
        if (!isNaN(parsedScale)) scale = parsedScale;
      }

      const inputFormat = formData.get("format");
      if (typeof inputFormat === "string") {
        format = inputFormat.toLowerCase();
      }
    } else {
      // JSON Payload
      const body = await request.json().catch(() => ({}));
      svgContent = body.svg || body.logo_svg || body.logoSvg || body.logo || "";
      colorCode = body.color || body.hex || body.color_code || body.primaryColor || "#3D2B1F";
      if (typeof body.scale === "number") scale = body.scale;
      if (body.mockupType) mockupType = body.mockupType;
      if (body.format) format = body.format.toLowerCase();
    }

    // Nếu không có SVG nào được cung cấp, sử dụng SVG mặc định của thương hiệu
    if (!svgContent || !svgContent.trim()) {
      const defaultData = getDefaultLogoSvg();
      svgContent = defaultData.svg;
      if (colorCode === "#3D2B1F") colorCode = defaultData.color;
    }

    const normalizedColor = normalizeHexColor(colorCode);

    // Tiến hành ghép logo lên phôi danh thiếp bằng thư viện Sharp
    const result = await compositeLogoOnMockup({
      svg: svgContent,
      color: normalizedColor,
      templateName: mockupType.endsWith(".png") ? mockupType : "blank_namecard.png",
      scale
    });

    // Trả về JSON base64 nếu client yêu cầu
    if (format === "json") {
      const base64Image = `data:image/png;base64,${result.buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        mockup_url: base64Image,
        applied_color: result.appliedColor,
        template: result.template,
        width: result.width,
        height: result.height,
        size_bytes: result.buffer.length
      });
    }

    // Mặc định: Trả về file ảnh PNG hoàn thiện
    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="lumina_mockup_namecard.png"',
        "Content-Length": result.buffer.length.toString(),
        "X-Applied-Color": result.appliedColor,
        "Cache-Control": "public, max-age=3600, immutable"
      }
    });
  } catch (error: any) {
    console.error("Lỗi tại /api/generate-mockup (POST):", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Không thể tạo ảnh Mockup từ logo SVG và mã màu đã cung cấp."
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Hỗ trợ kiểm thử trực tiếp trên trình duyệt hoặc nhúng <img src="/api/generate-mockup?color=..." />
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const colorParam = searchParams.get("color") || searchParams.get("hex") || "#3D2B1F";
    const projectId = searchParams.get("projectId") || searchParams.get("id");
    const format = (searchParams.get("format") || "image").toLowerCase();
    const scaleParam = parseFloat(searchParams.get("scale") || "1.0");
    const scale = isNaN(scaleParam) ? 1.0 : scaleParam;

    let svgContent = searchParams.get("svg") || "";
    let appliedColor = normalizeHexColor(colorParam);

    // Nếu truyền projectId, lấy logo và mã màu từ dự án
    if (projectId && !svgContent) {
      const project = await getProjectById(projectId);
      if (project) {
        svgContent = project.logo_svg;
        if (!searchParams.get("color") && project.palette?.[0]?.hex) {
          appliedColor = project.palette[0].hex;
        }
      }
    }

    // Nếu vẫn chưa có SVG, dùng SVG mặc định của hệ thống
    if (!svgContent) {
      const defaultData = getDefaultLogoSvg();
      svgContent = defaultData.svg;
      if (!searchParams.get("color")) appliedColor = defaultData.color;
    }

    const result = await compositeLogoOnMockup({
      svg: svgContent,
      color: appliedColor,
      templateName: "blank_namecard.png",
      scale
    });

    if (format === "json") {
      const base64Image = `data:image/png;base64,${result.buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        mockup_url: base64Image,
        applied_color: result.appliedColor,
        template: result.template,
        width: result.width,
        height: result.height,
        size_bytes: result.buffer.length
      });
    }

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="lumina_mockup_namecard.png"',
        "Content-Length": result.buffer.length.toString(),
        "X-Applied-Color": result.appliedColor,
        "Cache-Control": "public, max-age=3600, immutable"
      }
    });
  } catch (error: any) {
    console.error("Lỗi tại /api/generate-mockup (GET):", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Lỗi xử lý hình ảnh mockup."
      },
      { status: 500 }
    );
  }
}

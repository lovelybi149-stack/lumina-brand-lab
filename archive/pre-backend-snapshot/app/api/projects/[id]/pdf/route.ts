import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getProjectById } from "../../../../../lib/curationService";
import { generateBrandAssets } from "../../../../../lib/exportGenerator";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: `Không tìm thấy dự án với mã: ${projectId}` },
        { status: 404 }
      );
    }

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "downloads",
      project.project_id,
      "brand_guideline.pdf"
    );

    // Nếu chưa có file PDF trên đĩa, tự động tạo ngay lập tức
    if (!fs.existsSync(pdfPath)) {
      await generateBrandAssets(project);
    }

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: "Lỗi trong quá trình tạo file PDF" },
        { status: 500 }
      );
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const slug = project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = `${slug}-brand-identity-pitch-deck.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error("Lỗi tải PDF:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

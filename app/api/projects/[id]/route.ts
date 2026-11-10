import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "../../../../lib/curationService";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy dự án với mã: ${projectId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project
    });
  } catch (error: any) {
    console.error(`Lỗi khi lấy chi tiết dự án:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}


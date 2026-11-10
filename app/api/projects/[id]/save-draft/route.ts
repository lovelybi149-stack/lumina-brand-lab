import { NextRequest, NextResponse } from "next/server";
import { saveProjectDraft, getProjectById } from "../../../../../lib/curationService";
import { ProjectRecord } from "../../../../../types/curation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body: Partial<ProjectRecord> = await request.json();

    const existing = await getProjectById(projectId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy dự án: ${projectId}` },
        { status: 404 }
      );
    }

    const updated: ProjectRecord = {
      ...existing,
      ...body,
      project_id: projectId
    };

    await saveProjectDraft(updated);

    return NextResponse.json({
      success: true,
      message: `Đã lưu bản nháp dự án ${projectId} thành công.`,
      project: updated
    });
  } catch (error: any) {
    console.error("Lỗi lưu bản nháp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}


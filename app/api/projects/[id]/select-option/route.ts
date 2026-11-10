import { NextRequest, NextResponse } from "next/server";
import { selectProjectLogoOption, getProjectById } from "../../../../../lib/curationService";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { selected_logo_id } = await request.json();

    if (!selected_logo_id || !["opt_1", "opt_2", "opt_3"].includes(selected_logo_id)) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn mã Option hợp lệ ('opt_1', 'opt_2' hoặc 'opt_3')." },
        { status: 400 }
      );
    }

    const result = await selectProjectLogoOption(projectId, selected_logo_id);

    return NextResponse.json({
      success: true,
      message: `Đã chọn ${selected_logo_id} làm Logo chính thức của dự án ${projectId}.`,
      project: result.project,
      selected_logo_id
    });
  } catch (error: any) {
    console.error("Lỗi khi chọn Logo Option:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}


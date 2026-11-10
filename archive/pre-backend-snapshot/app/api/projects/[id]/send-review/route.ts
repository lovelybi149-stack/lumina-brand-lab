import { NextRequest, NextResponse } from "next/server";
import { sendProjectToClientReview } from "../../../../../lib/curationService";

export const dynamic = "force-dynamic";

/**
 * API Route: POST /api/projects/[id]/send-review
 * Admin gửi bản thiết kế cho khách hàng duyệt (Đợt 1 hoặc Bản chốt nghiệm thu)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    let isFinal = false;
    try {
      const body = await request.json();
      isFinal = Boolean(body.is_final);
    } catch (_) {}

    const result = await sendProjectToClientReview(projectId, isFinal);

    return NextResponse.json({
      success: true,
      message: result.notificationMessage,
      project: result.project,
    });
  } catch (error: any) {
    console.error(`Lỗi khi gửi duyệt dự án:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

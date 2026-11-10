import { NextRequest, NextResponse } from "next/server";
import { submitClientReviewFeedback } from "../../../../lib/curationService";

export const dynamic = "force-dynamic";

/**
 * API Route: POST /api/review/submit-feedback
 * Nhận phản hồi duyệt mẫu hoặc phê duyệt chốt từ khách hàng
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = (body.project_id || "").trim();
    const selectedLogoId = (body.selected_logo_id || "opt_1") as "opt_1" | "opt_2" | "opt_3";
    const comment = (body.comment || "").trim();
    const feedbackType = (body.feedback_type || "revision") as "revision" | "approve_final";

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng (project_id)." },
        { status: 400 }
      );
    }

    const result = await submitClientReviewFeedback(
      projectId,
      selectedLogoId,
      comment,
      feedbackType
    );

    return NextResponse.json({
      success: true,
      message: result.message,
      project: result.project,
    });
  } catch (error: any) {
    console.error("Lỗi khi gửi phản hồi duyệt mẫu:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

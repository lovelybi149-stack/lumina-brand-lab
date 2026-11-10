import { NextRequest, NextResponse } from "next/server";
import { completeAndArchiveProject } from "../../../../../lib/curationService";

export const dynamic = "force-dynamic";

/**
 * API Route: POST /api/projects/[id]/complete
 * Khách hàng hoàn tất thanh toán VietQR & Nghiệm thu nhận bàn giao.
 * Tự động đồng bộ và lưu vào Thư viện mẫu thiết kế (data/libraryAssets.json)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    let paymentRef: string | undefined;
    try {
      const body = await request.json();
      paymentRef = body.payment_ref;
    } catch (_) {}

    const result = await completeAndArchiveProject(projectId, paymentRef);

    return NextResponse.json({
      success: true,
      message: "Đơn hàng đã được nghiệm thu và hoàn tất bàn giao thành công!",
      project: result.project,
      export_links: result.export_links,
    });
  } catch (error: any) {
    console.error(`Lỗi khi hoàn tất đơn hàng:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

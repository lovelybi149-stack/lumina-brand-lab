import { NextRequest, NextResponse } from "next/server";
import { markFeedbackAsRead } from "../../../../../lib/curationService";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = await markFeedbackAsRead(projectId);
    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAllProjects } from "../../../lib/curationService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách dự án:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}


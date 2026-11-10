import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: /api/admin/auth/logout
 * Phương thức: POST
 * Chức năng: Xóa Session Cookie lumina_admin_session và kết thúc phiên làm việc
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Đã đăng xuất khỏi Bàn làm việc Quản trị."
    });

    // Xóa cookie bằng cách set maxAge = 0
    response.cookies.set({
      name: "lumina_admin_session",
      value: "",
      httpOnly: false,
      path: "/",
      maxAge: 0,
      sameSite: "lax"
    });

    return response;
  } catch (err: any) {
    console.error("Lỗi đăng xuất Admin Logout:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

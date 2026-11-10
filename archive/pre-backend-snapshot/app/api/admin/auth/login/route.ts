import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: /api/admin/auth/login
 * Phương thức: POST
 * Chức năng: Tiếp nhận passkey từ Admin, kiểm tra với biến môi trường ADMIN_PASSKEY
 * và thiết lập Session Cookie lumina_admin_session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passkey } = body;

    const validPasskey = process.env.ADMIN_PASSKEY || "lumina2026";

    if (!passkey || typeof passkey !== "string") {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mã khóa quản trị." },
        { status: 400 }
      );
    }

    if (passkey.trim() !== validPasskey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Mã khóa quản trị không chính xác. Vui lòng thử lại!"
        },
        { status: 401 }
      );
    }

    // Passkey hợp lệ -> Thiết lập cookie phiên làm việc 7 ngày
    const response = NextResponse.json({
      success: true,
      message: "Xác thực Giám đốc Sáng tạo thành công!"
    });

    const maxAge = 7 * 24 * 60 * 60; // 7 ngày tính bằng giây

    response.cookies.set({
      name: "lumina_admin_session",
      value: "authenticated",
      httpOnly: false, // Cho phép đọc cả client & server theo đặc tả
      path: "/",
      maxAge: maxAge,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (err: any) {
    console.error("Lỗi xác thực Admin Login:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

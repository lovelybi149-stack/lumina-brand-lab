import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: /api/admin/auth/check
 * Phương thức: GET
 * Chức năng: Kiểm tra trạng thái đăng nhập dựa trên Cookie lumina_admin_session
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("lumina_admin_session");
    const isAuthenticated = sessionCookie?.value === "authenticated";

    return NextResponse.json({
      authenticated: isAuthenticated,
      status: isAuthenticated ? "authorized" : "unauthorized"
    });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 500 }
    );
  }
}

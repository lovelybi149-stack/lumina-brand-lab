import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("lumina_admin_session");
  const isAuthenticated = sessionCookie?.value === "authenticated";

  // Nếu người dùng vào trang đăng nhập mà ĐÃ ĐĂNG NHẬP -> Tự động chuyển thẳng vào Bàn làm việc
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Bảo vệ các tuyến đường nội bộ Admin & Dashboard
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (isProtectedAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*"
  ]
};

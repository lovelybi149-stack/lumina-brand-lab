import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "../../../../lib/curationService";
import { ProjectRecord } from "../../../../types/curation";

export const dynamic = "force-dynamic";

/**
 * Hàm loại bỏ dấu tiếng Việt để so sánh tên linh hoạt
 */
function removeVietnameseAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/**
 * API Route: POST /api/review/lookup
 * Tra cứu bản thiết kế của khách hàng linh hoạt theo:
 * 1. Số điện thoại (SĐT / Zalo)
 * 2. Mã đơn hàng (Project ID: LUMINA-05, LUMINA-01...)
 * 3. Tên khách hàng (tùy chọn kết hợp để tăng tính xác thực)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const searchKey = (body.search_key || body.project_id || body.phone || "").trim();
    const inputName = (body.client_name || "").trim();

    if (!searchKey && !inputName) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập Số điện thoại hoặc Mã đơn hàng để tra cứu.",
        },
        { status: 400 }
      );
    }

    const projects = await getAllProjects();

    // Chuẩn hóa từ khóa tìm kiếm
    const searchDigits = searchKey.replace(/\D/g, ""); // Chỉ lấy số nếu là SĐT
    const normalizedSearchKey = searchKey.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedInputName = removeVietnameseAccents(inputName);

    // Tìm dự án khớp
    const matchedProject = projects.find((p: ProjectRecord) => {
      const pIdNormalized = (p.project_id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pPhoneDigits = (p.client_phone || "").replace(/\D/g, "");
      const pNameNormalized = removeVietnameseAccents(p.client_name || "");
      const pBrandNormalized = removeVietnameseAccents(p.brand_name || "");

      // 1. So khớp theo Mã Dự Án (LUMINA-05, lumina 05, 05...)
      if (normalizedSearchKey && pIdNormalized === normalizedSearchKey) {
        return true;
      }
      if (normalizedSearchKey.length >= 2 && pIdNormalized.endsWith(normalizedSearchKey)) {
        return true;
      }

      // 2. So khớp theo Số Điện Thoại (ít nhất 6 số cuối)
      if (searchDigits.length >= 6 && pPhoneDigits.includes(searchDigits)) {
        return true;
      }

      // 3. So khớp theo Tên khách hàng hoặc Tên thương hiệu
      if (normalizedInputName.length >= 2) {
        if (pNameNormalized.includes(normalizedInputName) || normalizedInputName.includes(pNameNormalized)) {
          // Nếu có searchKey thì phải khớp thêm searchKey, nếu không có searchKey thì khớp luôn
          if (!searchKey) return true;
          if (pIdNormalized.includes(normalizedSearchKey) || pPhoneDigits.includes(searchDigits)) return true;
        }
      }

      // 4. Nếu tìm bằng tên thương hiệu
      if (normalizedSearchKey.length >= 3 && pBrandNormalized.includes(removeVietnameseAccents(searchKey))) {
        return true;
      }

      return false;
    });

    if (!matchedProject) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy đơn hàng phù hợp với Số điện thoại hoặc Mã này. Vui lòng kiểm tra lại thông tin!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: matchedProject,
    });
  } catch (error: any) {
    console.error("Lỗi khi tra cứu đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

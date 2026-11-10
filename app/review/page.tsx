import type { Metadata } from "next";
import { ClientReviewPortal } from "../../components/review/ClientReviewPortal";

export const metadata: Metadata = {
  title: "Cổng Tra Cứu & Duyệt Mẫu Thiết Kế — LUMINA BRAND LAB",
  description:
    "Cổng trực tuyến dành cho khách hàng tra cứu tiến độ, xem bản phác thảo logo, so sánh concept và gửi phản hồi chỉnh sửa trực tiếp đến Giám đốc Sáng tạo.",
};

export default function ReviewPage() {
  return <ClientReviewPortal />;
}

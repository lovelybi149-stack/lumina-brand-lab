import type { Metadata } from "next";
import { ClientReviewPortal } from "../../components/review/ClientReviewPortal";

export const metadata: Metadata = {
  title: "Tra Cứu Bản Thiết Kế Đơn Hàng — LUMINA BRAND LAB",
  description:
    "Tra cứu tiến độ và duyệt mẫu nhận diện thương hiệu với Giám đốc Sáng tạo Lumina Brand Lab.",
};

export default function TraCuuPage() {
  return <ClientReviewPortal />;
}

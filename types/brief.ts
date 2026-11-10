/**
 * LUMINA BRAND LAB — CLIENT PORTAL TYPES
 * Định nghĩa cấu trúc dữ liệu cho Smart Brief Form & Payload JSON
 * Nâng cấp: Bộ tính báo giá động & Cấu hình đơn hàng thời gian thực
 */

export type LogoFormatKey =
  | "Wordmark"
  | "Icon / Symbol"
  | "Combination Mark"
  | "Mascot / Illustrative";

export interface LogoFormatOption {
  id: LogoFormatKey;
  label: string;
  subLabel: string;
  description: string;
  examples: string;
  isRecommended?: boolean;
}

export interface ColorSwatchOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  colors: string[]; // Mã màu HEX thực tế để render swatch
  isAiRecommended?: boolean;
}

export interface StyleVibeOption {
  id: string;
  label: string;
  enLabel: string;
  description: string;
}

export interface IndustryOption {
  id: string;
  label: string;
  iconName: string;
  placeholderAudience: string;
}

// -----------------------------------------------------------------------------
// BỘ TÍNH BÁO GIÁ ĐỘNG (DYNAMIC PRICING & ORDER CONFIG)
// -----------------------------------------------------------------------------

export type DeliveryTimeKey = "24h" | "3d";
export type LogoOptionsCount = 1 | 3;
export type RevisionRounds = 1 | 2;

export interface OrderConfig {
  delivery_time: DeliveryTimeKey;
  logo_options_count: LogoOptionsCount;
  revision_rounds: RevisionRounds;
  quote_price: number;
  currency: "VND";
  payment_status: "Quotation_Accepted";
}

/**
 * Hàm tính giá tiền tự động theo ma trận giá chuẩn:
 * | Thời gian | Số Option | Số lần duyệt | Giá (VNĐ) | Ghi chú |
 * | 24h       | 1         | 1            | 800.000   | Express Tiết Kiệm |
 * | 24h       | 1         | 2            | 1.000.000 | Express Tiêu Chuẩn |
 * | 3d        | 1         | 1            | 800.000   | Khởi Nghiệp Cơ Bản |
 * | 3d        | 1         | 2            | 1.000.000 | Khởi Nghiệp Chuẩn |
 * | 3d        | 3         | 1            | 1.200.000 | Đa Dạng Concept |
 * | 3d        | 3         | 2            | 1.500.000 | Chuyên Nghiệp Toàn Diện |
 */
export function calculateQuote(
  deliveryTime: DeliveryTimeKey,
  optionsCount: LogoOptionsCount,
  revisions: RevisionRounds
): number {
  if (deliveryTime === "24h") {
    // Gói hỏa tốc 24h luôn cố định 1 option
    return revisions === 1 ? 800000 : 1000000;
  } else {
    // Gói tiêu chuẩn 3 ngày
    if (optionsCount === 1) {
      return revisions === 1 ? 800000 : 1000000;
    } else {
      return revisions === 1 ? 1200000 : 1500000;
    }
  }
}

/**
 * Lấy tên gói dịch vụ theo cấu hình
 */
export function getPackageName(
  deliveryTime: DeliveryTimeKey,
  optionsCount: LogoOptionsCount,
  revisions: RevisionRounds
): string {
  if (deliveryTime === "24h") {
    return revisions === 1 ? "Gói Express Tiết Kiệm" : "Gói Express Tiêu Chuẩn";
  } else {
    if (optionsCount === 1) {
      return revisions === 1 ? "Gói Khởi Nghiệp Cơ Bản" : "Gói Khởi Nghiệp Chuẩn";
    } else {
      return revisions === 1 ? "Gói Đa Dạng Concept" : "Gói Chuyên Nghiệp Toàn Diện";
    }
  }
}

export interface BriefFormData {
  // Bước 1: Định danh thương hiệu
  brand_name: string;
  slogan: string;
  industry: string;
  target_audience: string;

  // Bước 2: Định dạng Logo
  logo_format: LogoFormatKey;

  // Bước 3: Tông màu chủ đạo
  color_tone: string;

  // Bước 4: Phong cách & Cảm xúc (Tối đa 3)
  style_vibes: string[];

  // Bước 5: Thông tin liên hệ
  client_name: string;
  client_phone: string;
  client_email: string;

  // Bổ sung: Cấu hình gói dịch vụ & Báo giá thời gian thực
  order_config: OrderConfig;
}

/**
 * Payload JSON chuẩn đầu ra theo đặc tả kỹ thuật (Section V)
 */
export interface BriefPayload {
  project_id?: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  brand_name: string;
  slogan: string;
  industry: string;
  target_audience: string;
  logo_format: string;
  color_tone: string;
  style_vibes: string[];
  status: "Pending";
  created_at: string;

  // Cấu hình đơn hàng & Báo giá
  order_config: OrderConfig;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;

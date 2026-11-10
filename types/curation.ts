/**
 * LUMINA BRAND LAB — CURATION DASHBOARD TYPES
 * Định nghĩa cấu trúc dữ liệu cho Bàn làm việc Giám đốc Sáng tạo (Bước 4)
 * Nâng cấp: Hệ thống 3 Option Logo Master & Cơ chế bàn giao theo gói
 */

export type ProjectStatus =
  | "Pending"
  | "Draft"
  | "Client_Reviewing"
  | "Admin_Revising"
  | "Waiting_Client_Final_Approval"
  | "Awaiting_Payment"
  | "Paid_Pending_Delivery"
  | "Approved"
  | "Completed";

export interface ColorItem {
  role: "Primary" | "Secondary" | "Accent" | "Neutral" | string;
  name: string;
  hex: string;
  rgb?: string;
  usage?: string;
}

export interface TypographyConfig {
  heading: string;
  body: string;
  pairing_rationale?: string;
  google_fonts_url?: string;
}

export interface LogoLayoutConfig {
  layout: "stacked" | "horizontal"; // [Biểu tượng trên - Chữ dưới] HOẶC [Biểu tượng trái - Chữ phải]
  iconScale: number; // 0.5 to 2.0 (50% to 200%)
  iconPosX?: number; // Tọa độ X (-100 đến +100 px)
  iconPosY?: number; // Tọa độ Y (-100 đến +100 px)
  iconShape?: "tech" | "circle" | "luxury" | "monogram" | "organic"; // Hình dáng / Cấu tạo biểu tượng
  letterSpacing: number; // 0.0 to 0.5 (em)
  iconColor?: string;
  titleColor?: string;
  taglineColor?: string;
  bgColor?: string;
}

export interface LogoOption {
  id: "opt_1" | "opt_2" | "opt_3";
  title: string;             // Ví dụ: "Option 1: Tối giản Hiện đại", "Option 2: Biểu tượng Thiên nhiên"
  concept_note: string;      // Ý nghĩa ngắn gọn của biểu tượng
  svg: string;               // Mã vector SVG hoàn chỉnh viewBox="0 0 500 500"
  settings?: {               // Các tham số căn chỉnh
    iconScale: number;
    iconPosX?: number;
    iconPosY?: number;
    iconShape?: "tech" | "circle" | "luxury" | "monogram" | "organic";
    letterSpacing: number;
    primaryColor?: string;
    layout?: "stacked" | "horizontal";
  };
}

export interface ClientBriefData {
  client_name: string;
  client_phone: string;
  client_email: string;
  brand_name: string;
  industry: string;
  target_audience: string;
  logo_format: string;
  color_tone: string;
  style_vibes: string[];
  submitted_at: string;
  client_notes?: string;
}

export interface MockupDescriptions {
  namecard: {
    front: string;
    back: string;
  };
  packaging: {
    type: string;
    description: string;
  };
  signage?: {
    type: string;
    description: string;
  };
}

export interface ProjectRecord {
  project_id: string;
  brand_name: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  industry: string;
  target_audience: string;
  logo_format: string;
  color_tone: string;
  style_vibes: string[];
  submitted_at: string;
  status: ProjectStatus;
  approved_at?: string;

  // Gói đơn hàng & Cơ chế bàn giao
  order_tier: "standard" | "pro"; // standard: duyệt 1 option; pro: khách chọn 1 trong 3
  logo_options: LogoOption[];
  selected_logo_id: "opt_1" | "opt_2" | "opt_3"; // Option được chốt
  delivery_mode: "single" | "client_choice"; // Chế độ bàn giao: single = gửi 1 bản chốt; client_choice = khách tự chọn 1 trong 3

  // Cấu hình tiến độ & Duyệt mẫu (Client Review Portal)
  delivery_time?: "24h" | "3d";
  logo_options_count?: 1 | 3;
  revision_rounds?: number; // 1 hoặc 2 (tổng số lần duyệt cho phép)
  current_revision?: number; // 1 hoặc 2 (lần duyệt hiện tại)
  review_status?: "Pending_Review" | "Feedback_Submitted" | "Waiting_Client_Final_Approval" | "Final_Approved" | "Completed";
  has_unread_feedback?: boolean; // Cờ báo Admin có góp ý mới từ khách
  admin_notification?: string; // Nội dung thông báo nhấp nháy cho Admin
  payment_status?: "unpaid" | "paid"; // Trạng thái thanh toán VietQR
  payment_amount?: number; // Số tiền (ví dụ 1.500.000 hoặc 2.500.000 VNĐ)
  payment_time?: string;
  payment_ref?: string;
  client_feedback?: string;
  feedback_history?: Array<{
    revision_round: number;
    selected_option_id: string;
    comment: string;
    submitted_at: string;
    feedback_type?: "revision" | "approve_final";
  }>;

  // Curation editable fields
  brand_story: string;
  tagline: string;
  tagline_options?: string[];
  palette: ColorItem[];
  typography: TypographyConfig;
  logo_svg: string;
  original_logo_svg?: string;
  logo_layout: LogoLayoutConfig;
  mockups: MockupDescriptions;

  // URLs & Links
  moodboard_url?: string;
  mockup_url?: string;
  export_links?: {
    svg_url: string;
    png_url: string;
    pdf_url: string;
    client_proposal_url: string;
  };
}

/**
 * Payload cập nhật khi Phê duyệt (Database Update)
 */
export interface ApprovalPayload {
  project_id: string;
  status: "Approved";
  approved_at: string;
  order_tier?: "standard" | "pro";
  delivery_mode?: "single" | "client_choice";
  selected_logo_id?: "opt_1" | "opt_2" | "opt_3";
  logo_options?: LogoOption[];
  final_data: {
    brand_story: string;
    tagline: string;
    palette: Array<{
      role: string;
      hex: string;
      name: string;
    }>;
    typography: {
      heading: string;
      body: string;
    };
    final_logo_svg: string;
    export_links: {
      svg_url: string;
      png_url: string;
      pdf_url: string;
      client_proposal_url: string;
    };
  };
}

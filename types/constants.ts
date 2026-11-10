/**
 * LUMINA BRAND LAB — DỮ LIỆU ĐỊNH NGHĨA OPTIONS CHO SMART BRIEF
 */

import {
  IndustryOption,
  LogoFormatOption,
  ColorSwatchOption,
  StyleVibeOption,
} from "./brief";

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  {
    id: "F&B / Ẩm thực",
    label: "F&B / Ẩm thực",
    iconName: "Utensils",
    placeholderAudience: "Ví dụ: Người trẻ 20-35 tuổi, thích không gian yên tĩnh và làm việc, chuộng specialty coffee...",
  },
  {
    id: "Thời trang & Phụ kiện",
    label: "Thời trang & Phụ kiện",
    iconName: "Shirt",
    placeholderAudience: "Ví dụ: Phụ nữ 24-40 tuổi, nhân viên văn phòng & kinh doanh, yêu thích phong cách tối giản thanh lịch...",
  },
  {
    id: "Mỹ phẩm & Làm đẹp",
    label: "Mỹ phẩm & Làm đẹp",
    iconName: "Sparkles",
    placeholderAudience: "Ví dụ: Khách hàng 18-32 tuổi quan tâm đến mỹ phẩm thuần chay hữu cơ, chăm sóc da an toàn...",
  },
  {
    id: "Công nghệ & Phần mềm",
    label: "Công nghệ & Phần mềm",
    iconName: "Cpu",
    placeholderAudience: "Ví dụ: Doanh nghiệp SME, chuyên viên công nghệ, quản lý dự án tìm kiếm giải pháp chuyển đổi số...",
  },
  {
    id: "Dịch vụ & Tư vấn",
    label: "Dịch vụ & Tư vấn",
    iconName: "Briefcase",
    placeholderAudience: "Ví dụ: Các nhà sáng lập startup, chủ doanh nghiệp cần tư vấn chiến lược pháp lý và tài chính...",
  },
  {
    id: "Bất động sản",
    label: "Bất động sản",
    iconName: "Building2",
    placeholderAudience: "Ví dụ: Khách hàng thu nhập cao từ 35-55 tuổi tìm kiếm bất động sản nghỉ dưỡng sinh thái cao cấp...",
  },
  {
    id: "Khác",
    label: "Khác",
    iconName: "Lightbulb",
    placeholderAudience: "Ví dụ: Tệp khách hàng ngách với sở thích và thói quen tiêu dùng đặc thù...",
  },
];

export const LOGO_FORMAT_OPTIONS: LogoFormatOption[] = [
  {
    id: "Wordmark",
    label: "Dạng Chữ Nghệ Thuật",
    subLabel: "Wordmark / Typography",
    description: "Tập trung vào font chữ cách điệu, tinh tế, sang trọng.",
    examples: "Điển hình: Google, Zara, SONY, Calvin Klein",
    isRecommended: false,
  },
  {
    id: "Icon / Symbol",
    label: "Dạng Biểu Tượng Độc Lập",
    subLabel: "Icon / Symbol",
    description: "Hình khối biểu trưng ẩn dụ, hiện đại, ghi nhớ nhanh.",
    examples: "Điển hình: Apple, Nike, Twitter, Target",
    isRecommended: false,
  },
  {
    id: "Combination Mark",
    label: "Dạng Kết Hợp Biểu Tượng + Chữ",
    subLabel: "Combination Mark",
    description: "Gồm cả icon biểu tượng và tên thương hiệu hài hòa, linh hoạt ứng dụng mọi ấn phẩm.",
    examples: "Điển hình: Adidas, Lacoste, Starbucks, Spotify",
    isRecommended: true,
  },
  {
    id: "Mascot / Illustrative",
    label: "Dạng Linh Vật / Minh Họa",
    subLabel: "Mascot / Illustrative",
    description: "Hình vẽ nhân vật vui tươi, gần gũi, giàu tính biểu cảm và kể chuyện.",
    examples: "Điển hình: KFC, Michelin, Pringles, Duolingo",
    isRecommended: false,
  },
];

export const COLOR_SWATCH_OPTIONS: ColorSwatchOption[] = [
  {
    id: "Earth Tones (Nâu gỗ, xanh lá rừng, be đất)",
    name: "Tự Nhiên & Mộc Mạc",
    subtitle: "Earth Tones",
    description: "Nâu gỗ, xanh lá rừng, be đất, xám ấm.",
    colors: ["#3D2B1F", "#5B7065", "#9E6B55", "#F4EFEA"],
  },
  {
    id: "Luxury Monochrome (Đen tuyền, trắng tinh khôi, vàng đồng)",
    name: "Tối Giản & Sang Trọng",
    subtitle: "Luxury Monochrome",
    description: "Đen tuyền, trắng tinh khôi, vàng đồng (Gold).",
    colors: ["#0A0A0B", "#D4AF37", "#71717A", "#FAFAFA"],
  },
  {
    id: "Cool & Tech (Xanh dương đậm, xanh ngọc, xám chì)",
    name: "Công Nghệ & Tin Cậy",
    subtitle: "Cool & Tech",
    description: "Xanh dương đậm, xanh ngọc (Teal), xám chì.",
    colors: ["#0F172A", "#0284C7", "#0D9488", "#64748B"],
  },
  {
    id: "Warm & Vibrant (Đỏ ấm, cam san hô, vàng nắng)",
    name: "Năng Động & Nhiệt Huyết",
    subtitle: "Warm & Vibrant",
    description: "Đỏ ấm, cam san hô, vàng nắng.",
    colors: ["#DC2626", "#F97316", "#EAB308", "#FFE4E6"],
  },
  {
    id: "Pastel & Soft (Hồng phấn, xanh pastel, kem vani)",
    name: "Ngọt Ngào & Tươi Trẻ",
    subtitle: "Pastel & Soft",
    description: "Hồng phấn, xanh pastel, kem vani.",
    colors: ["#F472B6", "#6EE7B7", "#FDE047", "#EDE9FE"],
  },
  {
    id: "AI Optimal Suggestion (AI tự do đề xuất bảng màu tối ưu theo ngành hàng)",
    name: "AI Đề Xuất Tự Do",
    subtitle: "AI Optimal Suggestion",
    description: "Để AI tự do đề xuất bảng màu tối ưu theo ngành hàng và tâm lý học thị giác.",
    colors: ["#6366F1", "#A855F7", "#EC4899", "#F59E0B"],
    isAiRecommended: true,
  },
];

export const STYLE_VIBE_OPTIONS: StyleVibeOption[] = [
  {
    id: "Minimalist",
    label: "Tối giản",
    enLabel: "Minimalist",
    description: "Đường nét gãy gọn, tinh khiết, loại bỏ chi tiết rườm rà.",
  },
  {
    id: "Luxury",
    label: "Sang trọng / Cao cấp",
    enLabel: "Luxury",
    description: "Đẳng cấp, tinh xảo, chất liệu kim loại & tương phản cao.",
  },
  {
    id: "Retro",
    label: "Cổ điển / Hoài niệm",
    enLabel: "Retro",
    description: "Phong vị Wabi-sabi, vintage, giàu chiều sâu văn hóa.",
  },
  {
    id: "Modern",
    label: "Hiện đại & Đột phá",
    enLabel: "Modern",
    description: "Góc cạnh, tương lai, phá vỡ bố cục truyền thống.",
  },
  {
    id: "Playful",
    label: "Trẻ trung & Vui vẻ",
    enLabel: "Playful",
    description: "Tươi tắn, năng lượng cao, thân thiện và giàu cảm xúc.",
  },
  {
    id: "Rustic",
    label: "Mộc mạc & Thô mộc",
    enLabel: "Rustic",
    description: "Gợi cảm giác tự nhiên, đất mẹ, thủ công hữu cơ.",
  },
];

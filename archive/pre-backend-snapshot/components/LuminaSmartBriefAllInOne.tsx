"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  FileCheck2,
  Layers,
  Building2,
  Palette,
  Sliders,
  SendHorizontal,
  User,
  Phone,
  Mail,
  Quote,
  Target,
  Utensils,
  Shirt,
  Cpu,
  Briefcase,
  Lightbulb,
  AlertCircle,
  Star,
  Brain,
  RotateCcw,
  Copy,
  Download,
  FileCode2,
  Building,
  Crown,
  Feather,
  History,
  Zap,
  Smile,
  Trees,
} from "lucide-react";

// =============================================================================
// I. DATA TYPES & INTERFACES (SCHEMA DEFINITIONS)
// =============================================================================

export type LogoFormatKey =
  | "Wordmark"
  | "Icon / Symbol"
  | "Combination Mark"
  | "Mascot / Illustrative";

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

export function calculateQuote(
  deliveryTime: DeliveryTimeKey,
  optionsCount: LogoOptionsCount,
  revisions: RevisionRounds
): number {
  if (deliveryTime === "24h") {
    return revisions === 1 ? 800000 : 1000000;
  } else {
    if (optionsCount === 1) {
      return revisions === 1 ? 800000 : 1000000;
    } else {
      return revisions === 1 ? 1200000 : 1500000;
    }
  }
}

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

  // Cấu hình đơn hàng & Báo giá
  order_config: OrderConfig;
}

export interface BriefPayload {
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
  order_config: OrderConfig;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;

// =============================================================================
// II. CONSTANTS & SYSTEM OPTIONS
// =============================================================================

const INDUSTRY_OPTIONS = [
  { id: "F&B / Ẩm thực", label: "F&B / Ẩm thực", icon: Utensils },
  { id: "Thời trang & Phụ kiện", label: "Thời trang & Phụ kiện", icon: Shirt },
  { id: "Mỹ phẩm & Làm đẹp", label: "Mỹ phẩm & Làm đẹp", icon: Sparkles },
  { id: "Công nghệ & Phần mềm", label: "Công nghệ & Phần mềm", icon: Cpu },
  { id: "Dịch vụ & Tư vấn", label: "Dịch vụ & Tư vấn", icon: Briefcase },
  { id: "Bất động sản", label: "Bất động sản", icon: Building2 },
  { id: "Khác", label: "Khác", icon: Lightbulb },
];

const LOGO_FORMAT_OPTIONS = [
  {
    id: "Wordmark" as LogoFormatKey,
    label: "Dạng Chữ Nghệ Thuật",
    subLabel: "Wordmark / Typography",
    description: "Tập trung vào font chữ cách điệu, tinh tế, sang trọng.",
    examples: "Điển hình: Google, Zara, SONY, Calvin Klein",
    isRecommended: false,
  },
  {
    id: "Icon / Symbol" as LogoFormatKey,
    label: "Dạng Biểu Tượng Độc Lập",
    subLabel: "Icon / Symbol",
    description: "Hình khối biểu trưng ẩn dụ, hiện đại, ghi nhớ nhanh.",
    examples: "Điển hình: Apple, Nike, Twitter, Target",
    isRecommended: false,
  },
  {
    id: "Combination Mark" as LogoFormatKey,
    label: "Dạng Kết Hợp Biểu Tượng + Chữ",
    subLabel: "Combination Mark",
    description: "Gồm cả icon biểu tượng và tên thương hiệu hài hòa, linh hoạt ứng dụng mọi ấn phẩm.",
    examples: "Điển hình: Adidas, Lacoste, Starbucks, Spotify",
    isRecommended: true,
  },
  {
    id: "Mascot / Illustrative" as LogoFormatKey,
    label: "Dạng Linh Vật / Minh Họa",
    subLabel: "Mascot / Illustrative",
    description: "Hình vẽ nhân vật vui tươi, gần gũi, giàu tính biểu cảm và kể chuyện.",
    examples: "Điển hình: KFC, Michelin, Pringles, Duolingo",
    isRecommended: false,
  },
];

const COLOR_SWATCH_OPTIONS = [
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

const STYLE_VIBE_OPTIONS = [
  { id: "Minimalist", label: "Tối giản", enLabel: "Minimalist", icon: Feather, desc: "Đường nét gãy gọn, tinh khiết, loại bỏ chi tiết rườm rà." },
  { id: "Luxury", label: "Sang trọng / Cao cấp", enLabel: "Luxury", icon: Crown, desc: "Đẳng cấp, tinh xảo, chất liệu kim loại & tương phản cao." },
  { id: "Retro", label: "Cổ điển / Hoài niệm", enLabel: "Retro", icon: History, desc: "Phong vị Wabi-sabi, vintage, giàu chiều sâu văn hóa." },
  { id: "Modern", label: "Hiện đại & Đột phá", enLabel: "Modern", icon: Zap, desc: "Góc cạnh, tương lai, phá vỡ bố cục truyền thống." },
  { id: "Playful", label: "Trẻ trung & Vui vẻ", enLabel: "Playful", icon: Smile, desc: "Tươi tắn, năng lượng cao, thân thiện và giàu cảm xúc." },
  { id: "Rustic", label: "Mộc mạc & Thô mộc", enLabel: "Rustic", icon: Trees, desc: "Gợi cảm giác tự nhiên, đất mẹ, thủ công hữu cơ." },
];

const INITIAL_FORM_DATA: BriefFormData = {
  brand_name: "",
  slogan: "",
  industry: "F&B / Ẩm thực",
  target_audience: "",
  logo_format: "Combination Mark",
  color_tone: "Earth Tones (Nâu gỗ, xanh lá rừng, be đất)",
  style_vibes: ["Minimalist", "Rustic"],
  client_name: "",
  client_phone: "",
  client_email: "",
  order_config: {
    delivery_time: "24h",
    logo_options_count: 1,
    revision_rounds: 2,
    quote_price: 1000000,
    currency: "VND",
    payment_status: "Quotation_Accepted",
  },
};

// =============================================================================
// III. COMPONENT: LUMINA SMART BRIEF ALL-IN-ONE
// =============================================================================

export default function LuminaSmartBriefAllInOne() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [completedSteps, setCompletedSteps] = useState<StepNumber[]>([]);
  const [formData, setFormData] = useState<BriefFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<BriefPayload | null>(null);

  // Smooth scroll helper
  const scrollToForm = () => {
    const el = document.getElementById("smart-brief-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateFormData = (fields: Partial<BriefFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (errors) {
      const keys = Object.keys(fields);
      const newErrors = { ...errors };
      keys.forEach((k) => delete newErrors[k]);
      setErrors(newErrors);
    }
  };

  const validateStep = (step: StepNumber): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.brand_name.trim()) newErrors.brand_name = "Vui lòng nhập tên thương hiệu để tiếp tục.";
      if (!formData.industry) newErrors.industry = "Vui lòng chọn ngành hàng hoạt động.";
    } else if (step === 2) {
      if (!formData.logo_format) newErrors.logo_format = "Vui lòng chọn 1 định dạng logo.";
    } else if (step === 3) {
      if (!formData.color_tone) newErrors.color_tone = "Vui lòng chọn 1 tông màu định hướng.";
    } else if (step === 4) {
      if (!formData.style_vibes || formData.style_vibes.length === 0) {
        newErrors.style_vibes = "Vui lòng chọn ít nhất 1 phong cách.";
      } else if (formData.style_vibes.length > 3) {
        newErrors.style_vibes = "Chỉ được chọn tối đa 3 tính từ.";
      }
    } else if (step === 5) {
      if (!formData.client_name.trim()) newErrors.client_name = "Vui lòng nhập họ và tên của bạn.";
      if (!formData.client_phone.trim()) {
        newErrors.client_phone = "Vui lòng nhập số điện thoại hoặc Zalo liên hệ.";
      } else if (formData.client_phone.trim().length < 8) {
        newErrors.client_phone = "Số điện thoại không hợp lệ (tối thiểu 8 chữ số).";
      }
      if (!formData.client_email.trim()) {
        newErrors.client_email = "Vui lòng nhập email nhận trọn bộ file.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email.trim())) {
        newErrors.client_email = "Địa chỉ email không đúng định dạng.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as StepNumber);
        scrollToForm();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
      scrollToForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    // SCHEMA DỮ LIỆU ĐẦU RA CHUẨN SECTION V
    const payload: BriefPayload = {
      client_name: formData.client_name.trim(),
      client_phone: formData.client_phone.trim(),
      client_email: formData.client_email.trim(),
      brand_name: formData.brand_name.trim(),
      slogan: formData.slogan.trim() || "Chưa có khẩu hiệu (AI đề xuất)",
      industry: formData.industry,
      target_audience: formData.target_audience.trim() || "Khách hàng phổ thông",
      logo_format: formData.logo_format,
      color_tone: formData.color_tone,
      style_vibes: formData.style_vibes,
      status: "Pending",
      created_at: new Date().toISOString(),
      order_config: formData.order_config,
    };

    setSubmittedPayload(payload);
    setIsProcessing(true);

    // Call internal Next.js API in background
    try {
      fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (_) {}
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCompletedSteps([]);
    setCurrentStep(1);
    setIsProcessing(false);
    setIsSuccess(false);
    setSubmittedPayload(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* =========================================================================
          TOP NAVBAR
      ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-300 text-lg">L</span>
              </div>
            </div>
            <div>
              <div className="font-serif font-bold text-stone-100 text-lg tracking-wider">
                LUMINA <span className="font-sans font-light text-amber-400 text-sm">BRAND LAB</span>
              </div>
              <div className="text-[10px] text-stone-400 tracking-widest uppercase">
                AI × CREATIVE DIRECTOR STUDIO
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-stone-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bàn giao 24h [SVG + PNG + PDF]</span>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Gửi Brief Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          1. HERO SECTION (Giới thiệu & Kêu gọi)
      ========================================================================= */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-24 border-b border-stone-800/60 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide shadow-lg mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>LUMINA BRAND LAB • THIẾT KẾ NHẬN DIỆN BÁN TỰ ĐỘNG</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15] mb-6">
            LUMINA BRAND LAB —
            <span className="block mt-2 font-sans font-light text-2xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 bg-clip-text text-transparent">
              Khởi tạo Bản sắc Thương hiệu Chuẩn mực trong 24 Giờ
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-stone-400 font-light leading-relaxed mb-10">
            Sự kết hợp giữa tốc độ đột phá của <span className="text-stone-200 font-medium">Trí tuệ Nhân tạo</span> và con mắt thẩm mỹ của <span className="text-amber-300 font-medium">Giám đốc Sáng tạo</span>. Nhận ngay Concept Logo, Màu sắc, Font chữ và Trọn bộ file <span className="text-stone-200 font-semibold">[SVG + PNG + PDF]</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={scrollToForm}
              type="button"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Bắt đầu Gửi Brief Thiết Kế</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-6 border-t border-stone-800/60">
            <div className="p-3 rounded-lg bg-stone-900/40 border border-stone-800/40 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-200">Tốc độ 24h</div>
                <div className="text-[11px] text-stone-400">Hoàn thành proposal</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/40 border border-stone-800/40 flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-200">Trọn Bộ File</div>
                <div className="text-[11px] text-stone-400">SVG + PNG 300 DPI</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/40 border border-stone-800/40 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-200">Human Curation</div>
                <div className="text-[11px] text-stone-400">Giám đốc Sáng tạo duyệt</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/40 border border-stone-800/40 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-200">Brand Guideline</div>
                <div className="text-[11px] text-stone-400">Cẩm nang PDF A4 ngang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2 & 3. SMART BRIEF STEPPER FORM / PROCESSING / SUCCESS STATE
      ========================================================================= */}
      <section id="smart-brief-form" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl shadow-stone-950/80 backdrop-blur-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          
          {/* STATE A: PROCESSING SCREEN (Loading 3 giây) */}
          {isProcessing && (
            <ProcessingScreenInline
              formData={formData}
              onFinish={() => {
                setIsProcessing(false);
                setIsSuccess(true);
                scrollToForm();
              }}
            />
          )}

          {/* STATE B: SUCCESS SCREEN */}
          {!isProcessing && isSuccess && submittedPayload && (
            <SuccessScreenInline
              payload={submittedPayload}
              onReset={handleReset}
            />
          )}

          {/* STATE C: 5-STEP SMART BRIEF WIZARD */}
          {!isProcessing && !isSuccess && (
            <div>
              {/* Stepper Header & Progress Bar */}
              <div className="w-full max-w-4xl mx-auto mb-10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-400 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-stone-200 font-semibold uppercase tracking-wider">
                      Bước {currentStep} / 5
                    </span>
                  </div>
                  <div className="font-mono text-amber-400">
                    Hoàn tất {Math.round((currentStep / 5) * 100)}%
                  </div>
                </div>

                <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-4 text-center">
                  {[
                    { num: 1, name: "Định Danh" },
                    { num: 2, name: "Logo" },
                    { num: 3, name: "Tông Màu" },
                    { num: 4, name: "Cảm Xúc" },
                    { num: 5, name: "Bàn Giao" },
                  ].map((s) => {
                    const isCur = currentStep === s.num;
                    const isDone = completedSteps.includes(s.num as StepNumber);
                    return (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => (isDone || s.num < currentStep) && setCurrentStep(s.num as StepNumber)}
                        disabled={!isDone && s.num > currentStep}
                        className={`p-2 rounded-xl transition-all ${
                          isCur
                            ? "bg-stone-800 border border-amber-500/40 text-amber-300 font-semibold"
                            : isDone
                            ? "text-stone-300 hover:text-white cursor-pointer"
                            : "text-stone-600 cursor-not-allowed"
                        }`}
                      >
                        <div className="text-[11px] sm:text-xs">
                          {isDone ? "✓ " : `${s.num}. `}{s.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Forms */}
              <div className="mt-8 mb-10">
                {/* ----------------- BƯỚC 1 ----------------- */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="border-b border-stone-800 pb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Bước 01 / 05</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                        Định Danh Thương Hiệu
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-200">
                        Tên thương hiệu <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.brand_name}
                        onChange={(e) => updateFormData({ brand_name: e.target.value })}
                        placeholder="Ví dụ: Gió Mộc Coffee, Lumina Decor..."
                        className="w-full px-4 py-3.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:border-amber-400"
                      />
                      {errors.brand_name && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.brand_name}
                        </p>
                      )}
                      {formData.brand_name.trim().length > 0 && (
                        <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
                          <span className="text-xs text-stone-400">Xem trước kiểu chữ:</span>
                          <span className="text-lg font-serif font-bold tracking-widest text-amber-300">
                            {formData.brand_name.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-stone-200">
                          Slogan / Khẩu hiệu (Không bắt buộc)
                        </label>
                        <span className="text-xs text-amber-400/90 italic">
                          AI sẽ sáng tạo gợi ý nếu để trống
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.slogan}
                        onChange={(e) => updateFormData({ slogan: e.target.value })}
                        placeholder="Ví dụ: Đậm đà từng khoảnh khắc (hoặc để trống để AI sáng tạo)"
                        className="w-full px-4 py-3.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-stone-200">
                        Ngành hàng hoạt động <span className="text-amber-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {INDUSTRY_OPTIONS.map((item) => {
                          const isSel = formData.industry === item.id;
                          const IconComp = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateFormData({ industry: item.id })}
                              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                isSel
                                  ? "bg-amber-500/10 border-amber-400 text-amber-200"
                                  : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <IconComp className="w-4 h-4 text-amber-400" />
                                {isSel && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-200">
                        Khách hàng mục tiêu (Mô tả ngắn)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.target_audience}
                        onChange={(e) => updateFormData({ target_audience: e.target.value })}
                        placeholder="Mô tả ngắn về độ tuổi, sở thích hoặc thói quen của tệp khách hàng chính..."
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* ----------------- BƯỚC 2 ----------------- */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="border-b border-stone-800 pb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Bước 02 / 05</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                        Chọn Định Dạng Logo Mong Muốn
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {LOGO_FORMAT_OPTIONS.map((opt) => {
                        const isSel = formData.logo_format === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => updateFormData({ logo_format: opt.id })}
                            className={`relative rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                              isSel
                                ? "bg-stone-900 border-amber-400 ring-2 ring-amber-400/20"
                                : "bg-stone-950 border-stone-800 hover:border-stone-700"
                            }`}
                          >
                            {opt.isRecommended && (
                              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold">
                                KHUYÊN DÙNG
                              </div>
                            )}

                            <div>
                              <div className="text-[11px] font-mono uppercase text-amber-400 mb-1">
                                {opt.subLabel}
                              </div>
                              <h3 className="text-lg font-serif font-bold text-stone-100">
                                {opt.label}
                              </h3>
                            </div>

                            <div className="h-24 my-4 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-center p-3">
                              {opt.id === "Wordmark" && (
                                <div className="text-xl font-serif font-black tracking-[0.25em] text-amber-300">
                                  {formData.brand_name || "LUMINA"}
                                </div>
                              )}
                              {opt.id === "Icon / Symbol" && (
                                <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 font-serif font-black text-xl">
                                  ✦
                                </div>
                              )}
                              {opt.id === "Combination Mark" && (
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full border border-amber-400 flex items-center justify-center text-amber-300 text-xs mb-1">
                                    ✦
                                  </div>
                                  <div className="text-xs font-serif font-bold tracking-widest text-stone-200">
                                    {formData.brand_name || "LUMINA"}
                                  </div>
                                </div>
                              )}
                              {opt.id === "Mascot / Illustrative" && (
                                <div className="text-2xl text-amber-300">
                                  🦁
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-stone-850 text-xs text-stone-400 space-y-1">
                              <p className="text-stone-300">{opt.description}</p>
                              <p className="text-[11px] text-stone-500 italic">{opt.examples}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ----------------- BƯỚC 3 ----------------- */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="border-b border-stone-800 pb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-2">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Bước 03 / 05</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                        Chọn Tông Màu Chủ Đạo Thương Hiệu
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {COLOR_SWATCH_OPTIONS.map((sw) => {
                        const isSel = formData.color_tone === sw.id;
                        return (
                          <div
                            key={sw.id}
                            onClick={() => updateFormData({ color_tone: sw.id })}
                            className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                              isSel
                                ? "bg-stone-900 border-amber-400 ring-2 ring-amber-400/20"
                                : "bg-stone-950 border-stone-800 hover:border-stone-700"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-[10px] font-mono uppercase text-amber-400">
                                  {sw.subtitle}
                                </div>
                                <h3 className="text-base font-serif font-bold text-stone-100">
                                  {sw.name}
                                </h3>
                              </div>
                              {isSel && (
                                <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <div className="p-3 my-2 rounded-xl bg-stone-950 border border-stone-850">
                              {sw.isAiRecommended ? (
                                <div className="h-8 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 flex items-center justify-center text-xs font-semibold text-white">
                                  ✨ AI Color Engine
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  {sw.colors.map((c, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 h-7 rounded border border-white/10"
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-stone-400 mt-2 font-light">
                              {sw.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ----------------- BƯỚC 4 ----------------- */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="border-b border-stone-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-2">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Bước 04 / 05</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                          Phong Cách &amp; Cảm Xúc (Chọn tối đa 3)
                        </h2>
                      </div>
                      <div className="px-3.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-amber-300">
                        Đã chọn: {formData.style_vibes.length} / 3
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {STYLE_VIBE_OPTIONS.map((vibe) => {
                        const isSel = formData.style_vibes.includes(vibe.id);
                        const isMax = formData.style_vibes.length >= 3 && !isSel;
                        const IconComp = vibe.icon;

                        return (
                          <div
                            key={vibe.id}
                            onClick={() => {
                              if (isSel) {
                                updateFormData({
                                  style_vibes: formData.style_vibes.filter((v) => v !== vibe.id),
                                });
                              } else if (!isMax) {
                                updateFormData({
                                  style_vibes: [...formData.style_vibes, vibe.id],
                                });
                              }
                            }}
                            className={`p-5 rounded-2xl border transition-all ${
                              isSel
                                ? "bg-stone-900 border-amber-400 text-stone-100 cursor-pointer"
                                : isMax
                                ? "bg-stone-950 opacity-40 border-stone-850 cursor-not-allowed"
                                : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <IconComp className="w-5 h-5 text-amber-400" />
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  isSel
                                    ? "bg-amber-400 border-amber-400 text-stone-950"
                                    : "border-stone-700 bg-stone-950"
                                }`}
                              >
                                {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <div className="font-serif font-bold text-base text-stone-100">
                              {vibe.label}
                            </div>
                            <div className="text-[11px] text-amber-400 font-mono mb-2">
                              {vibe.enLabel}
                            </div>
                            <p className="text-xs text-stone-400 font-light">{vibe.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ----------------- BƯỚC 5 ----------------- */}
                {currentStep === 5 && (
                  <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                    <div className="border-b border-stone-800 pb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-2">
                        <SendHorizontal className="w-3.5 h-3.5" />
                        <span>Bước 05 / 05</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                        Thông Tin Liên Hệ Bàn Giao Sản Phẩm
                      </h2>
                    </div>

                    {/* Brief Summary Box */}
                    <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-2">
                      <div className="text-amber-400 font-semibold uppercase tracking-wider">
                        Tóm tắt hồ sơ thương hiệu:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-300">
                        <div>Tên: <strong className="text-white">{formData.brand_name}</strong></div>
                        <div>Ngành: <strong className="text-white">{formData.industry}</strong></div>
                        <div>Logo: <strong className="text-white">{formData.logo_format}</strong></div>
                        <div>Phong cách: <strong className="text-amber-300">{formData.style_vibes.join(", ")}</strong></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-200 mb-1">
                          Họ và tên khách hàng <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.client_name}
                          onChange={(e) => updateFormData({ client_name: e.target.value })}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                        />
                        {errors.client_name && (
                          <p className="text-xs text-red-400 mt-1">{errors.client_name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-200 mb-1">
                            Số điện thoại / Zalo <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.client_phone}
                            onChange={(e) => updateFormData({ client_phone: e.target.value })}
                            placeholder="Ví dụ: 0901234567"
                            className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                          />
                          {errors.client_phone && (
                            <p className="text-xs text-red-400 mt-1">{errors.client_phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-stone-200 mb-1">
                            Email nhận trọn bộ file SVG, PNG, PDF <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.client_email}
                            onChange={(e) => updateFormData({ client_email: e.target.value })}
                            placeholder="Ví dụ: vana@gmail.com"
                            className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                          />
                          {errors.client_email && (
                            <p className="text-xs text-red-400 mt-1">{errors.client_email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cam kết */}
                    <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 text-stone-300 text-xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Tiến độ: <strong className="text-amber-300">{formData.order_config.delivery_time === "24h" ? "24 Giờ Hỏa Tốc" : "3 Ngày Tiêu Chuẩn"}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Bảo mật 100% bản quyền</span>
                      </div>
                    </div>

                    {/* =================================================================
                        CẤU HÌNH GÓI DỊCH VỤ & BÁO GIÁ THỜI GIAN THỰC
                    ================================================================= */}
                    <div className="space-y-6 pt-6 border-t border-stone-800">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100">
                            Cấu Hình Gói Dịch Vụ &amp; Báo Giá Thời Gian Thực
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-amber-400">
                          {getPackageName(formData.order_config.delivery_time, formData.order_config.logo_options_count, formData.order_config.revision_rounds)}
                        </span>
                      </div>

                      {/* Hàng 1: Thời gian hoàn thành */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                          1. Thời gian hoàn thành (Delivery Time) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const nextQuote = calculateQuote("24h", 1, formData.order_config.revision_rounds);
                              updateFormData({
                                order_config: {
                                  ...formData.order_config,
                                  delivery_time: "24h",
                                  logo_options_count: 1, // Tự động khóa 1 mẫu
                                  quote_price: nextQuote,
                                },
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              formData.order_config.delivery_time === "24h"
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold flex items-center gap-2">
                                <span>⚡ 24 Giờ</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-sans uppercase">
                                  Hỏa tốc hoàn thiện
                                </span>
                              </div>
                              <div className="text-xs text-stone-400 mt-0.5">Tiến độ hỏa tốc trong 24 giờ</div>
                            </div>
                            {formData.order_config.delivery_time === "24h" && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextQuote = calculateQuote("3d", formData.order_config.logo_options_count, formData.order_config.revision_rounds);
                              updateFormData({
                                order_config: {
                                  ...formData.order_config,
                                  delivery_time: "3d",
                                  quote_price: nextQuote,
                                },
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              formData.order_config.delivery_time === "3d"
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold flex items-center gap-2">
                                <span>⏳ 3 Ngày</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-sans uppercase">
                                  Tiến độ tiêu chuẩn
                                </span>
                              </div>
                              <div className="text-xs text-stone-400 mt-0.5">Linh hoạt chọn 1 hoặc 3 options</div>
                            </div>
                            {formData.order_config.delivery_time === "3d" && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Hàng 2: Số option logo đợt 1 */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                            2. Số option logo đợt 1 (Logo Concepts) *
                          </label>
                          {formData.order_config.delivery_time === "24h" && (
                            <span className="text-xs text-amber-300/80 font-mono">
                              🔒 Khóa 1 mẫu cho gói hỏa tốc
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const nextQuote = calculateQuote(formData.order_config.delivery_time, 1, formData.order_config.revision_rounds);
                              updateFormData({
                                order_config: {
                                  ...formData.order_config,
                                  logo_options_count: 1,
                                  quote_price: nextQuote,
                                },
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              formData.order_config.logo_options_count === 1
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold">1 Phương Án Chuyên Sâu</div>
                              <div className="text-xs text-stone-400 mt-0.5">Giám đốc Sáng tạo tinh chọn concept sắc bén nhất</div>
                            </div>
                            {formData.order_config.logo_options_count === 1 && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={formData.order_config.delivery_time === "24h"}
                            onClick={() => {
                              if (formData.order_config.delivery_time !== "24h") {
                                const nextQuote = calculateQuote("3d", 3, formData.order_config.revision_rounds);
                                updateFormData({
                                  order_config: {
                                    ...formData.order_config,
                                    logo_options_count: 3,
                                    quote_price: nextQuote,
                                  },
                                });
                              }
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              formData.order_config.delivery_time === "24h"
                                ? "bg-stone-950 opacity-40 border-stone-900 cursor-not-allowed text-stone-600"
                                : formData.order_config.logo_options_count === 3
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40 cursor-pointer"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 cursor-pointer"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold flex items-center gap-2">
                                <span>3 Phương Án Đa Dạng</span>
                                {formData.order_config.delivery_time !== "24h" && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 uppercase">
                                    Đa dạng
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-400 mt-0.5">3 hướng thị giác khác biệt để lựa chọn</div>
                            </div>
                            {formData.order_config.logo_options_count === 3 && formData.order_config.delivery_time !== "24h" && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>
                        </div>

                        {formData.order_config.delivery_time === "24h" && (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>
                              <strong>Ghi chú:</strong> Gói hỏa tốc 24h tập trung chuyên sâu vào 1 concept xuất sắc nhất để đảm bảo tiến độ và chất lượng.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hàng 3: Số lần duyệt & chỉnh sửa */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                          3. Số lần duyệt &amp; chỉnh sửa (Revision Rounds) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const nextQuote = calculateQuote(formData.order_config.delivery_time, formData.order_config.logo_options_count, 1);
                              updateFormData({
                                order_config: {
                                  ...formData.order_config,
                                  revision_rounds: 1,
                                  quote_price: nextQuote,
                                },
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              formData.order_config.revision_rounds === 1
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold">1 Lần Chỉnh Sửa</div>
                              <div className="text-xs text-stone-400 mt-0.5">Tiết kiệm, dành cho định hướng đã rõ</div>
                            </div>
                            {formData.order_config.revision_rounds === 1 && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextQuote = calculateQuote(formData.order_config.delivery_time, formData.order_config.logo_options_count, 2);
                              updateFormData({
                                order_config: {
                                  ...formData.order_config,
                                  revision_rounds: 2,
                                  quote_price: nextQuote,
                                },
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              formData.order_config.revision_rounds === 2
                                ? "bg-amber-500/10 border-amber-400 text-stone-100 ring-1 ring-amber-400/40"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-serif font-bold flex items-center gap-2">
                                <span>2 Lần Chỉnh Sửa Bảo Hành</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                                  Chuẩn
                                </span>
                              </div>
                              <div className="text-xs text-stone-400 mt-0.5">Chỉnh sửa hoàn thiện tỉ mỉ nhất</div>
                            </div>
                            {formData.order_config.revision_rounds === 2 && (
                              <Check className="w-4 h-4 text-amber-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 4. KHUNG BÁO GIÁ & TỔNG KẾT ĐƠN HÀNG (LIVE QUOTATION BOX) */}
                      <div className="rounded-2xl bg-gradient-to-b from-stone-900 to-amber-950/20 border-2 border-amber-400/80 p-5 sm:p-6 space-y-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-3">
                          <span className="text-xs uppercase tracking-wider font-semibold text-stone-300">
                            Chi tiết gói:{" "}
                            <strong className="text-amber-300">
                              [{formData.order_config.delivery_time === "24h" ? "24h Hỏa tốc" : "3 Ngày Tiêu chuẩn"}] • [{formData.order_config.logo_options_count} Logo] • [{formData.order_config.revision_rounds} Lần duyệt]
                            </strong>
                          </span>
                          <span className="text-xs font-mono text-stone-400">
                            Bàn giao: [SVG + PNG + PDF]
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <p className="text-xs text-stone-300 max-w-sm font-light">
                            Bao gồm: Trọn bộ file bàn giao [SVG Vector gốc + PNG không nền + PDF Brand Guidelines] có sự tinh chỉnh của Giám đốc Sáng tạo.
                          </p>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">
                              TỔNG CHI PHÍ BÁO GIÁ
                            </span>
                            <span className="text-2xl sm:text-3xl font-serif font-black text-amber-300">
                              {formData.order_config.quote_price.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        </div>

                        {/* Nút gửi đơn theo đặc tả */}
                        <div className="pt-2">
                          {(() => {
                            const isContactValid = Boolean(
                              formData.client_name?.trim() &&
                              formData.client_phone?.trim() &&
                              formData.client_phone?.trim().length >= 8 &&
                              formData.client_email?.trim() &&
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email.trim())
                            );

                            return (
                              <>
                                <button
                                  type="submit"
                                  disabled={!isContactValid}
                                  className={`w-full py-4 rounded-xl font-bold text-base uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 ${
                                    isContactValid
                                      ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-amber-500/30 hover:scale-[1.01] cursor-pointer"
                                      : "bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed opacity-60 shadow-none"
                                  }`}
                                >
                                  <FileCheck2 className="w-5 h-5" />
                                  <span>
                                    ĐỒNG Ý BÁO GIÁ {formData.order_config.quote_price.toLocaleString("vi-VN")} VNĐ &amp; GỬI BRIEF THIẾT KẾ
                                  </span>
                                </button>
                                {!isContactValid && (
                                  <p className="text-xs text-amber-400/80 text-center mt-2 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Vui lòng điền đầy đủ Họ tên, SĐT/Zalo và Email ở trên để kích hoạt gửi đơn.</span>
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Navigation Back / Next for Steps 1 - 4 */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between pt-6 border-t border-stone-800">
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={handleBack}
                    className={`px-5 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${
                      currentStep === 1
                        ? "opacity-30 border-transparent text-stone-600 cursor-not-allowed"
                        : "border-stone-800 bg-stone-950 text-stone-300 hover:text-white"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-10 text-stone-400 text-xs text-center">
        <p>&copy; {new Date().getFullYear()} LUMINA BRAND LAB. Thiết kế nhận diện thương hiệu chuẩn mực.</p>
      </footer>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: INLINE PROCESSING SCREEN (3 GIÂY)
// =============================================================================

function ProcessingScreenInline({
  formData,
  onFinish,
}: {
  formData: BriefFormData;
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(15);
  const [message, setMessage] = useState("Hệ thống AI đang phân tích dữ liệu ngành hàng...");

  useEffect(() => {
    const pTimer = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 100 : prev + 3));
    }, 60);

    const msgTimer1 = setTimeout(() => {
      setMessage("Hệ thống AI đang phân tích dữ liệu ngành hàng... Đang phác thảo vector logo...");
    }, 1200);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3100);

    return () => {
      clearInterval(pTimer);
      clearTimeout(msgTimer1);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="py-16 text-center max-w-lg mx-auto space-y-6">
      <div className="relative w-20 h-20 mx-auto">
        <div className="w-20 h-20 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono uppercase text-amber-400">
          LUMINA AI PIPELINE
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-100">
          Đang Phác Thảo Bản Sắc Cho &ldquo;{formData.brand_name}&rdquo;
        </h3>
        <p className="text-sm text-stone-300 font-medium min-h-[40px] px-4">
          {message}
        </p>
      </div>

      <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs font-mono text-stone-400">
        Khởi tạo Vector SVG &amp; Cẩm nang màu sắc... {progress}%
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: INLINE SUCCESS SCREEN & JSON SCHEMA VIEWER
// =============================================================================

function SuccessScreenInline({
  payload,
  onReset,
}: {
  payload: BriefPayload;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-20 h-20 rounded-full bg-stone-950 border-2 border-amber-400/80 mx-auto flex items-center justify-center shadow-2xl">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Yêu cầu của bạn đã được chuyển đến Bàn làm việc của Giám đốc Sáng tạo!
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-light">
          Hệ thống AI đã khởi tạo bản phác thảo thô. Đội ngũ chuyên gia của Lumina đang tiến hành tinh chỉnh thẩm mỹ, màu sắc và chuẩn bị trọn bộ file (SVG, PNG, PDF) cho{" "}
          <strong className="text-amber-300 font-semibold">{payload.brand_name}</strong>. Bạn sẽ nhận được thông báo qua Zalo/Email sớm nhất!
        </p>
      </div>

      {/* Package Summary Box */}
      <div className="text-left p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <div className="font-semibold text-amber-300 uppercase tracking-wider">
            {getPackageName(payload.order_config?.delivery_time || "24h", payload.order_config?.logo_options_count || 1, payload.order_config?.revision_rounds || 2)}
          </div>
          <div className="text-stone-300 mt-0.5">
            Tiến độ: {payload.order_config?.delivery_time === "24h" ? "24 Giờ Hỏa tốc" : "3 Ngày Tiêu chuẩn"} • {payload.order_config?.logo_options_count} Option Logo • {payload.order_config?.revision_rounds} Lần duyệt
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Báo giá xác nhận</span>
          <span className="text-lg font-serif font-bold text-amber-300">
            {(payload.order_config?.quote_price || 1000000).toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
      </div>

      {/* JSON Output Schema Viewer Section */}
      <div className="text-left rounded-2xl bg-stone-950 border border-stone-800 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-850 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <FileCode2 className="w-4 h-4" />
            <span>SCHEMA DỮ LIỆU ĐẦU RA (PAYLOAD JSON)</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-200 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Đã chép" : "Sao chép JSON"}</span>
          </button>
        </div>
        <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto max-h-60 leading-relaxed">
          {jsonStr}
        </pre>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium text-sm inline-flex items-center gap-2 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Khởi Tạo Brief Mới</span>
      </button>
    </div>
  );
}

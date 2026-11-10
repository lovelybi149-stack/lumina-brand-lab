"use client";

import React, { useEffect } from "react";
import {
  Zap,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  FileCheck2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  DeliveryTimeKey,
  LogoOptionsCount,
  RevisionRounds,
  calculateQuote,
  getPackageName,
} from "../types/brief";

interface DynamicPricingConfiguratorProps {
  deliveryTime: DeliveryTimeKey;
  optionsCount: LogoOptionsCount;
  revisions: RevisionRounds;
  onDeliveryTimeChange: (val: DeliveryTimeKey) => void;
  onOptionsCountChange: (val: LogoOptionsCount) => void;
  onRevisionsChange: (val: RevisionRounds) => void;
  isContactValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const DynamicPricingConfigurator: React.FC<DynamicPricingConfiguratorProps> = ({
  deliveryTime,
  optionsCount,
  revisions,
  onDeliveryTimeChange,
  onOptionsCountChange,
  onRevisionsChange,
  isContactValid,
  isSubmitting,
  onSubmit,
}) => {
  // QUY TẮC RÀNG BUỘC BẮT BUỘC (STRICT UI CONSTRAINT):
  // NẾU khách chọn Thời gian = "24h (Hỏa tốc)":
  // Trường "Số option logo" TỰ ĐỘNG KHÓA VÀ ĐẶT MẶC ĐỊNH LÀ 1 MẪU
  useEffect(() => {
    if (deliveryTime === "24h" && optionsCount !== 1) {
      onOptionsCountChange(1);
    }
  }, [deliveryTime, optionsCount, onOptionsCountChange]);

  // Tính giá thời gian thực
  const quotePrice = calculateQuote(deliveryTime, optionsCount, revisions);
  const formattedPrice = quotePrice.toLocaleString("vi-VN");
  const packageName = getPackageName(deliveryTime, optionsCount, revisions);

  return (
    <div className="space-y-6 pt-6 border-t border-stone-800 animate-fade-in">
      {/* Header Phân Đoạn Báo Giá */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cấu Hình Gói Dịch Vụ &amp; Báo Giá Thời Gian Thực</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
            Tùy Chọn Tiến Độ &amp; Quy Mô Bàn Giao
          </h3>
        </div>
        <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-stone-900 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Bảng Giá Niêm Yết Minh Bạch</span>
        </div>
      </div>

      {/* 3 HÀNG LỰA CHỌN CẤU HÌNH */}
      <div className="space-y-5">
        {/* ===================================================================
            HÀNG 1: THỜI GIAN HOÀN THÀNH
        =================================================================== */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300">
            1. Thời gian hoàn thành <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nút A: 24h Hỏa tốc */}
            <button
              type="button"
              onClick={() => onDeliveryTimeChange("24h")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                deliveryTime === "24h"
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    deliveryTime === "24h"
                      ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30"
                      : "bg-stone-800 text-stone-400 group-hover:text-amber-300"
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-stone-100 flex items-center gap-2">
                    <span>⚡ 24 Giờ</span>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Hỏa tốc hoàn thiện
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-light">
                    Ưu tiên bàn giao siêu tốc trong 24h (chuyên sâu 1 concept)
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  deliveryTime === "24h"
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "border-stone-700 bg-stone-950 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>

            {/* Nút B: 3 Ngày Tiêu chuẩn */}
            <button
              type="button"
              onClick={() => onDeliveryTimeChange("3d")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                deliveryTime === "3d"
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    deliveryTime === "3d"
                      ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30"
                      : "bg-stone-800 text-stone-400 group-hover:text-amber-300"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-stone-100 flex items-center gap-2">
                    <span>⏳ 3 Ngày</span>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      Tiến độ tiêu chuẩn
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-light">
                    Thời gian chuẩn mực, linh hoạt chọn 1 hoặc 3 options
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  deliveryTime === "3d"
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "border-stone-700 bg-stone-950 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>

        {/* ===================================================================
            HÀNG 2: SỐ LƯỢNG PHƯƠNG ÁN LOGO PHÁC THẢO
        =================================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300">
              2. Số lượng phương án logo phác thảo <span className="text-amber-400">*</span>
            </label>
            {deliveryTime === "24h" && (
              <span className="text-xs font-mono text-amber-300/90 flex items-center gap-1">
                🔒 Tối ưu 1 Master Concept cho gói 24h
              </span>
            )}
          </div>

          {deliveryTime === "24h" && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Đặc quyền Gói Hỏa Tốc 24H:</strong> Đội ngũ Giám đốc Sáng tạo và AI tập trung toàn lực tinh tuyển 1 Phương Án Master sắc nét nhất theo tỷ lệ vàng để hoàn thiện và bàn giao thần tốc trong ngày.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nút A: 1 Phương Án Chuyên Sâu */}
            <button
              type="button"
              onClick={() => onOptionsCountChange(1)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                optionsCount === 1
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    optionsCount === 1
                      ? "bg-amber-400 text-stone-950 font-bold"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  <span className="font-serif text-sm font-bold">01</span>
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-stone-100">
                    1 Phương Án Chuyên Sâu
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-light">
                    Giám đốc Sáng tạo tinh lọc concept tối ưu nhất
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  optionsCount === 1
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "border-stone-700 bg-stone-950 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>

            {/* Nút B: 3 Phương Án Đa Dạng (Bị mờ/disable nếu đang chọn 24h) */}
            <div className="relative">
              <button
                type="button"
                disabled={deliveryTime === "24h"}
                onClick={() => deliveryTime !== "24h" && onOptionsCountChange(3)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  deliveryTime === "24h"
                    ? "bg-stone-950/40 border-stone-850 opacity-40 cursor-not-allowed text-stone-600"
                    : optionsCount === 3
                    ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50 cursor-pointer"
                    : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg transition-colors ${
                      deliveryTime === "24h"
                        ? "bg-stone-900 text-stone-600"
                        : optionsCount === 3
                        ? "bg-amber-400 text-stone-950 font-bold"
                        : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-serif font-bold text-stone-100 flex items-center gap-2">
                      <span>3 Phương Án Đa Dạng</span>
                      {deliveryTime !== "24h" && (
                        <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          Khuyên dùng
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 font-light">
                      3 hướng concept thị giác khác biệt để lựa chọn
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    deliveryTime === "24h"
                      ? "border-stone-800 bg-stone-950 text-transparent"
                      : optionsCount === 3
                      ? "bg-amber-400 border-amber-400 text-stone-950"
                      : "border-stone-700 bg-stone-950 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* Nhãn chú thích khi chọn 24h theo đúng yêu cầu đặc tả */}
          {deliveryTime === "24h" && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Ghi chú:</strong> Gói hỏa tốc 24h tập trung chuyên sâu vào 1 concept xuất sắc nhất để đảm bảo tiến độ và chất lượng.
              </span>
            </div>
          )}
        </div>

        {/* ===================================================================
            HÀNG 3: SỐ LẦN CHỈNH SỬA THEO YÊU CẦU
        =================================================================== */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300">
            3. Số lần chỉnh sửa theo yêu cầu <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nút A: 1 Lần Chỉnh Sửa */}
            <button
              type="button"
              onClick={() => onRevisionsChange(1)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                revisions === 1
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    revisions === 1
                      ? "bg-amber-400 text-stone-950 font-bold"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  <span className="font-serif text-sm font-bold">1x</span>
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-stone-100">
                    1 Lần Chỉnh Sửa
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-light">
                    Phù hợp khách hàng có định hướng rõ ràng, tiết kiệm
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  revisions === 1
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "border-stone-700 bg-stone-950 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>

            {/* Nút B: 2 Lần Chỉnh Sửa Bảo Hành */}
            <button
              type="button"
              onClick={() => onRevisionsChange(2)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                revisions === 2
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 text-stone-100 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/50"
                  : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    revisions === 2
                      ? "bg-amber-400 text-stone-950 font-bold"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  <span className="font-serif text-sm font-bold">2x</span>
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-stone-100 flex items-center gap-2">
                    <span>2 Lần Chỉnh Sửa Bảo Hành</span>
                    <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      Chuẩn cam kết
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-light">
                    Hoàn thiện tỉ mỉ từng chi tiết, cam kết hài lòng 100%
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  revisions === 2
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "border-stone-700 bg-stone-950 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. KHUNG BÁO GIÁ & TỔNG KẾT ĐƠN HÀNG (LIVE QUOTATION BOX)
      ===================================================================== */}
      <div className="rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/30 border-2 border-amber-400/70 p-6 sm:p-7 shadow-2xl shadow-amber-950/40 relative overflow-hidden">
        {/* Decorative Golden Ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top row: Badge tên gói & Trạng thái tính toán */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20">
                {packageName}
              </span>
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                Mã bảng giá: LUMINA-PRICING-2026
              </span>
            </div>
            <div className="text-xs text-amber-300/90 font-medium">
              ⚡ Báo giá tự động theo ma trận niêm yết
            </div>
          </div>

          {/* Chi tiết gói & Trọn bộ file bàn giao */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left 7 cols: Chi tiết cấu hình & cam kết file */}
            <div className="md:col-span-7 space-y-3">
              <div className="text-xs text-stone-300 space-y-1">
                <div className="text-stone-400 font-medium uppercase tracking-wider text-[11px]">
                  Cấu hình dịch vụ lựa chọn:
                </div>
                <div className="text-sm font-serif font-bold text-stone-100">
                  Gói dịch vụ:{" "}
                  <span className="text-amber-300">
                    {deliveryTime === "24h" ? "24 Giờ (Hỏa tốc)" : "3 Ngày (Tiêu chuẩn)"}
                  </span>{" "}
                  • <span className="text-stone-200">{optionsCount} Option Logo</span> •{" "}
                  <span className="text-stone-200">{revisions} Lần Duyệt Mẫu</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cam kết bàn giao trọn gói:</span>
                </div>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Bao gồm: Trọn bộ file bàn giao{" "}
                  <strong className="text-white font-medium">
                    [File Vector gốc in ấn vô hạn + File PNG tách nền dùng ngay + Sổ tay thương hiệu PDF]
                  </strong>{" "}
                  do chính Giám đốc Sáng tạo tinh chỉnh và kiểm duyệt thẩm mỹ.
                </p>
              </div>
            </div>

            {/* Right 5 cols: TỔNG CHI PHÍ BÁO GIÁ */}
            <div className="md:col-span-5 text-center md:text-right p-4 sm:p-5 rounded-xl bg-stone-950/80 border border-amber-500/30 shadow-inner flex flex-col justify-center items-center md:items-end">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-mono mb-1">
                TỔNG CHI PHÍ BÁO GIÁ
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-black text-amber-300 tracking-tight flex items-baseline gap-1">
                <span>{formattedPrice}</span>
                <span className="text-base sm:text-lg font-sans font-semibold text-stone-400">
                  VNĐ
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-light mt-1">
                (Đã bao gồm phí Curation &amp; Xuất trọn bộ file)
              </span>
            </div>
          </div>

          {/* NÚT GỬI ĐƠN (CALL TO ACTION) */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => {
                if (isSubmitting) return;
                if (!isContactValid) {
                  e.preventDefault();
                  const section = document.getElementById("contact-inputs-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  const nameInput = document.getElementById("client_name_input") as HTMLInputElement | null;
                  const phoneInput = document.getElementById("client_phone_input") as HTMLInputElement | null;
                  const emailInput = document.getElementById("client_email_input") as HTMLInputElement | null;
                  if (!nameInput?.value.trim()) {
                    nameInput?.focus();
                  } else if (!phoneInput?.value.trim() || phoneInput.value.trim().length < 8) {
                    phoneInput?.focus();
                  } else if (!emailInput?.value.trim() || !emailInput.value.includes("@")) {
                    emailInput?.focus();
                  }
                  return;
                }
                onSubmit(e);
              }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
                isSubmitting
                  ? "bg-stone-800 text-stone-400 opacity-70 cursor-wait"
                  : isContactValid
                  ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  : "bg-amber-500/20 border border-amber-400/50 text-amber-200 hover:bg-amber-500/30 hover:border-amber-400 cursor-pointer"
              }`}
            >
              <FileCheck2 className="w-5 h-5 shrink-0" />
              <span className="truncate">
                {isSubmitting
                  ? "Đang khởi tạo đơn hàng..."
                  : isContactValid
                  ? `ĐỒNG Ý BÁO GIÁ ${formattedPrice} VNĐ & GỬI BRIEF THIẾT KẾ`
                  : `BẤM ĐỂ ĐIỀN THÔNG TIN LIÊN HỆ & GỬI BRIEF`}
              </span>
            </button>

            {/* Thông báo nếu chưa điền đủ liên hệ */}
            {!isContactValid && (
              <p className="text-xs text-amber-300/90 text-center flex items-center justify-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Chạm vào nút trên để chuyển đến phần điền Tên, SĐT &amp; Email nhận hồ sơ logo.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import {
  SendHorizontal,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  BriefFormData,
  DeliveryTimeKey,
  LogoOptionsCount,
  RevisionRounds,
  calculateQuote,
} from "../../types/brief";
import { DynamicPricingConfigurator } from "../DynamicPricingConfigurator";

interface Step5Props {
  formData: BriefFormData;
  updateFormData: (fields: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const Step5Contact: React.FC<Step5Props> = ({
  formData,
  updateFormData,
  errors,
  isSubmitting,
  onSubmit,
}) => {
  // Kiểm tra thông tin liên hệ hợp lệ
  const isContactValid = Boolean(
    formData.client_name?.trim() &&
      formData.client_phone?.trim() &&
      formData.client_phone?.trim().length >= 8 &&
      formData.client_email?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email.trim())
  );

  // Xử lý cập nhật cấu hình đơn hàng & báo giá
  const handleDeliveryTimeChange = (val: DeliveryTimeKey) => {
    const nextOptionsCount: LogoOptionsCount = val === "24h" ? 1 : formData.order_config.logo_options_count;
    const nextQuotePrice = calculateQuote(
      val,
      nextOptionsCount,
      formData.order_config.revision_rounds
    );

    updateFormData({
      order_config: {
        ...formData.order_config,
        delivery_time: val,
        logo_options_count: nextOptionsCount,
        quote_price: nextQuotePrice,
      },
    });
  };

  const handleOptionsCountChange = (val: LogoOptionsCount) => {
    const nextQuotePrice = calculateQuote(
      formData.order_config.delivery_time,
      val,
      formData.order_config.revision_rounds
    );

    updateFormData({
      order_config: {
        ...formData.order_config,
        logo_options_count: val,
        quote_price: nextQuotePrice,
      },
    });
  };

  const handleRevisionsChange = (val: RevisionRounds) => {
    const nextQuotePrice = calculateQuote(
      formData.order_config.delivery_time,
      formData.order_config.logo_options_count,
      val
    );

    updateFormData({
      order_config: {
        ...formData.order_config,
        revision_rounds: val,
        quote_price: nextQuotePrice,
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="text-center sm:text-left border-b border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <SendHorizontal className="w-3.5 h-3.5" />
          <span>Bước 05 / 05</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Thông Tin Liên Hệ &amp; Bàn Giao Sản Phẩm
        </h2>
        <p className="text-sm text-stone-400 mt-1">
          Điền thông tin nhận diện và cấu hình gói dịch vụ phù hợp để đội ngũ Giám đốc Sáng tạo khởi tạo hồ sơ hoàn chỉnh.
        </p>
      </div>

      {/* Brief Summary Box */}
      <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Tóm Tắt Brief Đã Khởi Tạo</span>
          </div>
          <span className="text-xs text-stone-400 font-mono">LUMINA SMART BRIEF</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <span className="text-stone-400 block">Thương hiệu:</span>
            <span className="text-stone-100 font-serif font-bold text-sm">
              {formData.brand_name || "Chưa nhập"}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block">Ngành hàng:</span>
            <span className="text-stone-200 font-medium">{formData.industry || "Chưa chọn"}</span>
          </div>
          <div>
            <span className="text-stone-400 block">Định dạng Logo:</span>
            <span className="text-stone-200 font-medium">{formData.logo_format}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-stone-400 block">Tông màu chủ đạo:</span>
            <span className="text-stone-200 font-medium truncate block">
              {formData.color_tone}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block">Phong cách:</span>
            <span className="text-amber-300 font-medium">
              {formData.style_vibes.length > 0
                ? formData.style_vibes.join(", ")
                : "Chưa chọn"}
            </span>
          </div>
        </div>
      </div>

      {/* Input Fields: THÔNG TIN KHÁCH HÀNG */}
      <div id="contact-inputs-section" className="space-y-5 scroll-mt-24">
        <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <span>Thông Tin Người Nhận Bàn Giao</span>
          <span className="text-xs font-normal text-amber-400/90">(Bắt buộc để cấp mã dự án & bàn giao file)</span>
        </div>

        {/* Field 1: Họ và tên */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-200">
            Họ và tên khách hàng <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <input
              id="client_name_input"
              type="text"
              value={formData.client_name}
              onChange={(e) => updateFormData({ client_name: e.target.value })}
              placeholder="Ví dụ: Nguyễn Văn A"
              className={`w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-900/90 border text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:ring-2 transition-all ${
                errors.client_name
                  ? "border-red-500/80 focus:ring-red-500/30"
                  : "border-stone-800 focus:border-amber-400 focus:ring-amber-400/20"
              }`}
            />
            <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.client_name && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.client_name}
            </p>
          )}
        </div>

        {/* Grid: SĐT/Zalo & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Field 2: Số điện thoại / Zalo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-200">
              Số điện thoại / Zalo <span className="text-amber-400">*</span>
              <span className="text-xs text-stone-400 font-normal ml-1">
                (Gửi thông báo tiến độ &amp; duyệt mẫu)
              </span>
            </label>
            <div className="relative">
              <input
                id="client_phone_input"
                type="tel"
                value={formData.client_phone}
                onChange={(e) => updateFormData({ client_phone: e.target.value })}
                placeholder="Ví dụ: 0901234567"
                className={`w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-900/90 border text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.client_phone
                    ? "border-red-500/80 focus:ring-red-500/30"
                    : "border-stone-800 focus:border-amber-400 focus:ring-amber-400/20"
                }`}
              />
              <Phone className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.client_phone && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.client_phone}
              </p>
            )}
          </div>

          {/* Field 3: Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-200">
              Email nhận trọn bộ file SVG, PNG, PDF <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                id="client_email_input"
                type="email"
                value={formData.client_email}
                onChange={(e) => updateFormData({ client_email: e.target.value })}
                placeholder="Ví dụ: vana@gmail.com"
                className={`w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-900/90 border text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.client_email
                    ? "border-red-500/80 focus:ring-red-500/30"
                    : "border-stone-800 focus:border-amber-400 focus:ring-amber-400/20"
                }`}
              />
              <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.client_email && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.client_email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cam Kết Tiêu Chuẩn */}
      <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/80 text-stone-300 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Tiến độ hoàn thiện:{" "}
            <strong className="text-amber-300">
              {formData.order_config.delivery_time === "24h" ? "24 Giờ Hỏa Tốc" : "3 Ngày Tiêu Chuẩn"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Bảo mật 100% bản quyền</span>
        </div>
      </div>

      {/* =====================================================================
          PHÂN ĐOẠN NÂNG CẤP: BỘ TÍNH BÁO GIÁ ĐỘNG & CẤU HÌNH ĐƠN HÀNG
      ===================================================================== */}
      <DynamicPricingConfigurator
        deliveryTime={formData.order_config.delivery_time}
        optionsCount={formData.order_config.logo_options_count}
        revisions={formData.order_config.revision_rounds}
        onDeliveryTimeChange={handleDeliveryTimeChange}
        onOptionsCountChange={handleOptionsCountChange}
        onRevisionsChange={handleRevisionsChange}
        isContactValid={isContactValid}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </form>
  );
};

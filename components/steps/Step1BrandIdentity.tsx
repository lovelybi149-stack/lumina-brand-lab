"use client";

import React from "react";
import {
  Building2,
  Sparkles,
  Quote,
  Target,
  Utensils,
  Shirt,
  Cpu,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { BriefFormData } from "../../types/brief";
import { INDUSTRY_OPTIONS } from "../../types/constants";

interface Step1Props {
  formData: BriefFormData;
  updateFormData: (fields: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

// Map industry icon string to Lucide Icon component
const getIndustryIcon = (iconName: string) => {
  switch (iconName) {
    case "Utensils":
      return Utensils;
    case "Shirt":
      return Shirt;
    case "Sparkles":
      return Sparkles;
    case "Cpu":
      return Cpu;
    case "Briefcase":
      return Briefcase;
    case "Building2":
      return Building2;
    default:
      return Lightbulb;
  }
};

export const Step1BrandIdentity: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const currentIndustryConfig = INDUSTRY_OPTIONS.find(
    (item) => item.id === formData.industry
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="text-center sm:text-left border-b border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Bước 01 / 05</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Định Danh &amp; Cốt Lõi Thương Hiệu
        </h2>
        <p className="text-sm text-stone-400 mt-1">
          Cung cấp tên thương hiệu, định vị ngành nghề và mô tả tệp khách hàng tiềm năng mà bạn hướng tới.
        </p>
      </div>

      {/* Field 1: Tên thương hiệu (Bắt buộc) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-200">
          Tên thương hiệu <span className="text-amber-400">*</span>
          <span className="text-xs text-stone-400 font-normal ml-2">
            (Chính xác tên sẽ xuất hiện trên Logo)
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.brand_name}
            onChange={(e) => updateFormData({ brand_name: e.target.value })}
            placeholder="Ví dụ: Gió Mộc Coffee, Lumina Decor..."
            className={`w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-900/90 border text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:ring-2 transition-all ${
              errors.brand_name
                ? "border-red-500/80 focus:ring-red-500/30"
                : "border-stone-800 focus:border-amber-400 focus:ring-amber-400/20"
            }`}
          />
          <Building2 className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {formData.brand_name.trim().length > 0 && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
        </div>
        {errors.brand_name && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.brand_name}
          </p>
        )}

        {/* Live Typography Preview Badge if user typed something */}
        {formData.brand_name.trim().length > 0 && (
          <div className="mt-3 p-3.5 rounded-lg bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem trước kiểu chữ thương hiệu:</span>
            </div>
            <div className="text-lg font-serif font-bold tracking-widest text-amber-300">
              {formData.brand_name.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Field 2: Slogan / Khẩu hiệu (Không bắt buộc) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-stone-200">
            Slogan / Khẩu hiệu
            <span className="text-xs text-stone-400 font-normal ml-2">
              (Không bắt buộc)
            </span>
          </label>
          <span className="text-xs text-amber-400/90 italic">
            AI sẽ sáng tạo gợi ý nếu để trống
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.slogan}
            onChange={(e) => updateFormData({ slogan: e.target.value })}
            placeholder="Ví dụ: Đậm đà từng khoảnh khắc (hoặc để trống để AI sáng tạo)"
            className="w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
          <Quote className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Quick chip for non-tech users */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => updateFormData({ slogan: "Chưa có slogan (AI sáng tạo)" })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-300 text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chưa có Slogan — Nhờ Giám đốc Sáng tạo &amp; AI gợi ý</span>
          </button>
        </div>
      </div>

      {/* Field 3: Ngành hàng hoạt động (Dropdown / Radio Grid) */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-200">
          Ngành hàng hoạt động <span className="text-amber-400">*</span>
          <span className="text-xs text-stone-400 font-normal ml-2">
            (Bấm chọn 1 lĩnh vực tương ứng)
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {INDUSTRY_OPTIONS.map((item) => {
            const isSelected = formData.industry === item.id;
            const Icon = getIndustryIcon(item.iconName);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateFormData({ industry: item.id })}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-400 text-amber-200 shadow-md shadow-amber-950/20"
                    : "bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-stone-800 text-stone-400 group-hover:text-stone-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.industry && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.industry}
          </p>
        )}
      </div>

      {/* Field 4: Khách hàng mục tiêu (Textarea ngắn) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-stone-200">
            Khách hàng mục tiêu
            <span className="text-xs text-stone-400 font-normal ml-2">
              (Chân dung tệp khách hàng chính)
            </span>
          </label>
        </div>
        <div className="relative">
          <textarea
            rows={3}
            value={formData.target_audience}
            onChange={(e) => updateFormData({ target_audience: e.target.value })}
            placeholder={
              currentIndustryConfig?.placeholderAudience ||
              "Mô tả ngắn về độ tuổi, sở thích hoặc thói quen của tệp khách hàng chính..."
            }
            className="w-full px-4 py-3 pl-11 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
          />
          <Target className="w-5 h-5 text-stone-400 absolute left-3.5 top-4 pointer-events-none" />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Gợi ý: Độ tuổi, giới tính, sở thích, phân khúc thu nhập</span>
          <span>{formData.target_audience.length} ký tự</span>
        </div>

        {/* Quick Audience Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block mb-2">
            Gợi ý nhanh 1 chạm (Bấm để điền mẫu):
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "Giới trẻ & Gen Z năng động, yêu thích sự phá cách và xu hướng mới",
              "Khách công sở, gia đình hiện đại chuộng sản phẩm tiện ích & thẩm mỹ tinh tế",
              "Phân khúc Trung & Thượng lưu, tìm kiếm trải nghiệm độc bản, sang trọng và chuẩn mực",
            ].map((chipText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateFormData({ target_audience: chipText })}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{chipText}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

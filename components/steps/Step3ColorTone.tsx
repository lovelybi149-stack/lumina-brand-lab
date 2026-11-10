"use client";

import React from "react";
import { Palette, Check, Sparkles } from "lucide-react";
import { BriefFormData } from "../../types/brief";
import { COLOR_SWATCH_OPTIONS } from "../../types/constants";

interface Step3Props {
  formData: BriefFormData;
  updateFormData: (fields: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

// Helper xác định bảng màu phù hợp với ngành hàng đã chọn ở Bước 1
const getIndustryMatchBadge = (swatchId: string, industry: string): string | null => {
  if (!industry) return null;
  if (industry.includes("F&B") && (swatchId.includes("Earth") || swatchId.includes("Warm"))) {
    return "Gợi ý cho F&B";
  }
  if (industry.includes("Thời trang") && (swatchId.includes("Luxury") || swatchId.includes("Pastel"))) {
    return "Gợi ý cho Thời trang";
  }
  if (industry.includes("Công nghệ") && swatchId.includes("Cool")) {
    return "Gợi ý cho Công nghệ";
  }
  if (industry.includes("Mỹ phẩm") && (swatchId.includes("Pastel") || swatchId.includes("Earth"))) {
    return "Gợi ý cho Mỹ phẩm";
  }
  if (industry.includes("Bất động sản") && (swatchId.includes("Luxury") || swatchId.includes("Earth"))) {
    return "Gợi ý cho Bất động sản";
  }
  if (industry.includes("Dịch vụ") && (swatchId.includes("Luxury") || swatchId.includes("Cool"))) {
    return "Gợi ý cho Dịch vụ";
  }
  return null;
};

export const Step3ColorTone: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="text-center sm:text-left border-b border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Palette className="w-3.5 h-3.5" />
          <span>Bước 03 / 05</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Chọn Tông Màu Chủ Đạo Thương Hiệu
        </h2>
        <p className="text-sm text-stone-400 mt-1">
          Màu sắc quyết định 85% ấn tượng đầu tiên của khách hàng. Chọn bảng màu định hướng hoặc để AI tự do tối ưu hóa.
        </p>
      </div>

      {/* Grid 6 Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {COLOR_SWATCH_OPTIONS.map((swatch) => {
          const isSelected = formData.color_tone === swatch.id;
          const industryBadge = getIndustryMatchBadge(swatch.id, formData.industry);

          return (
            <div
              key={swatch.id}
              onClick={() => updateFormData({ color_tone: swatch.id })}
              className={`relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-stone-900 to-amber-950/20 border-amber-400 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/30"
                  : "bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-850"
              }`}
            >
              {/* Industry Match Badge or AI Recommended Badge */}
              {industryBadge ? (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{industryBadge}</span>
                </div>
              ) : swatch.isAiRecommended ? (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md shadow-purple-500/30">
                  <Sparkles className="w-3 h-3" />
                  <span>KHUYÊN DÙNG</span>
                </div>
              ) : null}

              {/* Top Row: Name and Check */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                    {swatch.subtitle}
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    {swatch.name}
                  </h3>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/40"
                      : "border border-stone-700 bg-stone-950 text-transparent group-hover:border-stone-500"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Color Swatch Circles / Palette Bar */}
              <div className="my-3 p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
                {swatch.isAiRecommended ? (
                  // Dynamic Iridescent Bar for AI Suggestion
                  <div className="space-y-2">
                    <div className="h-9 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 via-pink-500 to-amber-400 shadow-inner flex items-center justify-center text-[11px] font-semibold text-white drop-shadow">
                      ✨ AI Color Harmonizer 60-30-10
                    </div>
                  </div>
                ) : (
                  // 4 Color Swatch circles
                  <div className="flex items-center justify-between gap-2">
                    {swatch.colors.map((hex, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className="w-full h-8 rounded-md border border-white/10 shadow-sm transition-transform duration-200 group-hover:scale-105"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[9px] font-mono text-stone-400 uppercase">
                          {hex}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-400 mt-2 leading-relaxed font-light">
                {swatch.description}
              </p>
            </div>
          );
        })}
      </div>

      {errors.color_tone && (
        <p className="text-xs text-red-400 text-center">{errors.color_tone}</p>
      )}
    </div>
  );
};

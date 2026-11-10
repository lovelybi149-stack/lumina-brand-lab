"use client";

import React from "react";
import { Sparkles, Check, Star } from "lucide-react";
import { BriefFormData, LogoFormatKey } from "../../types/brief";
import { LOGO_FORMAT_OPTIONS } from "../../types/constants";

interface Step2Props {
  formData: BriefFormData;
  updateFormData: (fields: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

// Visual Mini Previews for each logo format
const renderLogoPreview = (id: LogoFormatKey, brandName: string) => {
  const displayName = brandName.trim().length > 0 ? brandName.toUpperCase() : "LUMINA";

  switch (id) {
    case "Wordmark":
      return (
        <div className="h-28 w-full rounded-lg bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center p-4 overflow-hidden relative group">
          <div className="text-xl sm:text-2xl font-serif font-black tracking-[0.25em] text-amber-200 transition-transform duration-300 group-hover:scale-105">
            {displayName}
          </div>
          <div className="w-12 h-0.5 bg-amber-500/50 mt-2" />
          <div className="text-[9px] font-sans text-stone-400 tracking-[0.3em] uppercase mt-1">
            HAUTE COUTURE STUDIO
          </div>
        </div>
      );

    case "Icon / Symbol":
      return (
        <div className="h-28 w-full rounded-lg bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center p-4 overflow-hidden relative group">
          <svg
            className="w-14 h-14 text-amber-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            <path
              d="M30 65 L50 25 L70 65 L50 50 Z"
              fill="currentColor"
              fillOpacity="0.85"
            />
            <circle cx="50" cy="35" r="4" fill="#FDE68A" />
          </svg>
        </div>
      );

    case "Combination Mark":
      return (
        <div className="h-28 w-full rounded-lg bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center p-3 overflow-hidden relative group">
          {/* Top emblem */}
          <svg
            className="w-9 h-9 text-amber-400 mb-1 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M20 5 C12 5 6 12 6 20 C6 28 12 35 20 35 C28 35 34 28 34 20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M14 20 C14 15 26 15 26 20 C26 25 14 25 14 30"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {/* Bottom typography */}
          <div className="text-xs font-serif font-bold tracking-[0.2em] text-stone-100 truncate max-w-full">
            {displayName}
          </div>
          <div className="text-[8px] font-sans text-amber-300/80 tracking-widest uppercase">
            EST. 2026
          </div>
        </div>
      );

    case "Mascot / Illustrative":
      return (
        <div className="h-28 w-full rounded-lg bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center p-4 overflow-hidden relative group">
          <svg
            className="w-14 h-14 text-amber-300 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="32" cy="32" r="20" fill="#3D2B1F" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx="26" cy="30" r="2.5" fill="#FDE68A" />
            <circle cx="38" cy="30" r="2.5" fill="#FDE68A" />
            <path d="M26 38 Q32 44 38 38" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 18 Q32 8 44 18" stroke="#D4AF37" strokeWidth="2" fill="none" />
          </svg>
        </div>
      );
  }
};

export const Step2LogoFormat: React.FC<Step2Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="text-center sm:text-left border-b border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bước 02 / 05</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Chọn Định Dạng Logo Mong Muốn
        </h2>
        <p className="text-sm text-stone-400 mt-1">
          Chọn cấu trúc thiết kế thị giác phù hợp nhất với bản sắc và định hướng phát triển của thương hiệu.
        </p>
      </div>

      {/* Grid 4 Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {LOGO_FORMAT_OPTIONS.map((option) => {
          const isSelected = formData.logo_format === option.id;

          return (
            <div
              key={option.id}
              onClick={() => updateFormData({ logo_format: option.id })}
              className={`relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 border-amber-400 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/30"
                  : "bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-850"
              }`}
            >
              {/* Recommended Badge */}
              {option.isRecommended && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md shadow-amber-400/30">
                  <Star className="w-3 h-3 fill-stone-950" />
                  <span>KHUYÊN DÙNG</span>
                </div>
              )}

              {/* Selection Check Circle */}
              <div
                className={`absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-amber-400 text-stone-950"
                    : "border border-stone-700 bg-stone-950 text-transparent group-hover:border-stone-500"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              {/* Card Title & Sub-header */}
              <div className="pt-8 mb-4">
                <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {option.label}
                </h3>
                <div className="text-[11px] uppercase tracking-wider text-amber-400/90 font-mono mt-0.5">
                  Chuẩn thiết kế: {option.subLabel}
                </div>
              </div>

              {/* Visual Preview Box */}
              <div className="my-3">
                {renderLogoPreview(option.id, formData.brand_name)}
              </div>

              {/* Description & Examples */}
              <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  {option.description}
                </p>
                <div className="text-[11px] text-stone-400 italic">
                  {option.examples}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.logo_format && (
        <p className="text-xs text-red-400 text-center">{errors.logo_format}</p>
      )}
    </div>
  );
};

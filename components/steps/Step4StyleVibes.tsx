"use client";

import React from "react";
import { Sliders, Check, AlertCircle, Crown, Feather, History, Zap, Smile, Trees } from "lucide-react";
import { BriefFormData } from "../../types/brief";
import { STYLE_VIBE_OPTIONS } from "../../types/constants";

interface Step4Props {
  formData: BriefFormData;
  updateFormData: (fields: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

const getVibeIcon = (id: string) => {
  switch (id) {
    case "Minimalist":
      return Feather;
    case "Luxury":
      return Crown;
    case "Retro":
      return History;
    case "Modern":
      return Zap;
    case "Playful":
      return Smile;
    case "Rustic":
      return Trees;
    default:
      return Sliders;
  }
};

export const Step4StyleVibes: React.FC<Step4Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const selectedVibes = formData.style_vibes || [];
  const [limitNotice, setLimitNotice] = React.useState<string | null>(null);

  const handleToggleVibe = (id: string) => {
    if (selectedVibes.includes(id)) {
      // Bỏ chọn
      setLimitNotice(null);
      updateFormData({
        style_vibes: selectedVibes.filter((v) => v !== id),
      });
    } else {
      // Chỉ cho phép tối đa 3
      if (selectedVibes.length < 3) {
        setLimitNotice(null);
        updateFormData({
          style_vibes: [...selectedVibes, id],
        });
      } else {
        setLimitNotice("Quý khách đã chọn đủ 3 tính cách nổi bật nhất. Hãy bấm bỏ bớt 1 mục nếu muốn thay đổi nhé!");
        setTimeout(() => setLimitNotice(null), 4000);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="text-center sm:text-left border-b border-stone-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Bước 04 / 05</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Phong Cách &amp; Cảm Xúc Thương Hiệu
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Định hình tính cách thị giác. Hãy tích chọn tối đa 3 tính từ đại diện tốt nhất cho dự án của bạn.
            </p>
          </div>

          {/* Counter Tag */}
          <div
            className={`self-start sm:self-auto px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all ${
              selectedVibes.length === 3
                ? "bg-amber-400 text-stone-950 border-amber-300 shadow-md shadow-amber-400/30"
                : "bg-stone-900 text-stone-300 border-stone-800"
            }`}
          >
            <span>Đã chọn:</span>
            <span className="font-mono text-sm sm:text-base">
              {selectedVibes.length} / 3
            </span>
          </div>
        </div>
      </div>

      {/* Limit Notice Alert */}
      {limitNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fade-in shadow-md">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{limitNotice}</span>
        </div>
      )}

      {/* Grid 6 Vibe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {STYLE_VIBE_OPTIONS.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe.id);
          const isLimitReached = selectedVibes.length >= 3 && !isSelected;
          const Icon = getVibeIcon(vibe.id);

          return (
            <div
              key={vibe.id}
              onClick={() => handleToggleVibe(vibe.id)}
              className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-stone-900 to-amber-950/20 border-amber-400 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/30 cursor-pointer"
                  : isLimitReached
                  ? "bg-stone-950/40 border-stone-850 opacity-40 cursor-not-allowed"
                  : "bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-850 cursor-pointer"
              }`}
            >
              {/* Top Row: Icon & Checkbox */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/40"
                      : "bg-stone-800 text-stone-300 group-hover:text-amber-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-amber-400 text-stone-950"
                      : "border border-stone-700 bg-stone-950 text-transparent group-hover:border-stone-500"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & En Label */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-1">
                  {vibe.enLabel}
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {vibe.label}
                </h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed font-light">
                  {vibe.description}
                </p>
              </div>

              {/* Bottom selection pill */}
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {isSelected ? "Đang chọn" : "Bấm để chọn"}
                </span>
                {isSelected && (
                  <span className="text-[11px] font-medium text-amber-300">
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Notification */}
      {selectedVibes.length === 3 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Bạn đã chọn đủ 3 phong cách trọng tâm. Nếu muốn đổi phong cách khác, hãy bấm bỏ chọn 1 thẻ trước.
          </span>
        </div>
      )}

      {errors.style_vibes && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 justify-center">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.style_vibes}
        </p>
      )}
    </div>
  );
};

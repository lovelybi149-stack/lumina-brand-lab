"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight, Download, Eye, Palette, Type } from "lucide-react";

export const FeaturedCaseStudy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"logo" | "palette" | "typography">("logo");

  return (
    <section id="featured-preview" className="py-20 border-b border-stone-800/60 bg-stone-950/70 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CASE STUDY ĐIỂN HÌNH</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100">
            Dự Án Mẫu: Gió Mộc Coffee
          </h2>
          <p className="text-sm sm:text-base text-stone-400 mt-2 font-light">
            Sản phẩm được khởi tạo bởi AI và hoàn thiện bởi Giám đốc Sáng tạo trong 24 giờ.
          </p>
        </div>

        {/* Case Study Card */}
        <div className="rounded-3xl bg-stone-900/80 border border-stone-800 p-6 sm:p-10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Vector Logo SVG Preview (500x500 scaled) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-[380px] aspect-square rounded-2xl bg-[#F4EFEA] border-4 border-[#3D2B1F]/20 shadow-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Corner decors */}
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#5B7065]/60" />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#5B7065]/60" />
              <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#5B7065]/60" />
              <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#5B7065]/60" />

              {/* Vector Logo Emblem */}
              <div className="w-40 h-40 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                  {/* Ensō wood grain outer path */}
                  <path
                    d="M 40 70 C 20 110 30 155 70 180 C 110 205 165 195 190 155 C 212 118 200 65 165 35 C 132 10 75 15 45 45"
                    stroke="#3D2B1F"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeDasharray="260 20"
                  />
                  {/* Wind spiral 1 */}
                  <path
                    d="M 30 120 C 45 75 90 40 145 45 C 175 48 185 85 160 115 C 140 140 100 135 85 105 C 75 80 100 62 120 68"
                    stroke="#9E6B55"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  {/* Pine mist wave 2 */}
                  <path
                    d="M 50 155 C 85 175 145 170 175 130 C 195 95 175 55 135 48 C 95 42 65 75 75 115 C 82 142 115 145 132 128"
                    stroke="#5B7065"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Center Coffee Bean Seed */}
                  <path
                    d="M 98 86 C 112 82 118 94 114 108 C 110 120 96 116 92 106 C 89 98 92 89 98 86 Z"
                    fill="#3D2B1F"
                  />
                  <path d="M 98 92 C 104 98 102 106 97 110" stroke="#F4EFEA" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Logo Typography */}
              <div className="text-center mt-3">
                <div className="text-2xl font-serif font-black tracking-[0.2em] text-[#3D2B1F]">
                  GIÓ MỘC
                </div>
                <div className="text-[10px] font-sans font-semibold tracking-[0.35em] text-[#9E6B55] uppercase mt-1">
                  COFFEE &amp; SLOW WORKSPACE
                </div>
                <div className="w-16 h-px bg-[#9E6B55]/50 mx-auto my-1.5" />
                <div className="text-[8px] font-sans font-medium tracking-[0.25em] text-[#5B7065] uppercase">
                  ĐÀ LẠT • THIÊN NHIÊN • TĨNH TẠI
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-400 mt-3 font-mono">
              Định dạng: Biểu tượng kết hợp chữ độc bản (Vector SVG chuẩn in ấn)
            </div>
          </div>

          {/* Right: Brand Story, Color Palette, Typography Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hoàn tất bàn giao trong 18h</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                &ldquo;Chạm chất mộc, lắng tiếng gió reo&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 font-light leading-relaxed">
                Ẩn mình giữa triền đồi thông lộng gió Đà Lạt, Gió Mộc Coffee tôn vinh nét đẹp Wabi-sabi thô mộc kết hợp hồn gỗ Tây Nguyên trầm ấm.
              </p>
            </div>

            {/* Color Palette Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-medium text-stone-300">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bảng Màu Nhận Diện 60-30-10</span>
                </span>
                <span className="font-mono text-[11px]">4 Mã HEX Chuẩn</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                  <div className="w-full h-8 rounded-lg bg-[#3D2B1F] mb-1.5 shadow" />
                  <div className="text-[9px] font-mono text-stone-300">#3D2B1F</div>
                  <div className="text-[8px] text-stone-500 truncate">Vỏ Thông</div>
                </div>

                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                  <div className="w-full h-8 rounded-lg bg-[#9E6B55] mb-1.5 shadow" />
                  <div className="text-[9px] font-mono text-stone-300">#9E6B55</div>
                  <div className="text-[8px] text-stone-500 truncate">Đất Bazan</div>
                </div>

                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                  <div className="w-full h-8 rounded-lg bg-[#F4EFEA] mb-1.5 shadow" />
                  <div className="text-[9px] font-mono text-stone-300">#F4EFEA</div>
                  <div className="text-[8px] text-stone-500 truncate">Giấy Dó</div>
                </div>

                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                  <div className="w-full h-8 rounded-lg bg-[#5B7065] mb-1.5 shadow" />
                  <div className="text-[9px] font-mono text-stone-300">#5B7065</div>
                  <div className="text-[8px] text-stone-500 truncate">Thông Núi</div>
                </div>
              </div>
            </div>

            {/* Typography Pairing */}
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Cặp Font Quốc Tế Tối Ưu Tiếng Việt:</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-amber-300 text-sm">Fraunces</span>
                  <span className="text-stone-500 ml-1.5">(Tiêu đề nghệ thuật)</span>
                </div>
                <div>
                  <span className="font-sans font-semibold text-stone-200">Be Vietnam Pro</span>
                  <span className="text-stone-500 ml-1.5">(Nội dung)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

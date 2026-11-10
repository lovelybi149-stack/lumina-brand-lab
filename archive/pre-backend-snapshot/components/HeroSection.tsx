"use client";

import React from "react";
import { ArrowDown, Sparkles, Clock, ShieldCheck, FileCheck, Layers } from "lucide-react";

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 border-b border-stone-800/60 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl text-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-amber-950/20 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>LUMINA BRAND LAB • THIẾT KẾ NHẬN DIỆN BÁN TỰ ĐỘNG</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-1" />
        </div>

        {/* Big Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15] mb-6">
          LUMINA BRAND LAB
          <span className="block mt-2 font-sans font-light text-2xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 bg-clip-text text-transparent">
            Khởi tạo Bản sắc Thương hiệu Chuẩn mực trong 24 Giờ
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-stone-400 font-light leading-relaxed mb-10">
          Sự kết hợp giữa tốc độ đột phá của <span className="text-stone-200 font-medium">Trí tuệ Nhân tạo</span> và con mắt thẩm mỹ của <span className="text-amber-300 font-medium">Giám đốc Sáng tạo</span>. Bàn giao đầy đủ <span className="text-stone-200 font-semibold">Tệp Vector gốc in ấn vô hạn, Ảnh tách nền &amp; Cẩm nang bản sắc</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartClick}
            type="button"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Bắt đầu Gửi Brief Thiết Kế</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-200" />
          </button>

          <a
            href="#featured-preview"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 hover:bg-stone-800/80 font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <Layers className="w-4 h-4 text-stone-400" />
            <span>Xem Concept Mẫu: Gió Mộc Coffee</span>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-stone-800/60 max-w-4xl mx-auto text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800/40">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200 uppercase tracking-wider">Tốc độ 24h</div>
              <div className="text-xs text-stone-400">Giao proposal chuẩn xác</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800/40">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200 uppercase tracking-wider">Bộ Tệp In Ấn</div>
              <div className="text-xs text-stone-400">Vector gốc &amp; Ảnh trong suốt</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800/40">
            <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200 uppercase tracking-wider">Đội Ngũ Nghệ Thuật</div>
              <div className="text-xs text-stone-400">Giám đốc Sáng tạo tinh tuyển</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800/40">
            <div className="p-2 rounded-md bg-pink-500/10 text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200 uppercase tracking-wider">Sổ Tay Bản Sắc</div>
              <div className="text-xs text-stone-400">Cẩm nang nhận diện thương hiệu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

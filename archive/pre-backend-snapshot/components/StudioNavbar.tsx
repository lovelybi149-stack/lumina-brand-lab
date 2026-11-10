"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const StudioNavbar: React.FC = () => {
  const scrollToForm = () => {
    const el = document.getElementById("smart-brief-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <span className="font-serif font-black text-amber-300 text-lg tracking-tighter">
                L
              </span>
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-stone-100 text-lg tracking-wider">
              LUMINA <span className="font-sans font-light text-amber-400 text-sm">BRAND LAB</span>
            </div>
            <div className="text-[10px] text-stone-400 tracking-widest uppercase">
              XƯỞNG SÁNG TẠO BẢN SẮC THƯƠNG HIỆU
            </div>
          </div>
        </Link>

        {/* Navigation / Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <Link
            href="/review"
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <span>Duyệt Mẫu Thiết Kế</span>
          </Link>

          <Link
            href="/library"
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <span>Kho Mẫu Nhận Diện</span>
          </Link>

          <a
            href="/#featured-preview"
            className="hover:text-amber-300 transition-colors"
          >
            Dự Án Mẫu
          </a>

          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bàn giao 24h</span>
          </div>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/review"
            className="md:hidden px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium"
          >
            Duyệt Mẫu
          </Link>

          <Link
            href="/library"
            className="md:hidden px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium"
          >
            Kho Mẫu
          </Link>

          <button
            type="button"
            onClick={scrollToForm}
            className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Gửi Brief Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

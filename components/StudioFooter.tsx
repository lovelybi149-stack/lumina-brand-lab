"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Lock } from "lucide-react";

export const StudioFooter: React.FC = () => {
  return (
    <footer className="border-t border-stone-800/80 bg-stone-950 py-12 text-stone-400 text-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-850">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif font-bold text-stone-200 text-base">
              LUMINA BRAND LAB
            </div>
            <p className="text-stone-400 font-light max-w-md">
              Xưởng ý tưởng nhận diện thương hiệu bán tự động. Kết hợp tốc độ AI và giám sát thẩm mỹ chuẩn quốc tế của Giám đốc Sáng tạo.
            </p>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Bàn Giao: Bộ Tệp In Ấn Vector, Ảnh Tách Nền &amp; Cẩm Nang Bản Sắc</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Cam kết tiến độ: 24 Giờ</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} LUMINA BRAND LAB. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Khởi tạo bởi Lumina Brand Lab • Tiêu chuẩn thẩm mỹ Giám đốc Sáng tạo</span>
            <span className="text-stone-700">•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-amber-400 transition-colors py-0.5 px-1.5 rounded hover:bg-stone-900 border border-transparent hover:border-stone-800"
              title="Khu vực dành riêng cho Quản trị viên / Giám đốc Sáng tạo"
            >
              <Lock className="w-3 h-3 text-stone-500 hover:text-amber-400" />
              <span>Quản trị</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

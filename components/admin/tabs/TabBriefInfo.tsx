"use client";

import React from "react";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Layers,
  Palette,
  Sparkles,
  Calendar,
  Copy,
  Check
} from "lucide-react";
import { ProjectRecord } from "../../../types/curation";

interface TabBriefInfoProps {
  project: ProjectRecord;
}

export const TabBriefInfo: React.FC<TabBriefInfoProps> = ({ project }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 text-stone-200">
      {/* Brief Header Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-amber-300">
            Dữ liệu Brief Tham Chiếu (Read-Only)
          </div>
          <p className="text-stone-300 leading-relaxed">
            Dưới đây là toàn bộ thông tin nguyên bản do khách hàng cung cấp qua Smart Brief Form. Giám đốc Sáng tạo dùng làm cơ sở tham chiếu để định hình ngôn ngữ thiết kế.
          </p>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
          <User className="w-4 h-4" />
          Thông Tin Người Đại Diện &amp; Liên Hệ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block mb-1">Tên khách hàng:</span>
            <span className="text-stone-100 font-semibold text-sm">
              {project.client_name}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Số điện thoại / Zalo:</span>
            <div className="flex items-center gap-2">
              <span className="text-stone-100 font-mono font-medium">
                {project.client_phone}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(project.client_phone, "phone")}
                className="text-stone-400 hover:text-amber-300 transition-colors p-1"
                title="Copy SĐT"
              >
                {copied === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Email làm việc:</span>
            <div className="flex items-center gap-2">
              <span className="text-stone-100 font-mono text-xs">
                {project.client_email}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(project.client_email, "email")}
                className="text-stone-400 hover:text-amber-300 transition-colors p-1"
                title="Copy Email"
              >
                {copied === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Thời gian gửi Brief:</span>
            <div className="flex items-center gap-1.5 text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{new Date(project.submitted_at).toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Định hướng thương hiệu từ khách */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Định Hướng Ngành Hàng &amp; Thị Trường
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-stone-400 block mb-1">Tên thương hiệu đặt hàng:</span>
            <span className="text-amber-300 font-serif font-bold text-base">
              {project.brand_name}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Ngành hàng hoạt động:</span>
            <span className="text-stone-200 font-medium">
              {project.industry}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block mb-1">Khách hàng mục tiêu (Target Audience):</span>
            <p className="text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
              {project.target_audience}
            </p>
          </div>
        </div>
      </div>

      {/* Sở thích thị giác */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Gu Thẩm Mỹ &amp; Định Dạng Khách Yêu Cầu
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-stone-400 block mb-1.5">Định dạng logo khách thích:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.logo_format}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block mb-1.5">Tone màu khách mong muốn:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>{project.color_tone}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block mb-1.5">Vibe / Tính cách thương hiệu lựa chọn:</span>
            <div className="flex flex-wrap gap-2">
              {project.style_vibes.map((vibe, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-[11px]"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


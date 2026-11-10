"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Download,
  Copy,
  ExternalLink,
  Share2,
  FileCheck,
  FileCode,
  Image as ImageIcon,
  Check,
  X
} from "lucide-react";
import { ProjectRecord } from "../../../types/curation";

interface ApprovalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectRecord;
  exportLinks: {
    svg_url: string;
    png_url: string;
    pdf_url: string;
    client_proposal_url: string;
  };
}

export const ApprovalSuccessModal: React.FC<ApprovalSuccessModalProps> = ({
  isOpen,
  onClose,
  project,
  exportLinks
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const fullProposalUrl = typeof window !== "undefined"
    ? `${window.location.origin}${exportLinks.client_proposal_url}`
    : `https://lumina.lab${exportLinks.client_proposal_url}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullProposalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl text-stone-100 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Status */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
              <span>ĐÃ PHÊ DUYỆT &amp; XUẤT BẢN THÀNH CÔNG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              {project.brand_name.toUpperCase()}
            </h2>
            <p className="text-xs text-stone-400">
              Mã dự án: <span className="font-mono text-amber-300 font-semibold">{project.project_id}</span> • Trạng thái đã chuyển sang <span className="text-emerald-400 font-semibold">Approved</span>
            </p>
          </div>
        </div>

        {/* 3 Export Files ready for download */}
        <div className="space-y-3">
          <div className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            <span>Trọn Bộ 3 Tài Sản Thương Hiệu Tự Động Biên Dịch:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* SVG Master */}
            <a
              href={exportLinks.svg_url}
              download="logo_master.svg"
              className="p-3.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <Download className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-200">logo_master.svg</div>
                <div className="text-[10px] text-stone-500">Vector gốc sắc nét</div>
              </div>
            </a>

            {/* PNG Transparent */}
            <a
              href={exportLinks.png_url}
              download="logo_transparent.png"
              className="p-3.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <Download className="w-4 h-4 text-stone-500 group-hover:text-emerald-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-200">logo_transparent.png</div>
                <div className="text-[10px] text-stone-500">300 DPI trong suốt</div>
              </div>
            </a>

            {/* Brand Guideline PDF */}
            <a
              href={exportLinks.pdf_url}
              download="brand_guideline.pdf"
              className="p-3.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileCheck className="w-5 h-5 text-sky-400" />
                <Download className="w-4 h-4 text-stone-500 group-hover:text-sky-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-200">brand_guideline.pdf</div>
                <div className="text-[10px] text-stone-500">Pitch Deck 16:9 (5 trang)</div>
              </div>
            </a>
          </div>
        </div>

        {/* Shareable Proposal Link */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              Đường Dẫn Bàn Giao Cho Khách Hàng (Client Proposal Link):
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-stone-900 rounded-xl border border-stone-700/80 font-mono text-xs text-amber-200 truncate select-all">
              {fullProposalUrl}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Đã Copy!" : "Copy Link"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-500">
              Gửi link này qua Zalo hoặc Email để khách hàng mở duyệt hồ sơ hoàn chỉnh.
            </span>
            <a
              href={exportLinks.client_proposal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline"
            >
              <span>Xem trực tiếp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Done button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            Đóng &amp; Trở Về Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};


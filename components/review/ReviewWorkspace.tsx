"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Check,
  AlertCircle,
  FileCheck2,
  ArrowLeft,
  MessageSquare,
  Palette,
  Type,
  Sun,
  Moon,
  ShieldCheck,
  HelpCircle,
  Download,
  Share2,
  ExternalLink,
  CreditCard,
  QrCode,
  X,
  Library,
  Copy,
  Lock,
  Maximize2
} from "lucide-react";
import { ProjectRecord, LogoOption } from "../../types/curation";
import { calculateQuote } from "../../types/brief";

interface ReviewWorkspaceProps {
  project: ProjectRecord;
  onExit: () => void;
  onProjectUpdated: (updated: ProjectRecord) => void;
}

export const ReviewWorkspace: React.FC<ReviewWorkspaceProps> = ({
  project,
  onExit,
  onProjectUpdated,
}) => {
  // Lấy danh sách options
  const logoOptions: LogoOption[] = project.logo_options || [];
  const optionsCount = project.logo_options_count || (project.order_tier === "pro" ? 3 : 1);
  const isMultipleOptions = optionsCount === 3 && logoOptions.length >= 3;

  // Selected Option
  const [selectedOptionId, setSelectedOptionId] = useState<"opt_1" | "opt_2" | "opt_3">(
    project.selected_logo_id || "opt_1"
  );

  // Canvas background theme
  const [canvasBg, setCanvasBg] = useState<"light" | "dark">("light");

  // Feedback State
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Payment Modal State (Bước 4)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCompletingPayment, setIsCompletingPayment] = useState(false);
  const [hasCopiedText, setHasCopiedText] = useState(false);

  // Fullscreen Zoom Lightbox State
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomOption, setZoomOption] = useState<LogoOption | null>(null);

  const handleOpenZoom = (opt: LogoOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomOption(opt);
    setIsZoomModalOpen(true);
  };

  // Active option object
  const activeOption =
    logoOptions.find((o) => o.id === selectedOptionId) ||
    logoOptions[0] || {
      id: "opt_1",
      title: "Phương án Master",
      concept_note: "Bản sắc thương hiệu chuẩn tỷ lệ vàng",
      svg: project.logo_svg,
    };

  // Delivery Time label
  const deliveryTimeLabel =
    project.delivery_time === "24h" ? "24 Giờ (Hỏa tốc)" : "3 Ngày (Tiêu chuẩn)";

  // Số tiền theo gói: Tính toán động chuẩn xác theo gói đặt hàng
  const paymentAmount =
    project.payment_amount ||
    (project as any).order_config?.quote_price ||
    (project as any).quote_price ||
    calculateQuote(
      project.delivery_time || "24h",
      (project.logo_options_count as 1 | 3) || (project.order_tier === "pro" ? 3 : 1),
      (project.revision_rounds as 1 | 2) || 2
    ) ||
    (project.order_tier === "standard" ? 1000000 : 2500000);

  const formattedPaymentAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(paymentAmount);

  // Quick feedback tag helper
  const handleAddQuickTag = (tag: string) => {
    setComment((prev) => (prev ? `${prev}. ${tag}` : tag));
  };

  // Download Handlers
  const handleDownloadSvg = () => {
    const downloadUrl = `/downloads/${project.project_id}/logo_master.svg`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPng = () => {
    const downloadUrl = `/downloads/${project.project_id}/logo_transparent.png`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-300dpi.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    const downloadUrl = `/downloads/${project.project_id}/brand_guideline.pdf`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-brand-guidelines.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy account info helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedText(true);
    setTimeout(() => setHasCopiedText(false), 2000);
  };

  // Submit Feedback Handler (Bước 2: Góp ý; Bước 4: Chấp thuận nghiệm thu)
  const handleSubmitFeedback = async (feedbackType: "revision" | "approve_final" = "revision") => {
    if (feedbackType === "revision" && !comment.trim()) {
      setErrorMessage("Vui lòng nhập nội dung góp ý hoặc phản hồi chi tiết để Giám đốc Sáng tạo căn chỉnh.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/review/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.project_id,
          selected_logo_id: selectedOptionId,
          comment: comment.trim() || (feedbackType === "approve_final" ? "Khách hàng đồng ý nghiệm thu bản thiết kế." : ""),
          feedback_type: feedbackType,
        }),
      });

      const data = await res.json();

      if (data.success && data.project) {
        onProjectUpdated(data.project);
        setSubmitSuccess(data.message);
        if (feedbackType === "approve_final") {
          setComment("");
          // Mở modal thanh toán VietQR
          setIsPaymentModalOpen(true);
        }
      } else {
        setErrorMessage(data.error || "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Khách bấm "Tôi đã hoàn tất thanh toán" (Bước 5)
  const handleCompletePaymentAndDelivery = async () => {
    setIsCompletingPayment(true);
    try {
      const res = await fetch(`/api/projects/${project.project_id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_ref: `MB-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.project) {
        onProjectUpdated(data.project);
        setIsPaymentModalOpen(false);
        setSubmitSuccess("🎉 Chúc mừng bạn đã hoàn tất thanh toán & Nghiệm thu! Trọn bộ file bàn giao đã sẵn sàng tải xuống.");
      } else {
        alert("Có lỗi khi xác nhận bàn giao: " + (data.error || "Không xác định"));
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ khi xác nhận thanh toán.");
    } finally {
      setIsCompletingPayment(false);
    }
  };

  const isCompletedOrApproved =
    project.status === "Completed" || project.status === "Approved" || project.payment_status === "paid";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* =====================================================================
          A. THANH TIÊU ĐỀ & THÔNG TIN TIẾN ĐỘ
      ===================================================================== */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-stone-800">
          {/* Left: Brand info & exit button */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onExit}
                className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tra cứu đơn khác</span>
              </button>
              <span className="text-xs font-mono text-stone-500">
                MÃ: {project.project_id}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-stone-100 tracking-wide">
                {project.brand_name.toUpperCase()}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Khách hàng đại diện: <strong className="text-stone-200 font-medium">{project.client_name}</strong> • Ngành: <span className="text-stone-300">{project.industry}</span>
              </p>
            </div>
          </div>

          {/* Right: Gói dịch vụ & HIỂN THỊ LẦN DUYỆT THEO ĐIỀU KIỆN NGHIÊM NGẶT */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5">
            {/* Gói dịch vụ */}
            <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-stone-950 px-3.5 py-1.5 rounded-full border border-stone-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Gói dịch vụ: <strong className="text-amber-300">{deliveryTimeLabel}</strong></span>
            </div>

            {/* Trạng thái hoàn tất */}
            {isCompletedOrApproved ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ĐÃ PHÊ DUYỆT &amp; ĐÃ BÀN GIAO</span>
              </div>
            ) : project.revision_rounds === 2 ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300 font-semibold text-xs sm:text-sm shadow-md shadow-amber-950/30">
                <span>📌</span>
                <span>
                  ĐỢT DUYỆT: LẦN {project.current_revision || 1} / 2
                  {project.current_revision === 2 ? " — LẦN DUYỆT CHỐT CUỐI CÙNG" : ""}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950/30">
                <span>✨</span>
                <span>BẢN DUYỆT MẪU NGHIỆM THU</span>
              </div>
            )}
          </div>
        </div>

        {/* Status notice */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {isMultipleOptions
                ? "Đơn hàng gói đa dạng: Vui lòng xem 3 phương án bên dưới và bấm chọn mẫu bạn ưng ý nhất."
                : "Đơn hàng gói chuyên sâu: Giám đốc Sáng tạo đã tinh lọc 1 bản sắc tối ưu nhất cho bạn."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500">Chế độ xem nền canvas:</span>
            <div className="flex items-center bg-stone-950 rounded-lg p-0.5 border border-stone-800">
              <button
                type="button"
                onClick={() => setCanvasBg("light")}
                className={`p-1 rounded ${canvasBg === "light" ? "bg-amber-400 text-stone-950" : "text-stone-400"}`}
                title="Nền sáng giấy mỹ thuật"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCanvasBg("dark")}
                className={`p-1 rounded ${canvasBg === "dark" ? "bg-amber-400 text-stone-950" : "text-stone-400"}`}
                title="Nền tối studio"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BƯỚC 5: KHÔNG GIAN BÀN GIAO THÀNH PHẨM (FINAL ASSET HANDOVER)
      ===================================================================== */}
      {/* Hiển thị khi đã thanh toán/hoàn tất */}
      {isCompletedOrApproved ? (
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/50 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <span>ĐÃ HOÀN TẤT &amp; BÀN GIAO TRỌN BỘ FILE BẢN QUYỀN</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">100% Hoàn Tất</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  Đơn hàng [{project.project_id}] đã được nghiệm thu và lưu trữ vĩnh viễn vào hệ thống Lumina.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/library"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Library className="w-3.5 h-3.5" />
                <span>Xem mẫu trong Thư viện</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </Link>
            </div>
          </div>

          {/* 3 Nút Tải Tài Sản Bàn Giao */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* SVG Master */}
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="p-5 rounded-2xl bg-stone-950/80 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/60 text-left transition-all group cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-400">VECTOR MASTER</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">File SVG Gốc (Vector)</div>
                <div className="text-[11px] text-stone-400 mt-1">Độ sắc nét vô hạn, chuyên dụng cho in ấn bạt lớn, biển bảng &amp; cắt laser kim loại.</div>
              </div>
            </button>

            {/* PNG 300 DPI */}
            <button
              type="button"
              onClick={handleDownloadPng}
              className="p-5 rounded-2xl bg-stone-950/80 hover:bg-stone-850 border border-stone-800 hover:border-emerald-400/60 text-left transition-all group cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400">PNG TRONG SUỐT</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-stone-950 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">File PNG 300 DPI Trong Suốt</div>
                <div className="text-[11px] text-stone-400 mt-1">Đã bóc tách nền hoàn toàn, dùng ngay cho website, app mobile, mạng xã hội &amp; đóng dấu ảnh.</div>
              </div>
            </button>

            {/* PDF Guidelines */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="p-5 rounded-2xl bg-stone-950/80 hover:bg-stone-850 border border-stone-800 hover:border-indigo-400/60 text-left transition-all group cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400">BRAND GUIDELINES</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-400 group-hover:text-stone-950 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">File PDF Brand Guidelines</div>
                <div className="text-[11px] text-stone-400 mt-1">Cẩm nang nhận diện thương hiệu 5 trang: câu chuyện, mã màu HEX/CMYK, font chữ &amp; mockup thực tế.</div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Preview 3 file bản quyền khi chưa nghiệm thu */
        <div className="rounded-3xl bg-stone-900/60 border border-stone-800/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-serif font-bold text-stone-200">
                Trọn Bộ 3 File Bản Quyền Bàn Giao (Tự động mở khóa sau khi nghiệm thu)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5" />
              <span>Đang khóa bảo mật</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-850 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-stone-200 block text-xs">1. File SVG Vector Gốc</strong>
                <span className="text-[11px] text-stone-500">Chuẩn in bạt lớn &amp; cắt laser kim loại</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-850 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-stone-200 block text-xs">2. File PNG 300 DPI Trong Suốt</strong>
                <span className="text-[11px] text-stone-500">Dùng ngay cho website, app &amp; mạng xã hội</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-850 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-indigo-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-stone-200 block text-xs">3. PDF Brand Guidelines</strong>
                <span className="text-[11px] text-stone-500">Cẩm nang nhận diện thương hiệu 5 trang</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          B. HIỂN THỊ MẪU LOGO (DESIGN DISPLAY)
      ===================================================================== */}
      {isMultipleOptions ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>3 Phương Án Logo Master Khác Biệt</span>
            </h2>
            <span className="text-xs text-stone-400">
              Bấm vào từng card để chọn phương án bạn yêu thích
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {logoOptions.map((opt) => {
              const isSelected = opt.id === selectedOptionId;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? "border-amber-400 bg-stone-900 shadow-xl shadow-amber-500/15 scale-[1.02]"
                      : "border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>ĐANG CHỌN</span>
                    </div>
                  )}

                  {/* SVG Canvas Preview */}
                  <div className="relative group/canvas">
                    <div
                      className={`w-full aspect-square rounded-xl p-4 flex items-center justify-center overflow-hidden transition-colors ${
                        canvasBg === "light" ? "bg-[#FAF7F2]" : "bg-stone-950"
                      }`}
                      dangerouslySetInnerHTML={{ __html: opt.svg }}
                    />
                    <button
                      type="button"
                      onClick={(e) => handleOpenZoom(opt, e)}
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-stone-900/85 hover:bg-amber-400 text-stone-300 hover:text-stone-950 transition-all cursor-pointer shadow-md border border-stone-700/80 flex items-center gap-1 text-[11px] font-medium backdrop-blur-sm"
                      title="Phóng to toàn màn hình soi chi tiết"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Soi nét</span>
                    </button>
                  </div>

                  {/* Title & Concept */}
                  <div className="mt-4 space-y-1">
                    <h3 className="font-serif font-bold text-base text-stone-100">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-light line-clamp-2">
                      {opt.concept_note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Gói Standard: 1 Logo duy nhất */
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-100">
              Phương Án Logo Master Được Chọn Lọc
            </h2>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Bản Chốt Tinh Tuyển
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Canvas */}
            <div className="relative group/canvas">
              <div
                className={`w-full aspect-square rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-stone-800 shadow-xl ${
                  canvasBg === "light" ? "bg-[#FAF7F2]" : "bg-stone-950"
                }`}
                dangerouslySetInnerHTML={{ __html: activeOption.svg }}
              />
              <button
                type="button"
                onClick={() => handleOpenZoom(activeOption)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-amber-400 text-stone-200 hover:text-stone-950 transition-all cursor-pointer shadow-lg border border-stone-700/80 flex items-center gap-1.5 text-xs font-semibold backdrop-blur-sm"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Phóng to soi từng nét vẽ</span>
              </button>
            </div>

            {/* Spec details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  {activeOption.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {activeOption.concept_note}
                </p>
              </div>

              {/* Palette swatches */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
                  Bảng Màu Nhận Diện
                </span>
                <div className="flex items-center gap-2">
                  {project.palette?.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-300">
                      <span
                        className="w-4 h-4 rounded-full border border-stone-700 shadow-sm"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="font-mono text-[11px]">{col.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography pairing */}
              {project.typography && (
                <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>Font Tiêu Đề: <strong className="text-amber-300 font-serif">{project.typography.heading}</strong></span>
                  </div>
                  <div className="text-stone-400">
                    Font Nội Dung: <strong className="text-stone-200">{project.typography.body}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          C. Ô PHẢN HỒI CHỈNH SỬA & NÚT PHÊ DUYỆT NGHIỆM THU
      ===================================================================== */}
      {!isCompletedOrApproved && (
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-100">
                  Ghi Chú Phản Hồi &amp; Yêu Cầu Chỉnh Sửa
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Áp dụng cho mẫu: <strong className="text-amber-300">{activeOption.title}</strong>
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-400 font-mono">
              {project.revision_rounds === 2 ? (
                <span className="text-amber-400">
                  Lần duyệt {project.current_revision || 1} / 2
                </span>
              ) : (
                <span className="text-emerald-400">Nghiệm thu mẫu</span>
              )}
            </div>
          </div>

          {/* Quick Tag Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
              Gợi ý yêu cầu nhanh (Bấm để thêm vào nội dung):
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Điều chỉnh sắc độ màu sắc đậm hơn",
                "Tăng kích thước icon biểu tượng lên 10%",
                "Điều chỉnh khoảng cách dãn chữ (letter-spacing)",
                "Cân đối lại bố cục giữa hình và chữ",
                "Mẫu này rất đẹp, tôi hoàn toàn hài lòng!",
              ].map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickTag(tag)}
                  className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs transition-colors cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Mô tả cụ thể mong muốn căn chỉnh của bạn (Ví dụ: Xin đổi màu sang tone ấm hơn, nét vẽ biểu tượng thanh thoát hơn, giữ nguyên bố cục chữ...)"
              className="w-full px-4 py-3.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all resize-none"
            />
            <div className="flex justify-between items-center text-xs text-stone-400">
              <span>Giám đốc Sáng tạo sẽ trực tiếp tiếp nhận và xử lý góp ý của bạn.</span>
              <span>{comment.length} ký tự</span>
            </div>
          </div>

          {/* Success or Error Message Alert */}
          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">Thành công!</strong>
                {submitSuccess}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =====================================================================
              D. NÚT BẤM HÀNH ĐỘNG: GỬI GÓP Ý HOẶC NGHIỆM THU THANH TOÁN
          ===================================================================== */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {/* Nút 1: Yêu cầu chỉnh sửa */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmitFeedback("revision")}
              className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm sm:text-base tracking-wide uppercase shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Đang gửi phản hồi..."
                  : "XÁC NHẬN CHỌN MẪU & GỬI GÓP Ý"}
              </span>
            </button>

            {/* Nút 2: Đồng ý nghiệm thu bản thiết kế (Mở Modal VietQR) */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmitFeedback("approve_final")}
              className="w-full sm:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base tracking-wide uppercase shadow-xl shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>✅ ĐỒNG Ý NGHIỆM THU BẢN THIẾT KẾ</span>
            </button>
          </div>

          {/* Lịch sử phản hồi trước đó nếu có */}
          {project.feedback_history && project.feedback_history.length > 0 && (
            <div className="pt-6 border-t border-stone-800/80 space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
                Lịch sử các lần duyệt trước đó:
              </span>
              <div className="space-y-2">
                {project.feedback_history.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="font-semibold text-amber-300">
                        Lần duyệt {fb.revision_round} • Option {fb.selected_option_id}
                      </span>
                      <span className="font-mono text-[11px]">
                        {new Date(fb.submitted_at).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-stone-300 font-light italic">
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          BƯỚC 4: MODAL THANH TOÁN VIETQR (PAYMENT GATEWAY)
      ===================================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header modal */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/25">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  Thanh Toán Nghiệm Thu Bản Thiết Kế
                </h3>
                <p className="text-xs text-stone-400">
                  Đơn hàng: <strong className="text-amber-300 font-mono">{project.project_id}</strong> • Thương hiệu: <strong className="text-stone-200">{project.brand_name}</strong>
                </p>
              </div>
            </div>

            {/* Thông tin VietQR & Tài khoản */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-950 p-5 rounded-2xl border border-stone-800 items-center">
              {/* Ảnh VietQR chuẩn MB Bank */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md space-y-2">
                <img
                  src={`https://img.vietqr.io/image/MB-0912839201-compact2.png?amount=${paymentAmount}&addInfo=LUMINA%20${project.project_id}&accountName=LUMINA%20BRAND%20LAB`}
                  alt="VietQR MB Bank"
                  className="w-full max-w-[200px] h-auto object-contain"
                />
                <span className="text-[10px] text-stone-600 font-medium text-center block">
                  Quét mã qua App Ngân Hàng bất kỳ
                </span>
                <a
                  href={`https://img.vietqr.io/image/MB-0912839201-compact2.png?amount=${paymentAmount}&addInfo=LUMINA%20${project.project_id}&accountName=LUMINA%20BRAND%20LAB`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`VietQR-${project.project_id}.png`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-[11px] font-medium transition-all shadow-sm border border-stone-700"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tải Mã QR Về Máy</span>
                </a>
              </div>

              {/* Chi tiết tài khoản */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Ngân Hàng Thụ Hưởng:</span>
                  <strong className="text-stone-200 text-sm">MB Bank (Ngân Hàng Quân Đội)</strong>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Số Tài Khoản:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-amber-300 font-mono text-base">0912839201</strong>
                    <button
                      type="button"
                      onClick={() => handleCopy("0912839201")}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
                      title="Sao chép STK"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Chủ Tài Khoản:</span>
                  <strong className="text-stone-200 uppercase">LUMINA BRAND LAB</strong>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Số Tiền Thanh Toán:</span>
                  <strong className="text-emerald-400 font-mono text-lg font-bold">
                    {formattedPaymentAmount}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Nội Dung Chuyển Khoản:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-amber-300 font-mono bg-stone-900 px-2 py-1 rounded border border-stone-800">
                      LUMINA {project.project_id}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleCopy(`LUMINA ${project.project_id}`)}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
                      title="Sao chép nội dung"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {hasCopiedText && (
                  <span className="text-[11px] text-emerald-400">✓ Đã sao chép vào bộ nhớ tạm!</span>
                )}
              </div>
            </div>

            {/* Nút hoàn tất thanh toán */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={isCompletingPayment}
                onClick={handleCompletePaymentAndDelivery}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCompletingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Hệ thống đang đối soát &amp; xuất file...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-stone-950" />
                    <span>TÔI ĐÃ HOÀN TẤT THANH TOÁN</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-stone-400">
                Sau khi bấm hoàn tất, hệ thống sẽ tự động kích hoạt bàn giao 3 file (SVG, PNG, PDF) và lưu trữ mẫu vào Thư viện.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ZOOM MODAL (PHÓNG TO SOI TỪNG NÉT VẼ LOGO ĐỘ NÉT CAO)
      ===================================================================== */}
      {isZoomModalOpen && zoomOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              title="Đóng xem chi tiết"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between pr-10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  CHẾ ĐỘ XEM CHI TIẾT TỶ LỆ VÀNG
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  {zoomOption.title}
                </h3>
              </div>

              {/* Nền sáng / tối */}
              <div className="flex items-center bg-stone-950 rounded-lg p-0.5 border border-stone-800">
                <button
                  type="button"
                  onClick={() => setCanvasBg("light")}
                  className={`p-1.5 rounded transition-colors ${canvasBg === "light" ? "bg-amber-400 text-stone-950" : "text-stone-400"}`}
                  title="Nền giấy mỹ thuật sáng"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasBg("dark")}
                  className={`p-1.5 rounded transition-colors ${canvasBg === "dark" ? "bg-amber-400 text-stone-950" : "text-stone-400"}`}
                  title="Nền tối studio"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ultra Large Canvas */}
            <div
              className={`w-full aspect-square max-h-[460px] rounded-2xl p-8 flex items-center justify-center overflow-hidden border border-stone-800 shadow-2xl transition-colors ${
                canvasBg === "light" ? "bg-[#FAF7F2]" : "bg-stone-950"
              }`}
              dangerouslySetInnerHTML={{ __html: zoomOption.svg }}
            />

            {/* Footer info & select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-800 text-xs">
              <p className="text-stone-300 font-light italic max-w-md">
                &ldquo;{zoomOption.concept_note}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedOptionId(zoomOption.id as any);
                  setIsZoomModalOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Chọn Mẫu Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Mail,
  Building,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  PhoneCall,
} from "lucide-react";
import { BriefPayload, getPackageName } from "../types/brief";

interface SuccessScreenProps {
  payload: BriefPayload;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  payload,
  onReset,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFullCard, setCopiedFullCard] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string>(
    payload.project_id || ""
  );

  // Tự động đồng bộ và tra cứu mã nếu payload chưa kịp nạp
  React.useEffect(() => {
    if (payload.project_id) {
      setCurrentProjectId(payload.project_id);
      return;
    }

    // Nếu chưa có mã, tự động gọi API tra cứu theo SĐT ngay lập tức
    if (payload.client_phone) {
      fetch("/api/review/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_key: payload.client_phone }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.project && data.project.project_id) {
            setCurrentProjectId(data.project.project_id);
          }
        })
        .catch(() => {});
    }
  }, [payload.project_id, payload.client_phone]);

  const activeProjectId = currentProjectId || payload.project_id || "";
  const displayProjectId = activeProjectId || "Đang kết nối cấp mã...";

  const handleCopyProjectId = async () => {
    if (activeProjectId) {
      try {
        await navigator.clipboard.writeText(activeProjectId);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (err) {
        console.error("Failed to copy Project ID:", err);
      }
    }
  };

  const handleCopyFullCard = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const portalFullUrl = `${origin}${reviewPortalUrl}`;
    const cardText = `[LUMINA BRAND LAB - THẺ ĐƠN HÀNG VIP]
• Mã tra cứu: ${activeProjectId || displayProjectId}
• Thương hiệu: ${payload.brand_name}
• Người đại diện: ${payload.client_name}
• Số điện thoại / Zalo: ${payload.client_phone}
• Email nhận bàn giao: ${payload.client_email}
• Gói dịch vụ: ${packageName} (${deliveryTimeText})
• Báo giá niêm yết: ${formattedPrice} VNĐ
• Cổng duyệt mẫu online: ${portalFullUrl}
• Hotline Giám đốc Sáng tạo: 0912.839.201`;

    try {
      await navigator.clipboard.writeText(cardText);
      setCopiedFullCard(true);
      setTimeout(() => setCopiedFullCard(false), 2500);
    } catch (err) {
      console.error("Failed to copy full card:", err);
    }
  };

  const deliveryTimeText =
    payload.order_config?.delivery_time === "24h"
      ? "24 Giờ (Hỏa tốc)"
      : "3 Ngày (Tiêu chuẩn)";

  const packageName = getPackageName(
    payload.order_config?.delivery_time || "24h",
    payload.order_config?.logo_options_count || 1,
    payload.order_config?.revision_rounds || 2
  );

  const formattedPrice = (
    payload.order_config?.quote_price || 1000000
  ).toLocaleString("vi-VN");

  // URL mở cổng duyệt mẫu tự động
  const reviewPortalUrl = activeProjectId
    ? `/review?project_id=${encodeURIComponent(activeProjectId)}&phone=${encodeURIComponent(payload.client_phone)}`
    : `/review?phone=${encodeURIComponent(payload.client_phone)}`;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 text-center space-y-8 animate-fade-in">
      {/* Icon check xanh/vàng tinh tế */}
      <div className="relative inline-flex items-center justify-center">
        {/* Pulsing Aura */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 blur-xl animate-pulse" />

        {/* Inner Icon Circle */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/30 flex items-center justify-center relative z-10">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 stroke-[2]" />
        </div>

        {/* Small Golden Sparkle Badge */}
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-amber-400 text-stone-950 shadow-md">
          <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
        </div>
      </div>

      {/* Tiêu đề & Lời chúc mừng trang trọng */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Cam kết hoàn tất: {deliveryTimeText}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 leading-snug">
          Khởi Tạo Thành Công Yêu Cầu Thiết Kế Bản Sắc!
        </h2>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light max-w-xl mx-auto">
          Hồ sơ của{" "}
          <strong className="text-amber-300 font-serif font-semibold">
            {payload.brand_name}
          </strong>{" "}
          đã được chuyển thẳng đến Bàn làm việc của Giám đốc Sáng tạo. Đội ngũ chuyên môn đang tiến hành thẩm định và tinh chỉnh các concept logo vector theo chuẩn mực tỷ lệ vàng.
        </p>
      </div>

      {/* =====================================================================
          THẺ CĂN CƯỚC ĐƠN HÀNG VIP (VIP ORDER PASSCARD)
      ===================================================================== */}
      <div className="text-left rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Card: Mã Đơn Hàng & Trạng Thái */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 block mb-1">
              MÃ TRA CỨU ĐƠN HÀNG CHÍNH THỨC
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider">
                {displayProjectId}
              </span>
              {activeProjectId && (
                <button
                  type="button"
                  onClick={handleCopyProjectId}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-stone-700"
                  title="Sao chép mã đơn hàng"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>Chép mã</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Đang Tiến Hành Tinh Chỉnh</span>
            </span>
          </div>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <span className="text-stone-400 block mb-1 text-[11px]">Thương hiệu thiết kế:</span>
            <span className="text-stone-100 font-serif font-bold text-base text-amber-200">
              {payload.brand_name}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <span className="text-stone-400 block mb-1 text-[11px]">Người đại diện:</span>
            <span className="text-stone-100 font-medium text-sm">
              {payload.client_name}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <span className="text-stone-400 block mb-1 text-[11px]">Số điện thoại / Zalo nhận tin:</span>
            <span className="text-stone-200 font-mono font-semibold text-sm">
              {payload.client_phone}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80">
            <span className="text-stone-400 block mb-1 text-[11px]">Email nhận trọn bộ file:</span>
            <span className="text-stone-200 font-mono text-xs truncate block">
              {payload.client_email}
            </span>
          </div>

          {/* Gói dịch vụ & Báo giá chốt */}
          <div className="sm:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wide">
                  {packageName}
                </span>
                <span className="text-stone-300 text-xs font-medium">
                  {deliveryTimeText} • {payload.order_config?.logo_options_count} Option Logo • {payload.order_config?.revision_rounds} Đợt Duyệt
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cam kết bàn giao: [File Vector gốc in ấn vô hạn + PNG tách nền trong suốt + Cẩm nang thương hiệu PDF]</span>
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">
                BÁO GIÁ ĐÃ XÁC NHẬN
              </span>
              <span className="text-xl font-serif font-black text-amber-300">
                {formattedPrice} VNĐ
              </span>
            </div>
          </div>
        </div>

        {/* Nút Hành Động Trọng Tâm (Primary Action) */}
        <div className="pt-2 space-y-2.5">
          <Link
            href={reviewPortalUrl}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all cursor-pointer transform hover:scale-[1.01]"
          >
            <span>MỞ CỔNG DUYỆT MẪU &amp; THEO DÕI ĐƠN HÀNG NGAY</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={handleCopyFullCard}
            className="w-full py-3 px-4 rounded-xl bg-stone-850 hover:bg-stone-800 border border-amber-500/30 hover:border-amber-400/60 text-stone-200 hover:text-amber-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            {copiedFullCard ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Đã sao chép toàn bộ thông tin thẻ đơn hàng!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Sao Chép Thẻ Đơn Hàng Gửi Qua Zalo / Đối Tác</span>
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-center text-xs text-stone-300 mt-2.5 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              An tâm: Quý khách chỉ cần nhớ Số điện thoại <strong className="text-amber-300">{payload.client_phone}</strong> là tra cứu được ngay mọi lúc tại mục &ldquo;Duyệt Mẫu&rdquo;!
            </span>
          </div>
        </div>
      </div>

      {/* Hành động phụ trợ */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khởi Tạo Brief Cho Thương Hiệu Khác</span>
        </button>

        <a
          href="tel:0912839201"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-amber-300 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>Hotline Giám Đốc Sáng Tạo: 0912.839.201</span>
        </a>
      </div>
    </div>
  );
};

export default SuccessScreen;

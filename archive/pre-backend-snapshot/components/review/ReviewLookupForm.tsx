"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  User,
  Hash,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Clock,
  Layers,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { ProjectRecord } from "../../types/curation";

interface ReviewLookupFormProps {
  onLookupSuccess: (project: ProjectRecord) => void;
}

export const ReviewLookupForm: React.FC<ReviewLookupFormProps> = ({
  onLookupSuccess,
}) => {
  const searchParams = useSearchParams();
  const [searchKey, setSearchKey] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hàm thực hiện tra cứu
  const executeLookup = async (queryKey: string, name?: string) => {
    const key = queryKey.trim();
    if (!key && !name?.trim()) {
      setErrorMessage("Vui lòng nhập Số điện thoại hoặc Mã đơn hàng để tra cứu.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/review/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_key: key,
          client_name: (name || "").trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.project) {
        onLookupSuccess(data.project);
      } else {
        setErrorMessage(
          data.error ||
            "Không tìm thấy đơn hàng hoặc thông tin không khớp. Vui lòng kiểm tra lại Số điện thoại hoặc Mã đơn hàng."
        );
      }
    } catch (err: any) {
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Tự động tra cứu khi có query param từ URL (?project_id=... hoặc ?phone=...)
  useEffect(() => {
    const paramProjectId = searchParams.get("project_id");
    const paramPhone = searchParams.get("phone");
    const keyToSearch = paramProjectId || paramPhone;

    if (keyToSearch) {
      setSearchKey(keyToSearch);
      executeLookup(keyToSearch);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(searchKey, clientName);
  };

  // Demo fill helper
  const handleQuickDemo = (key: string, name: string) => {
    setSearchKey(key);
    setClientName(name);
    setErrorMessage(null);
    executeLookup(key, name);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      {/* Box Glassmorphism */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-7 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CỔNG DUYỆT MẪU &amp; NGHIỆM THU THƯƠNG HIỆU</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Tra Cứu Bản Thiết Kế
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 font-light max-w-md mx-auto leading-relaxed">
              Nhập <strong className="text-stone-200">Số Điện Thoại</strong> bạn đã đăng ký hoặc <strong className="text-stone-200">Mã đơn hàng (Project ID)</strong> để mở không gian duyệt mẫu và nghiệm thu.
            </p>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Số điện thoại HOẶC Mã đơn hàng */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                1. Số điện thoại HOẶC Mã đơn hàng <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Ví dụ: 0903 033 033 hoặc LUMINA-05"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  required
                />
                <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-stone-500 block">
                Khuyên dùng: Nhập SĐT bạn đã gửi trong Brief để tìm kiếm nhanh nhất.
              </span>
            </div>

            {/* Input 2: Họ và tên (Không bắt buộc) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                2. Họ và tên người đặt <span className="text-stone-500 font-normal">(Tùy chọn)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Anh"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Error notice */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tra cứu đơn hàng...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Tra Cứu &amp; Mở Bàn Duyệt Mẫu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Lookup Chips */}
          <div className="pt-4 border-t border-stone-800/80 space-y-2">
            <div className="text-[11px] font-mono uppercase text-stone-400 tracking-wider text-center">
              Dự Án Mẫu Đang Có Sẵn Trong Database (Bấm để thử ngay):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo("0903 033033", "Nguyễn Anh")}
                className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-stone-300 font-medium group-hover:text-amber-300">
                  <span>LUMINA-05 (CRESTEC)</span>
                  <span className="text-[10px] text-amber-400 font-mono">Đơn Mới</span>
                </div>
                <div className="text-[11px] text-stone-400">Nguyễn Anh • 0903 033033</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("0933696333", "Nguyễn Anh Kim")}
                className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-stone-300 font-medium group-hover:text-amber-300">
                  <span>LUMINA-04 (Morphic)</span>
                  <span className="text-[10px] text-purple-400 font-mono">Chờ thanh toán</span>
                </div>
                <div className="text-[11px] text-stone-400">Nguyễn Anh Kim • 0933696333</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("0934.567.890", "Trần Hoàng Nguyên")}
                className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-stone-300 font-medium group-hover:text-amber-300">
                  <span>LUMINA-03 (Gió Mộc)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Đang duyệt 3 mẫu</span>
                </div>
                <div className="text-[11px] text-stone-400">Trần Hoàng Nguyên</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("0912.839.201", "Lê Tuấn Hưng")}
                className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-stone-300 font-medium group-hover:text-amber-300">
                  <span>LUMINA-01 (Aura Roasters)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Đã Bàn Giao</span>
                </div>
                <div className="text-[11px] text-stone-400">Lê Tuấn Hưng</div>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-stone-400 text-xs pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Hệ thống bảo mật: Chỉ khách hàng sở hữu SĐT hoặc mã đơn mới có quyền truy cập bản thiết kế.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

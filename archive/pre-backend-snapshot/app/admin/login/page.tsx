"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  CheckCircle2
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from") || "/admin";

  const [passkey, setPasskey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Nếu đã đăng nhập trước đó thì chuyển hướng thẳng
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/check", { cache: "no-store" });
        const data = await res.json();
        if (data.authenticated) {
          router.replace(fromUrl);
        }
      } catch (_) {}
    }
    checkAuth();
  }, [router, fromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMessage("Vui lòng nhập mã khóa bảo mật của Giám đốc Sáng tạo.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: passkey.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(fromUrl);
          router.refresh();
        }, 500);
      } else {
        setErrorMessage(
          data.error || "Mã khóa quản trị không chính xác. Vui lòng thử lại!"
        );
      }
    } catch (err: any) {
      setErrorMessage("Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card Box */}
      <div className="bg-stone-900/90 border border-stone-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl relative">
        {/* Top Emblem */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 mb-5 relative group">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
              {isSuccess ? (
                <Unlock className="w-7 h-7 text-emerald-400 animate-bounce" />
              ) : (
                <Lock className="w-7 h-7 text-amber-300" />
              )}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono uppercase tracking-widest mb-3">
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>KHÓA XÁC THỰC GIÁM ĐỐC SÁNG TẠO</span>
          </div>

          <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-100 tracking-wide">
            LUMINA BRAND LAB
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 font-light leading-relaxed">
            Khu vực làm việc nội bộ dành riêng cho{" "}
            <span className="text-amber-300 font-medium">Giám đốc Sáng tạo</span> &amp; Quản trị viên.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">Mã khóa chính xác! Đang mở bàn làm việc...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="passkey"
              className="block text-xs font-medium text-stone-300 mb-2 uppercase tracking-wider"
            >
              Mã khóa Quản trị (Studio Passkey)
            </label>
            <div className="relative">
              <input
                id="passkey"
                type={showPassword ? "text" : "password"}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Nhập mã khóa xác thực (Mặc định: lumina2026)..."
                autoFocus
                disabled={isLoading || isSuccess}
                className="w-full bg-stone-950 border border-stone-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-xl px-4 py-3 text-stone-100 placeholder:text-stone-600 text-sm tracking-wide transition-all pr-11 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>ĐANG XÁC THỰC...</span>
              </>
            ) : isSuccess ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>ĐÃ MỞ KHÓA THÀNH CÔNG</span>
              </>
            ) : (
              <>
                <span>MỞ KHÓA BÀN LÀM VIỆC</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper Hint */}
        <div className="mt-6 pt-5 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500">
            Mật khẩu mặc định hệ thống:{" "}
            <button
              type="button"
              onClick={() => setPasskey("lumina2026")}
              className="font-mono font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 ml-1"
            >
              lumina2026
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Minimal */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trang Chủ</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>LUMINA GATEWAY SECURE</span>
        </div>
      </header>

      {/* Main Login Card with Suspense */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-stone-400 text-xs tracking-wider uppercase">
                Đang nạp cổng kiểm soát truy cập...
              </p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>

      {/* Footer Minimal */}
      <footer className="relative z-10 p-6 text-center text-[11px] text-stone-600 font-light">
        LUMINA BRAND LAB &copy; {new Date().getFullYear()} — BẢO MẬT &amp; QUYỀN TRUY CẬP GIÁM ĐỐC SÁNG TẠO
      </footer>
    </div>
  );
}

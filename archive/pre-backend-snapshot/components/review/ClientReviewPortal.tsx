"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, PhoneCall } from "lucide-react";
import { ProjectRecord } from "../../types/curation";
import { ReviewLookupForm } from "./ReviewLookupForm";
import { ReviewWorkspace } from "./ReviewWorkspace";

export const ClientReviewPortal: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<ProjectRecord | null>(null);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500/30 selection:text-amber-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-300 text-lg">L</span>
              </div>
            </div>
            <div>
              <div className="font-serif font-bold text-stone-100 text-lg tracking-wider">
                LUMINA <span className="font-sans font-light text-amber-400 text-sm">BRAND LAB</span>
              </div>
              <div className="text-[10px] text-stone-400 tracking-widest uppercase">
                CỔNG DUYỆT MẪU &amp; NGHIỆM THU
              </div>
            </div>
          </Link>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Về Trang Chủ</span>
            </Link>

            <a
              href="tel:0912839201"
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline Studio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 flex flex-col justify-center">
        {!currentProject ? (
          <Suspense
            fallback={
              <div className="w-full max-w-xl mx-auto p-12 text-center text-stone-400">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                  Đang nạp cổng tra cứu...
                </span>
              </div>
            }
          >
            <ReviewLookupForm
              onLookupSuccess={(project) => setCurrentProject(project)}
            />
          </Suspense>
        ) : (
          <ReviewWorkspace
            project={currentProject}
            onExit={() => setCurrentProject(null)}
            onProjectUpdated={(updated) => setCurrentProject(updated)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-8 text-center text-xs text-stone-500">
        <div className="container mx-auto px-4 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} LUMINA BRAND LAB. Cổng tra cứu và duyệt mẫu độc quyền dành cho khách hàng.
          </p>
          <p className="text-[11px] text-stone-600">
            Mọi ý tưởng thiết kế và mã nguồn SVG được bảo hộ bản quyền tác giả.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientReviewPortal;

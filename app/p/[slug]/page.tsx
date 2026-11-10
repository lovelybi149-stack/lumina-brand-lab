"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Moon,
  Sun,
  Layers,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Clock,
  Coffee,
  Bookmark,
  FileCheck
} from "lucide-react";
import { ProjectRecord } from "../../../types/curation";
import { convertColor } from "../../../lib/colorUtils";

export default function ClientProposalPage() {
  const params = useParams();
  const rawSlug = ((params?.slug as string) || (params?.id as string) || "");
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // View state
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;
  const [viewMode, setViewMode] = useState<"pitch-deck" | "editorial">("pitch-deck");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSelectingOption, setIsSelectingOption] = useState(false);
  const [selectionToast, setSelectionToast] = useState<string | null>(null);
  const [mockupOptionId, setMockupOptionId] = useState<string | null>(null);
  const presentationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.projects) {
          const match = data.projects.find((p: ProjectRecord) => {
            const pSlug = p.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              pSlug === rawSlug.toLowerCase() ||
              p.project_id.toLowerCase() === rawSlug.toLowerCase() ||
              rawSlug === "gio-moc-coffee" && p.brand_name.toLowerCase().includes("gió mộc")
            );
          }) || data.projects.find((p: ProjectRecord) => p.project_id === "LUMINA-03") || data.projects[0];
          setProject(match);
        }
      } catch (err) {
        console.error("Lỗi tải hồ sơ dự án:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [rawSlug]);

  // Keyboard navigation for Pitch Deck
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (viewMode !== "pitch-deck") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, totalSlides]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    copyToClipboard(url, "link");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      presentationContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!project) return;
    setIsDownloadingPdf(true);
    try {
      // Trigger download via dynamic API endpoint
      const downloadUrl = `/api/projects/${project.project_id}/pdf`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-pitch-deck.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Lỗi download PDF:", e);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 1500);
    }
  };

  const handleSelectOption = async (optionId: "opt_1" | "opt_2" | "opt_3") => {
    if (!project || isSelectingOption) return;
    setIsSelectingOption(true);
    try {
      const res = await fetch(`/api/projects/${project.project_id}/select-option`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_logo_id: optionId })
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        setMockupOptionId(optionId);
        const optTitle = data.project.logo_options?.find((o: any) => o.id === optionId)?.title || `Option ${optionId}`;
        setSelectionToast(`Đã chọn thành công "${optTitle}" làm Logo chính thức! Các mockup và bộ file bàn giao đã được đồng bộ hóa.`);
        setTimeout(() => setSelectionToast(null), 4000);
      } else {
        alert("Không thể lưu lựa chọn: " + (data.error || "Lỗi không xác định"));
      }
    } catch (err: any) {
      console.error("Lỗi khi chọn logo option:", err);
      alert("Lỗi kết nối khi lưu lựa chọn logo.");
    } finally {
      setIsSelectingOption(false);
    }
  };

  // Convert colors with CMYK
  const convertedPalette = useMemo(() => {
    if (!project?.palette) return [];
    return project.palette.map((c) => ({
      ...c,
      converted: convertColor(c.hex)
    }));
  }, [project]);

  const activeMockupLogoSvg = useMemo(() => {
    if (!project) return "";
    const targetId = mockupOptionId || project.selected_logo_id || "opt_1";
    const found = project.logo_options?.find((o) => o.id === targetId);
    return found?.svg || project.logo_svg || "";
  }, [project, mockupOptionId]);

  const primaryColor = convertedPalette.find((c) => c.role.toLowerCase().includes("primary"))?.hex || convertedPalette[0]?.hex || "#3D2B1F";
  const secondaryColor = convertedPalette.find((c) => c.role.toLowerCase().includes("secondary"))?.hex || convertedPalette[1]?.hex || "#9E6B55";
  const neutralColor = convertedPalette.find((c) => c.role.toLowerCase().includes("neutral"))?.hex || "#F4EFEA";
  const accentColor = convertedPalette.find((c) => c.role.toLowerCase().includes("accent"))?.hex || "#5B7065";

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200">
        <div className="relative w-16 h-16 mb-6">
          <div className="w-16 h-16 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-xs font-bold text-amber-300">
            L
          </div>
        </div>
        <p className="text-stone-300 text-sm tracking-widest uppercase font-serif">
          Khởi tạo Pitch Deck Bàn giao Chuẩn 16:9...
        </p>
        <p className="text-stone-500 text-xs mt-1">Lumina Brand Lab • Creative Agency Standard</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200 p-6 text-center">
        <h2 className="text-2xl font-serif font-bold mb-3 text-stone-100">Không tìm thấy hồ sơ thương hiệu</h2>
        <p className="text-stone-400 text-sm max-w-md mb-6">
          Đường dẫn có thể chưa được kích hoạt hoặc chưa hoàn tất phê duyệt tại Bước 4.
        </p>
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-colors"
        >
          Quay lại Bàn làm việc Admin
        </Link>
      </div>
    );
  }

  const slideNames = [
    "Bìa Thương Hiệu",
    "Persona & Story",
    "Bảng Màu (CMYK)",
    "Hệ Thống Typography",
    "Ứng Dụng Thực Tế"
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 selection:bg-amber-500/30 ${
        themeMode === "dark" ? "bg-stone-950 text-stone-100" : "bg-[#F7F4F0] text-stone-900"
      }`}
    >
      {/* =========================================================================
          TOP COMMAND NAVBAR (Agency Delivery Bar)
      ========================================================================= */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors print:hidden ${
          themeMode === "dark"
            ? "bg-stone-950/85 border-stone-850 text-stone-200"
            : "bg-[#F7F4F0]/90 border-amber-900/15 text-stone-850"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand Monogram & Meta */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium ${
                themeMode === "dark" ? "text-stone-400 hover:bg-stone-900 hover:text-stone-200" : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
              title="Quay lại Admin Curation"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            <div className={`h-4 w-[1px] ${themeMode === "dark" ? "bg-stone-800" : "bg-stone-300"}`} />

            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-amber-500 tracking-wider text-base sm:text-lg uppercase">
                {project.brand_name}
              </span>
              <span className="hidden lg:inline text-xs font-mono text-stone-500 tracking-wide">
                [{project.project_id}]
              </span>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Đã Phê Duyệt &amp; Bàn Giao
            </span>
          </div>

          {/* Right Controls: Mode Toggle, Theme, Share & Download PDF */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div
              className={`p-1 rounded-xl flex items-center gap-1 border text-xs font-medium ${
                themeMode === "dark" ? "bg-stone-900 border-stone-800" : "bg-stone-200 border-stone-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode("pitch-deck")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "pitch-deck"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                    : themeMode === "dark"
                    ? "text-stone-400 hover:text-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Pitch Deck 16:9
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editorial")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "editorial"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                    : themeMode === "dark"
                    ? "text-stone-400 hover:text-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Cuộn Toàn Cảnh
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className={`p-2 rounded-xl border transition-colors ${
                themeMode === "dark"
                  ? "bg-stone-900 border-stone-800 text-stone-300 hover:text-amber-400"
                  : "bg-stone-200 border-stone-300 text-stone-700 hover:text-amber-600"
              }`}
              title="Đổi chủ đề Tối / Sáng"
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Share Secret Link */}
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs ${
                themeMode === "dark"
                  ? "bg-stone-900 border-stone-800 text-stone-300 hover:text-amber-400"
                  : "bg-stone-200 border-stone-300 text-stone-700 hover:text-amber-600"
              }`}
              title="Sao chép Link bí mật"
            >
              {copiedText === "link" ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden md:inline font-mono">
                {copiedText === "link" ? "Đã copy!" : "Link bí mật"}
              </span>
            </button>

            {/* NÚT TẢI FILE PDF (YÊU CẦU CHÍNH) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              title="Tải file PDF Pitch Deck chất lượng cao chuẩn 16:9"
            >
              <Download className={`w-4 h-4 ${isDownloadingPdf ? "animate-bounce" : ""}`} />
              <span>{isDownloadingPdf ? "Đang xuất PDF..." : "Tải file PDF (16:9)"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          CONFIDENTIAL CLIENT BANNER
      ========================================================================= */}
      <div
        className={`border-b text-xs py-2 px-4 text-center print:hidden ${
          themeMode === "dark"
            ? "bg-amber-500/5 border-amber-500/20 text-amber-300/90"
            : "bg-amber-100/70 border-amber-900/15 text-amber-900"
        }`}
      >
        <span className="font-semibold uppercase tracking-wider">Hồ sơ bàn giao bảo mật:</span> Dành riêng cho đối tác{" "}
        <strong>{project.client_name}</strong> • Phê duyệt độc quyền bởi Giám đốc Sáng tạo{" "}
        <strong>LUMINA BRAND LAB</strong>
      </div>

      {/* =========================================================================
          MAIN PRESENTATION AREA
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {viewMode === "pitch-deck" ? (
          /* ===================================================================
             PITCH DECK MODE (TỶ LỆ CHUẨN 16:9 SLIDE BY SLIDE)
          =================================================================== */
          <div className="space-y-4">
            {/* Slide Presentation Frame */}
            <div
              ref={presentationContainerRef}
              className={`relative w-full aspect-[16/9] min-h-[440px] max-h-[820px] rounded-3xl overflow-hidden border shadow-2xl transition-all flex flex-col justify-between ${
                themeMode === "dark"
                  ? "bg-stone-900/90 border-stone-800 text-stone-100 shadow-black/60"
                  : "bg-white border-stone-200 text-stone-900 shadow-stone-300/50"
              }`}
            >
              {/* Slide Content Rendered Conditionally */}
              <div className="flex-1 w-full h-full overflow-hidden p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                {currentSlide === 1 && (
                  <Slide1Cover
                    project={project}
                    themeMode={themeMode}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    neutralColor={neutralColor}
                    accentColor={accentColor}
                    onSelectOption={handleSelectOption}
                    isSelectingOption={isSelectingOption}
                  />
                )}
                {currentSlide === 2 && (
                  <Slide2Story
                    project={project}
                    themeMode={themeMode}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                  />
                )}
                {currentSlide === 3 && (
                  <Slide3Colors
                    palette={convertedPalette}
                    themeMode={themeMode}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                    copyToClipboard={copyToClipboard}
                    copiedText={copiedText}
                  />
                )}
                {currentSlide === 4 && (
                  <Slide4Typography
                    project={project}
                    themeMode={themeMode}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                  />
                )}
                {currentSlide === 5 && (
                  <Slide5Mockups
                    project={project}
                    themeMode={themeMode}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    neutralColor={neutralColor}
                    accentColor={accentColor}
                    activeLogoSvg={activeMockupLogoSvg}
                    onSwitchPreviewOption={(id) => setMockupOptionId(id)}
                    previewOptionId={mockupOptionId || project.selected_logo_id || "opt_1"}
                  />
                )}
              </div>

              {/* Slide Meta Footer Bar */}
              <div
                className={`h-11 px-6 sm:px-10 flex items-center justify-between text-[11px] font-mono tracking-wider border-t select-none ${
                  themeMode === "dark"
                    ? "bg-stone-950/80 border-stone-850 text-stone-500"
                    : "bg-stone-100 border-stone-200 text-stone-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="uppercase">
                    {project.brand_name} • PITCH DECK 16:9 • {slideNames[currentSlide - 1]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>TRANG {currentSlide} / {totalSlides}</span>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="hover:text-amber-400 transition-colors p-1"
                    title="Chế độ toàn màn hình"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Slide Controller Navigation Bar */}
            <div
              className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 print:hidden ${
                themeMode === "dark" ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
                  disabled={currentSlide === 1}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    currentSlide === 1
                      ? "opacity-30 cursor-not-allowed text-stone-500"
                      : "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-stone-950"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
                  disabled={currentSlide === totalSlides}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    currentSlide === totalSlides
                      ? "opacity-30 cursor-not-allowed text-stone-500"
                      : "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-stone-950"
                  }`}
                >
                  <span>Trang tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Jump Dots / Thumbnails */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {slideNames.map((name, idx) => {
                  const slideNum = idx + 1;
                  const isActive = currentSlide === slideNum;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(slideNum)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                          : themeMode === "dark"
                          ? "bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                          : "bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                      }`}
                    >
                      <span className="font-mono text-[10px]">{slideNum}.</span>
                      <span className="hidden md:inline">{name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions (Print, Download) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors ${
                    themeMode === "dark"
                      ? "bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200"
                      : "bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900"
                  }`}
                  title="In tài liệu hoặc lưu PDF qua trình duyệt"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">In 16:9</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================
             EDITORIAL SCROLL VIEW (TOÀN BỘ 5 TRANG DÀN TRANG NỐI TIẾP)
          =================================================================== */
          <div className="space-y-12">
            {/* Slide 1 */}
            <div
              className={`w-full aspect-[16/9] min-h-[480px] rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col justify-between ${
                themeMode === "dark" ? "bg-stone-900/90 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <Slide1Cover
                project={project}
                themeMode={themeMode}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                neutralColor={neutralColor}
                accentColor={accentColor}
                onSelectOption={handleSelectOption}
                isSelectingOption={isSelectingOption}
              />
            </div>

            {/* Slide 2 */}
            <div
              className={`w-full aspect-[16/9] min-h-[480px] rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col justify-between ${
                themeMode === "dark" ? "bg-stone-900/90 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <Slide2Story
                project={project}
                themeMode={themeMode}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
              />
            </div>

            {/* Slide 3 */}
            <div
              className={`w-full aspect-[16/9] min-h-[480px] rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col justify-between ${
                themeMode === "dark" ? "bg-stone-900/90 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <Slide3Colors
                palette={convertedPalette}
                themeMode={themeMode}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                copyToClipboard={copyToClipboard}
                copiedText={copiedText}
              />
            </div>

            {/* Slide 4 */}
            <div
              className={`w-full aspect-[16/9] min-h-[480px] rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col justify-between ${
                themeMode === "dark" ? "bg-stone-900/90 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <Slide4Typography
                project={project}
                themeMode={themeMode}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
              />
            </div>

            {/* Slide 5 */}
            <div
              className={`w-full aspect-[16/9] min-h-[480px] rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col justify-between ${
                themeMode === "dark" ? "bg-stone-900/90 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <Slide5Mockups
                project={project}
                themeMode={themeMode}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                neutralColor={neutralColor}
                accentColor={accentColor}
                activeLogoSvg={activeMockupLogoSvg}
                onSwitchPreviewOption={(id) => setMockupOptionId(id)}
                previewOptionId={mockupOptionId || project.selected_logo_id || "opt_1"}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            DOWNLOAD ACTION BANNER FOOTER (Trọn bộ tài sản bàn giao)
        ========================================================================= */}
        <section
          className={`mt-12 p-8 sm:p-10 rounded-3xl border text-center space-y-6 print:hidden ${
            themeMode === "dark"
              ? "bg-gradient-to-b from-stone-900 to-stone-950 border-amber-500/20"
              : "bg-gradient-to-b from-stone-100 to-white border-amber-900/20"
          }`}
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TRỌN BỘ TÀI SẢN BÀN GIAO ĐÃ SẴN SÀNG</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Tải Toàn Bộ Hồ Sơ Thiết Kế Cho {project.brand_name.toUpperCase()}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Bao gồm file PDF Pitch Deck 5 trang tỷ lệ 16:9, bộ vector gốc (SVG) tỷ lệ 1:1 phục vụ in ấn và file PNG 300 DPI nền trong suốt
              {project.delivery_mode === "client_choice" ? " của phương án bạn đã chốt." : "."}
            </p>
            {project.delivery_mode === "client_choice" && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Phương án Master đã chọn: <strong>{project.logo_options?.find(o => o.id === project.selected_logo_id)?.title || project.selected_logo_id}</strong></span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* NÚT TẢI PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isDownloadingPdf ? "Đang tạo file PDF..." : "Tải Pitch Deck PDF (16:9)"}</span>
            </button>

            {/* TẢI SVG GỐC */}
            <a
              href={`/downloads/${project.project_id}/logo_master.svg`}
              download="logo_master.svg"
              className={`px-6 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                themeMode === "dark"
                  ? "bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800"
                  : "bg-white border-stone-300 text-stone-800 hover:bg-stone-50"
              }`}
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>Tải Master Vector (SVG) Đã Chọn</span>
            </a>

            {/* TẢI PNG 300 DPI */}
            <a
              href={`/downloads/${project.project_id}/logo_transparent.png`}
              download="logo_transparent.png"
              className={`px-6 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                themeMode === "dark"
                  ? "bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800"
                  : "bg-white border-stone-300 text-stone-800 hover:bg-stone-50"
              }`}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Tải PNG 300 DPI (Trong Suốt)</span>
            </a>
          </div>

          {/* DÀNH CHO GÓI PRO: TẢI TỪNG OPTION RIÊNG LẺ */}
          {project.delivery_mode === "client_choice" && project.logo_options && project.logo_options.length > 1 && (
            <div className="pt-6 border-t border-stone-850 max-w-xl mx-auto space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block">
                Tải riêng từng concept vector (Đặc quyền Gói Pro):
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {project.logo_options.map((opt, idx) => (
                  <a
                    key={opt.id}
                    href={`/downloads/${project.project_id}/logo_option_${idx + 1}.svg`}
                    download={`logo_option_${idx + 1}.svg`}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-800 bg-stone-950/60 hover:bg-stone-900 text-stone-300 hover:text-amber-400 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Option {idx + 1} SVG</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating Toast Notification when Client selects Option */}
      {selectionToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 backdrop-blur animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-stone-950 shrink-0" />
          <span>{selectionToast}</span>
        </div>
      )}

      {/* CSS For 16:9 Print */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          header,
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// SLIDE 1: BÌA THƯƠNG HIỆU (BRAND COVER SLIDE - 16:9)
// =============================================================================
function Slide1Cover({
  project,
  themeMode,
  primaryColor,
  secondaryColor,
  neutralColor,
  accentColor,
  onSelectOption,
  isSelectingOption
}: {
  project: ProjectRecord;
  themeMode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  neutralColor: string;
  accentColor: string;
  onSelectOption?: (optionId: "opt_1" | "opt_2" | "opt_3") => void;
  isSelectingOption?: boolean;
}) {
  const isClientChoice = project.delivery_mode === "client_choice" && (project.logo_options?.length || 0) > 0;
  const options = project.logo_options || [];

  if (isClientChoice) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between">
        {/* Decorative Outer Border Lines */}
        <div className="absolute inset-0 pointer-events-none border border-amber-500/20 rounded-2xl m-2" />
        <div className="absolute inset-0 pointer-events-none border border-amber-500/10 rounded-xl m-4" />

        {/* Top Header Label */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-amber-400/80 z-10">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LUMINA BRAND LAB • KHÁCH HÀNG THẨM ĐỊNH &amp; LỰA CHỌN PHƯƠNG ÁN (GÓI PRO)
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[10px]">
            DÀNH RIÊNG CHO {project.client_name.toUpperCase()}
          </span>
        </div>

        {/* Sub-header Brand Name */}
        <div className="text-center z-10 pt-1 pb-1">
          <div className="inline-flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight">
              {project.brand_name.toUpperCase()}
            </h1>
            <span className="text-xs font-serif text-amber-400/90 italic hidden sm:inline">
              — &ldquo;{project.tagline}&rdquo;
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Vui lòng xem xét 3 phương án độc lập bên dưới và bấm nút chọn phương án chính thức để hệ thống cập nhật bộ file.
          </p>
        </div>

        {/* 3-Card Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto z-10 items-stretch">
          {options.map((opt, idx) => {
            const isSelected = (project.selected_logo_id || "opt_1") === opt.id;
            return (
              <div
                key={opt.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50"
                    : themeMode === "dark"
                    ? "bg-stone-950/70 border-stone-800 hover:border-amber-500/30"
                    : "bg-white border-stone-200 hover:border-amber-500/30"
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400">
                    CONCEPT 0{idx + 1}
                  </span>
                  {isSelected ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ĐÃ CHỌN
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-500">Đề xuất</span>
                  )}
                </div>

                {/* Option Title */}
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-100 mb-2 line-clamp-1">
                  {opt.title}
                </h3>

                {/* Logo SVG Preview Box */}
                <div
                  className="w-full h-28 sm:h-32 md:h-36 rounded-xl flex items-center justify-center p-2 mb-3 border border-stone-800/60 shadow-inner overflow-hidden transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: neutralColor }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full drop-shadow-sm"
                    dangerouslySetInnerHTML={{ __html: opt.svg }}
                  />
                </div>

                {/* Concept Note */}
                <p className="text-[11px] text-stone-400 leading-relaxed mb-3 line-clamp-3 italic font-serif">
                  &ldquo;{opt.concept_note}&rdquo;
                </p>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectOption?.(opt.id)}
                  disabled={isSelectingOption || isSelected}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500 text-stone-950 shadow-md cursor-default"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95 shadow-lg shadow-amber-500/10 cursor-pointer"
                  } ${isSelectingOption ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Phương Án Đang Được Chọn</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSelectingOption ? "Đang cập nhật..." : "Chọn Phương Án Này Làm Logo Chính Thức"}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Footer Metadata */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-amber-500/20 z-10">
          <div>
            NGÀNH HÀNG: <span className="text-stone-300 font-semibold">{project.industry}</span>
          </div>
          <div>
            CHẾ ĐỘ: <span className="text-amber-400 font-semibold">GÓI PRO (MULTI-CONCEPT CHOICE)</span>
          </div>
          <div className="hidden sm:block">
            MÃ SỐ DỰ ÁN: <span className="text-amber-400 font-semibold">{project.project_id}</span>
          </div>
        </div>
      </div>
    );
  }

  // Chế độ Single Master (Gói Tiêu Chuẩn)
  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Decorative Outer Border Lines */}
      <div className="absolute inset-0 pointer-events-none border border-amber-500/20 rounded-2xl m-2" />
      <div className="absolute inset-0 pointer-events-none border border-amber-500/10 rounded-xl m-4" />

      {/* Top Header Label */}
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-amber-400/80 z-10">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          LUMINA BRAND LAB • CREATIVE AGENCY PRESENTATION
        </span>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[10px]">
          CONFIDENTIAL • DÀNH RIÊNG CHO {project.client_name.toUpperCase()}
        </span>
      </div>

      {/* Center Stage: Typo Logo + Tagline */}
      <div className="my-auto text-center space-y-4 sm:space-y-6 z-10">
        {/* Render Vector Emblem */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mx-auto transition-transform hover:scale-105 duration-300">
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full drop-shadow-xl"
            dangerouslySetInnerHTML={{ __html: project.logo_svg }}
          />
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
            {project.brand_name.toUpperCase()}
          </h1>
          <p className="mt-2 text-base sm:text-xl lg:text-2xl font-serif italic text-amber-400/90 max-w-2xl mx-auto">
            &ldquo;{project.tagline}&rdquo;
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
          BẢN CHỐT CHÍNH THỨC ĐÃ PHÊ DUYỆT BỞI GIÁM ĐỐC SÁNG TẠO
        </div>
      </div>

      {/* Bottom Footer Metadata */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-500 pt-3 border-t border-amber-500/20 z-10">
        <div>
          NGÀNH HÀNG: <span className="text-stone-300 font-semibold">{project.industry}</span>
        </div>
        <div>
          MÃ SỐ DỰ ÁN: <span className="text-amber-400 font-semibold">{project.project_id}</span>
        </div>
        <div className="hidden sm:block">
          CHẾ ĐỘ: <span className="text-stone-300 font-semibold">GÓI TIÊU CHUẨN (SINGLE MASTER)</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SLIDE 2: BRAND PERSONA & STORY (16:9)
// =============================================================================
function Slide2Story({
  project,
  themeMode,
  primaryColor,
  secondaryColor,
  accentColor
}: {
  project: ProjectRecord;
  themeMode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
            01
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide">
              BRAND PERSONA &amp; STORY (CÂU CHUYỆN &amp; TỆP KHÁCH)
            </h2>
            <p className="text-[11px] text-stone-400">Chiến lược định vị bản sắc và phân tích chân dung khách hàng mục tiêu</p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">TRANG 02 / 05</span>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
        {/* Left Column: Brand Story & Values */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            themeMode === "dark" ? "bg-stone-950/70 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div className="space-y-3">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              Câu Chuyện Khởi Nguồn Bản Sắc
            </span>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif italic first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1 first-letter:float-left">
              {project.brand_story}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-stone-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Giá Trị Cốt Lõi (Core Values):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                • Nguyên bản &amp; Chân thật
              </div>
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                • Thủ công &amp; Tỉ mỉ
              </div>
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                • Tĩnh tại &amp; Kết nối sâu
              </div>
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                • Bền vững &amp; Giao hòa
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Target Audience & Persona */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            themeMode === "dark" ? "bg-stone-950/70 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div className="space-y-3">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Chân Dung Khách Hàng Mục Tiêu
            </span>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {project.target_audience}
            </p>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-stone-300 space-y-1">
              <div><strong>Nhân khẩu học:</strong> Độ tuổi 20–38 tuổi, người làm sáng tạo, freelancer, dân văn phòng gu tinh tế.</div>
              <div><strong>Lối sống &amp; Sở thích:</strong> Chuộng sự yên tĩnh, yêu thích cà phê đặc sản mộc, tôn sùng vẻ đẹp tối giản Wabi-sabi.</div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-stone-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Tính Cách Bản Sắc (Style Vibes):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.style_vibes.map((vibe, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-900 border border-amber-500/30 text-amber-300"
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
}

// =============================================================================
// SLIDE 3: BẢNG MÀU NHẬN DIỆN (HEX, RGB, CMYK - 16:9)
// =============================================================================
function Slide3Colors({
  palette,
  themeMode,
  primaryColor,
  secondaryColor,
  accentColor,
  copyToClipboard,
  copiedText
}: {
  palette: any[];
  themeMode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
            02
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide">
              BẢNG MÀU NHẬN DIỆN (HEX, RGB &amp; CMYK)
            </h2>
            <p className="text-[11px] text-stone-400">
              Quy tắc tỷ lệ vàng 60 - 30 - 10, hiển thị đầy đủ thông số in ấn offset và hiển thị số
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">TRANG 03 / 05</span>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 items-stretch">
        {palette.slice(0, 4).map((c, idx) => {
          const conv = c.converted;
          const hexKey = `hex-${idx}`;
          const rgbKey = `rgb-${idx}`;
          const cmykKey = `cmyk-${idx}`;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between group transition-all hover:border-amber-500/50 ${
                themeMode === "dark" ? "bg-stone-950/80 border-stone-800" : "bg-stone-50 border-stone-200"
              }`}
            >
              {/* Large Color Swatch Box */}
              <div
                className="w-full h-24 sm:h-28 rounded-xl relative shadow-inner border border-white/10 flex flex-col justify-between p-2.5 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: c.hex }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      conv.isLight ? "bg-black/70 text-white" : "bg-white/80 text-black"
                    }`}
                  >
                    {c.role}
                  </span>
                </div>
              </div>

              {/* Color Details & Triple Color Codes */}
              <div className="space-y-2 pt-2">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-200 truncate">{c.name}</h4>
                  <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-tight">{c.usage}</p>
                </div>

                <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-stone-800">
                  {/* HEX */}
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="text-stone-500 text-[10px]">HEX:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(conv.hex, hexKey)}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 font-bold"
                    >
                      <span>{conv.hex}</span>
                      {copiedText === hexKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-500" />}
                    </button>
                  </div>

                  {/* RGB */}
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="text-stone-500 text-[10px]">RGB:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(conv.rgb, rgbKey)}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 text-[10px]"
                    >
                      <span>{conv.rgb}</span>
                      {copiedText === rgbKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-500" />}
                    </button>
                  </div>

                  {/* CMYK (YÊU CẦU ĐẶC BIỆT) */}
                  <div className="flex items-center justify-between text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    <span className="text-amber-400/70 text-[10px] font-bold">CMYK:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(conv.cmyk, cmykKey)}
                      className="hover:text-amber-300 transition-colors flex items-center gap-1 text-[10px] font-bold"
                    >
                      <span>{conv.cmyk}</span>
                      {copiedText === cmykKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-500/60" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ratio Proportion Visual Bar */}
      <div className="pt-2">
        <div className="w-full h-2.5 rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: "60%", backgroundColor: palette[0]?.hex || primaryColor }} title="Primary (60%)" />
          <div style={{ width: "25%", backgroundColor: palette[1]?.hex || secondaryColor }} title="Secondary (25%)" />
          <div style={{ width: "10%", backgroundColor: palette[3]?.hex || accentColor }} title="Accent (10%)" />
          <div style={{ width: "5%", backgroundColor: palette[2]?.hex || "#F4EFEA" }} title="Neutral (5%)" />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-1">
          <span>60% Primary (Chủ đạo)</span>
          <span>25% Secondary (Phụ)</span>
          <span>10% Accent (Điểm nhấn)</span>
          <span>5% Canvas</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SLIDE 4: TYPOGRAPHY SYSTEM (ALPHABET SPECIMEN - 16:9)
// =============================================================================
function Slide4Typography({
  project,
  themeMode,
  primaryColor,
  secondaryColor,
  accentColor
}: {
  project: ProjectRecord;
  themeMode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
            03
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide">
              HỆ THỐNG PHÔNG CHỮ &amp; BẢNG CHỮ CÁI MẪU
            </h2>
            <p className="text-[11px] text-stone-400">
              Cặp font đối ứng chuẩn mực trên Google Fonts, tối ưu hoàn hảo cho hiển thị tiếng Việt
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">TRANG 04 / 05</span>
      </div>

      {/* Two Columns: Heading Specimen & Body Specimen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
        {/* Heading Font Column */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            themeMode === "dark" ? "bg-stone-950/70 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Font Tiêu Đề (Heading Display)
              </span>
              <span className="text-[10px] font-mono text-stone-500">Variable Serif</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              {project.typography.heading}
            </h3>
            <p className="text-[11px] text-stone-400">
              Ứng dụng: Tiêu đề lớn, tên logo typography, bìa tạp chí, biển hiệu ngoài trời.
            </p>
          </div>

          {/* BẢNG CHỮ CÁI MẪU (ALPHABET SPECIMEN) */}
          <div className="space-y-2 py-3 border-y border-stone-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80 font-bold">
              Bảng chữ cái mẫu (Alphabet Specimen):
            </span>
            <div className="font-serif text-xs text-stone-300 space-y-1 tracking-wider leading-relaxed">
              <div className="font-bold text-amber-200/90">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
              <div className="text-stone-300">
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </div>
              <div className="font-mono text-amber-400/70 text-[11px]">
                0 1 2 3 4 5 6 7 8 9   &amp; @ # $ % ! ? / ( ) - + =
              </div>
              <div className="text-[11px] text-stone-400 italic">
                À Á Â Ã È É Ê Ì Í Ò Ó Ô Ơ Ù Ú Ư Ỳ Đ à á â ã è é ê ì í ò ó ô ơ ù ú ư ỳ đ
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-stone-400">
            <div className="font-serif text-sm text-stone-200 font-bold">
              &ldquo;Khơi gợi cảm xúc nguyên bản từ chiều sâu nghệ nhân&rdquo;
            </div>
            <div className="text-[11px] text-stone-500">
              Hỗ trợ đầy đủ các trọng lượng: Regular 400, Medium 500, SemiBold 600, Bold 700.
            </div>
          </div>
        </div>

        {/* Body Font Column */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            themeMode === "dark" ? "bg-stone-950/70 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Font Thân Bài (Body &amp; Editorial)
              </span>
              <span className="text-[10px] font-mono text-stone-500">Neo-grotesque Sans</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-stone-100">
              {project.typography.body}
            </h3>
            <p className="text-[11px] text-stone-400">
              Ứng dụng: Đoạn văn nội dung, danh thiếp, bao bì sản phẩm, thực đơn và ứng dụng số.
            </p>
          </div>

          {/* BẢNG CHỮ CÁI MẪU (ALPHABET SPECIMEN) */}
          <div className="space-y-2 py-3 border-y border-stone-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80 font-bold">
              Bảng chữ cái mẫu (Alphabet Specimen):
            </span>
            <div className="font-sans text-xs text-stone-300 space-y-1 tracking-wider leading-relaxed">
              <div className="font-bold text-amber-200/90">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
              <div className="text-stone-300">
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </div>
              <div className="font-mono text-amber-400/70 text-[11px]">
                0 1 2 3 4 5 6 7 8 9   &amp; @ # $ % ! ? / ( ) - + =
              </div>
              <div className="text-[11px] text-stone-400 italic">
                À Á Â Ã È É Ê Ì Í Ò Ó Ô Ơ Ù Ú Ư Ỳ Đ à á â ã è é ê ì í ò ó ô ơ ù ú ư ỳ đ
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-stone-400">
            <div className="text-[11px] text-stone-300 italic">
              {project.typography.pairing_rationale}
            </div>
            <div className="text-[10px] text-stone-500">
              Tối ưu tuyệt đối cho độ đọc trên màn hình điện thoại &amp; in ấn kích thước nhỏ.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SLIDE 5: ỨNG DỤNG THỰC TẾ & MOCKUPS (16:9)
// =============================================================================
function Slide5Mockups({
  project,
  themeMode,
  primaryColor,
  secondaryColor,
  neutralColor,
  accentColor,
  activeLogoSvg,
  onSwitchPreviewOption,
  previewOptionId
}: {
  project: ProjectRecord;
  themeMode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  neutralColor: string;
  accentColor: string;
  activeLogoSvg?: string;
  onSwitchPreviewOption?: (optionId: "opt_1" | "opt_2" | "opt_3") => void;
  previewOptionId?: string;
}) {
  const currentLogo = activeLogoSvg || project.logo_svg;

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
            04
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide">
              ỨNG DỤNG THỰC TẾ &amp; BRAND TOUCHPOINTS (MOCKUPS)
            </h2>
            <p className="text-[11px] text-stone-400">
              Mô phỏng logo và bảng màu nhận diện trên danh thiếp, ly tách, bao bì và biển hiệu thực tế
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">TRANG 05 / 05</span>
      </div>

      {/* Switcher: Xem thử Mockup theo từng Concept (Gói Pro) */}
      {project.delivery_mode === "client_choice" && project.logo_options && project.logo_options.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">Xem thử Mockup theo Concept:</span>
            <span className="text-stone-400 hidden sm:inline text-[11px]">
              (Bấm để đổi nhanh logo hiển thị trên danh thiếp &amp; biển hiệu)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {project.logo_options.map((opt, idx) => {
              const isCurrentMockup = (previewOptionId || project.selected_logo_id) === opt.id;
              const isSelectedMaster = (project.selected_logo_id || "opt_1") === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSwitchPreviewOption?.(opt.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1 ${
                    isCurrentMockup
                      ? "bg-amber-500 text-stone-950 font-bold shadow"
                      : "bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
                  }`}
                >
                  <span>Option 0{idx + 1}</span>
                  {isSelectedMaster && <span className="text-[10px] text-emerald-950 bg-emerald-400/80 px-1 rounded-sm">Chốt</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3 Mockup Touchpoints Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
        {/* 1. MOCKUP DANH THIẾP (NAMECARD) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            themeMode === "dark" ? "bg-stone-950/80 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                01. Danh Thiếp (Namecard)
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono">
                Cotton 380gsm
              </span>
            </div>

            {/* Visual Simulated 3D Business Card */}
            <div className="space-y-2 py-2">
              {/* Front Card */}
              <div
                className="w-full h-20 rounded-xl shadow-lg border border-stone-700/50 p-2.5 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: neutralColor }}
              >
                <div className="text-center">
                  <div
                    className="w-8 h-8 mx-auto [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: currentLogo }}
                  />
                  <div className="font-serif font-bold text-[10px] tracking-wider" style={{ color: primaryColor }}>
                    {project.brand_name.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Back Card */}
              <div
                className="w-full h-16 rounded-xl shadow-lg border border-white/10 p-2.5 flex items-center justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="space-y-0.5 text-[9px] font-mono text-stone-200">
                  <div className="font-bold">{project.client_name}</div>
                  <div className="text-stone-400 text-[8px]">{project.client_phone}</div>
                </div>
                <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-[7px] font-mono text-amber-300">
                  QR
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            {project.mockups?.namecard?.front}
          </p>
        </div>

        {/* 2. MOCKUP BAO BÌ & LY TÁCH (PACKAGING & CUPS) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            themeMode === "dark" ? "bg-stone-950/80 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                02. Ly Tách &amp; Bao Bì Mẫu
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono">
                Kraft PLA Bio
              </span>
            </div>

            {/* Visual Simulated Coffee Cup & Pouch */}
            <div className="w-full h-38 py-3 flex items-center justify-center gap-4">
              {/* Coffee Cup Simulation */}
              <div className="w-16 h-28 bg-stone-800 rounded-b-2xl rounded-t-sm shadow-xl relative flex flex-col items-center justify-center border border-stone-700">
                {/* Cup Lid */}
                <div
                  className="w-18 h-3 rounded-full absolute -top-2 shadow"
                  style={{ backgroundColor: accentColor }}
                />
                {/* Cup Sleeve with Logo */}
                <div
                  className="w-full h-11 shadow-inner flex items-center justify-center p-1"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <span className="text-[8px] font-serif font-bold text-stone-100 truncate">
                    {project.brand_name}
                  </span>
                </div>
              </div>

              {/* Kraft Coffee Bag Simulation */}
              <div
                className="w-24 h-32 rounded-lg shadow-xl p-2 flex flex-col justify-between border"
                style={{ backgroundColor: "#9E6B55" }}
              >
                <div
                  className="w-full h-3 rounded-t-sm text-[7px] text-center font-bold text-white tracking-widest"
                  style={{ backgroundColor: accentColor }}
                >
                  SPECIALTY
                </div>
                <div className="text-center my-auto p-1 bg-white/10 rounded">
                  <div className="text-[9px] font-serif font-bold text-white">
                    {project.brand_name}
                  </div>
                  <div className="text-[7px] font-mono text-stone-200">ARABICA 250G</div>
                </div>
                <div className="text-[6px] font-mono text-white/80 text-center">
                  VAN 1 CHIỀU • RANG MỘC
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            {project.mockups?.packaging?.type}
          </p>
        </div>

        {/* 3. MOCKUP BIỂN HIỆU & KHÔNG GIAN (SIGNAGE & SPACE) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            themeMode === "dark" ? "bg-stone-950/80 border-stone-800" : "bg-stone-50 border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                03. Biển Hiệu &amp; Không Gian
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono">
                Shou Sugi Ban • LED
              </span>
            </div>

            {/* Visual Simulated Signage */}
            <div className="w-full h-38 py-3 flex flex-col items-center justify-center">
              <div
                className="w-full h-24 rounded-xl shadow-2xl p-4 flex flex-col items-center justify-center relative border border-amber-900/30 overflow-hidden"
                style={{ backgroundColor: "#1C1410" }}
              >
                {/* Simulated Warm Backlight Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent pointer-events-none" />
                <div
                  className="w-10 h-10 mb-1 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: currentLogo }}
                />
                <span className="text-sm font-serif font-bold text-amber-300 tracking-widest drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                  {project.brand_name.toUpperCase()}
                </span>
                <span className="text-[8px] font-mono text-stone-400 tracking-wider">
                  SLOW BAR &amp; WORKSPACE
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            {project.mockups?.signage?.description || "Hệ thống chiếu sáng gián tiếp LED vàng ấm 2700K tạo chiều sâu trải nghiệm."}
          </p>
        </div>
      </div>
    </div>
  );
}

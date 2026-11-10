"use client";

import React, { useState } from "react";
import {
  Sun,
  Moon,
  Grid,
  Copy,
  Check,
  Maximize2,
  Sparkles,
  Layers,
  Palette,
  Type,
  Eye,
  QrCode,
  Download,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  FolderOpen,
  Crown
} from "lucide-react";
import { ProjectRecord } from "../../../types/curation";
import { buildImagen3MoodboardPrompt } from "../../../lib/imagenHelper";
import { AssetPickerModal } from "../../AssetPickerModal";
import { LibraryAsset } from "../../../types/library";

interface LivePreviewPanelProps {
  project: ProjectRecord;
  activeOptionId?: "opt_1" | "opt_2" | "opt_3";
  onSelectOption?: (optionId: "opt_1" | "opt_2" | "opt_3") => void;
  onProjectChange?: (updates: Partial<ProjectRecord>) => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  project,
  activeOptionId = "opt_1",
  onSelectOption,
  onProjectChange
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "logo" | "palette" | "typography" | "mockups">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [mockupTimestamp, setMockupTimestamp] = useState<number>(Date.now());
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    type: "mockup" | "moodboard" | "texture" | "all";
    title: string;
  }>({
    isOpen: false,
    type: "mockup",
    title: "Đổi Phôi Ảnh Mockup"
  });

  const handleSelectAsset = (asset: LibraryAsset) => {
    if (!onProjectChange) return;
    if (asset.type === "mockup") {
      onProjectChange({ mockup_url: asset.preview_url });
    } else if (asset.type === "moodboard") {
      onProjectChange({ moodboard_url: asset.preview_url });
    } else {
      onProjectChange({ mockup_url: asset.preview_url });
    }
  };

  const imagenPromptResult = React.useMemo(() => {
    return buildImagen3MoodboardPrompt({
      brandName: project.brand_name,
      industry: project.industry,
      brandStory: project.brand_story,
      targetAudience: project.target_audience,
      colorPalette: project.palette,
      styleVibes: project.style_vibes,
      sceneType: "cafe_interior",
      aspectRatio: "16:9"
    });
  }, [project]);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const currentOption = project.logo_options?.find((o) => o.id === activeOptionId) || project.logo_options?.[0];
  const activeSvg = currentOption?.svg || project.logo_svg;

  const primaryColor = project.palette.find((c) => c.role.toLowerCase().includes("primary"))?.hex || project.palette[0]?.hex || "#3D2B1F";
  const secondaryColor = project.palette.find((c) => c.role.toLowerCase().includes("secondary"))?.hex || project.palette[1]?.hex || "#9E6B55";
  const accentColor = project.palette.find((c) => c.role.toLowerCase().includes("accent"))?.hex || project.palette[2]?.hex || "#5B7065";
  const neutralColor = project.palette.find((c) => c.role.toLowerCase().includes("neutral"))?.hex || project.palette[3]?.hex || "#F4EFEA";

  const headingFont = project.typography?.heading || "Fraunces";
  const bodyFont = project.typography?.body || "Be Vietnam Pro";

  return (
    <div className="h-full flex flex-col bg-stone-925 text-stone-100 overflow-hidden">
      {/* Top Preview Control Bar */}
      <div className="p-3 sm:px-5 sm:py-3.5 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Segmented view modes */}
        <div className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800 text-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-stone-800 text-amber-300 shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Tất Cả
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logo")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "logo"
                ? "bg-stone-800 text-amber-300 shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            1. Logo Master
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("palette")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "palette"
                ? "bg-stone-800 text-amber-300 shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            2. Bảng Màu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("typography")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "typography"
                ? "bg-stone-800 text-amber-300 shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            3. Typography
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mockups")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "mockups"
                ? "bg-stone-800 text-amber-300 shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            4. Mockups
          </button>
        </div>

        {/* 3 Option Switcher Tabs on Canvas Bar */}
        {project.logo_options && project.logo_options.length > 0 && (
          <div className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800 text-xs gap-1">
            {project.logo_options.map((opt, idx) => {
              const isActive = activeOptionId === opt.id;
              const isMaster = project.selected_logo_id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectOption && onSelectOption(opt.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-300 border border-amber-500/50 shadow-sm"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                  title={opt.title}
                >
                  <span>Option {idx + 1}</span>
                  {isMaster && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Bản Chốt" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* View helpers (Light/Dark canvas, Grid, Pitch Deck link) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showGrid
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200"
            }`}
            title="Bật/Tắt lưới thiết kế tỷ lệ vàng"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưới căn chỉnh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isDarkMode
                ? "bg-stone-800 border-stone-700 text-amber-300"
                : "bg-stone-950 border-stone-800 text-stone-300 hover:text-stone-100"
            }`}
            title="Đổi nền sáng/tối để thẩm định độ tương phản"
          >
            {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isDarkMode ? "Nền Tối" : "Nền Sáng Mộc"}</span>
          </button>

          <a
            href={`/p/${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Xem trước Trang Trình bày Proposal 16:9 (Bước 5)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Pitch Deck 16:9</span>
          </a>
        </div>
      </div>

      {/* Main Preview Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
        {/* ========================================================================= */}
        {/* PREVIEW 1: KHUNG HIỂN THỊ LOGO MASTER SẮC NÉT (NỀN TRẮNG & NỀN TỐI) */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "logo") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif font-bold text-sm tracking-wide text-stone-200 uppercase">
                  Logo Master Vector — {currentOption?.title || "Option 1"}
                </h3>
                {project.selected_logo_id === activeOptionId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Crown className="w-3 h-3" />
                    <span>Bản Chốt Chính Thức</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                viewBox=&quot;0 0 500 500&quot;
              </span>
            </div>

            {/* Canvas Container */}
            <div
              className={`relative w-full rounded-2xl p-6 sm:p-10 flex items-center justify-center transition-all duration-300 border shadow-2xl overflow-hidden ${
                isDarkMode
                  ? "bg-stone-950 border-stone-800"
                  : "bg-[#F4EFEA] border-amber-900/15"
              }`}
            >
              {/* Optional Grid overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #9E6B55 1px, transparent 1px), linear-gradient(to bottom, #9E6B55 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                  }}
                />
              )}

              {/* Render dynamic SVG of currently active option */}
              <div
                className="w-full max-w-[420px] aspect-square flex items-center justify-center relative select-none"
                dangerouslySetInnerHTML={{ __html: activeSvg }}
              />
            </div>

            {/* 3-Option Comparison Tray Under Canvas */}
            {project.logo_options && project.logo_options.length === 3 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>So Sánh Nhanh 3 Phương Án Logo Master (Bấm để chuyển đổi):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.logo_options.map((opt, idx) => {
                    const isActive = activeOptionId === opt.id;
                    const isMaster = project.selected_logo_id === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => onSelectOption && onSelectOption(opt.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all space-y-2 group ${
                          isActive
                            ? "bg-stone-900 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30"
                            : "bg-stone-900/60 border-stone-800/80 hover:border-stone-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-400">
                            OPTION {idx + 1}
                          </span>
                          {isMaster ? (
                            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Bản Chốt
                            </span>
                          ) : (
                            <span className="text-[9px] text-stone-500 group-hover:text-amber-300">Xem thử</span>
                          )}
                        </div>

                        <div className="w-full aspect-[4/3] rounded-xl bg-[#F4EFEA] flex items-center justify-center p-2 overflow-hidden border border-amber-900/10">
                          <div
                            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: opt.svg }}
                          />
                        </div>

                        <div className="text-xs font-semibold text-stone-200 line-clamp-1">
                          {opt.title.split(": ")[1] || opt.title}
                        </div>
                        <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">
                          {opt.concept_note}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW 2: BẢNG MÀU THƯƠNG HIỆU (HEX, RGB) */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "palette") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif font-bold text-sm tracking-wide text-stone-200 uppercase">
                  Bảng Màu Nhận Diện (Brand Color Swatches)
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">Quy chuẩn 60 - 30 - 10</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2.5 group hover:border-amber-500/40 transition-colors"
                >
                  <div
                    className="w-full h-16 rounded-lg shadow-inner border border-white/10 relative flex items-end justify-end p-1.5"
                    style={{ backgroundColor: color.hex }}
                  >
                    <button
                      type="button"
                      onClick={() => copyToClipboard(color.hex)}
                      className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      {copiedHex === color.hex ? "Đã copy!" : "Copy"}
                    </button>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {color.role}
                    </div>
                    <div className="text-xs font-semibold text-stone-200 truncate" title={color.name}>
                      {color.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-0.5">
                      <span>{color.hex}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW 3: TYPOGRAPHY SHOWCASE (BẢNG CHỮ CÁI & SỐ) */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "typography") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif font-bold text-sm tracking-wide text-stone-200 uppercase">
                  Typography Showcase (Google Fonts Pair)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heading Font Card */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Heading: {headingFont}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Google Fonts</span>
                </div>
                <div
                  className="text-2xl font-bold text-stone-100 leading-tight"
                  style={{ fontFamily: `'${headingFont}', serif` }}
                >
                  {project.brand_name.toUpperCase()}
                </div>
                <p
                  className="text-xs text-stone-400 tracking-wider leading-relaxed"
                  style={{ fontFamily: `'${headingFont}', serif` }}
                >
                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br />
                  a b c d e f g h i j k l m n o p q r s t u v w x y z<br />
                  0 1 2 3 4 5 6 7 8 9 • ! @ # $ % &amp; *
                </p>
              </div>

              {/* Body Font Card */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Body: {bodyFont}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Google Fonts</span>
                </div>
                <div
                  className="text-sm font-semibold text-stone-200"
                  style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                >
                  &ldquo;{project.tagline}&rdquo;
                </div>
                <p
                  className="text-xs text-stone-400 leading-relaxed line-clamp-3"
                  style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                >
                  {project.brand_story}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW 4: MOCKUP ỨNG DỤNG TRỰC QUAN (DANH THIẾP & BAO BÌ) */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "mockups") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif font-bold text-sm tracking-wide text-stone-200 uppercase">
                  Mockup Ứng Dụng Trực Quan (Áp {currentOption?.id.toUpperCase()})
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">Tự động đồng bộ theo Option đang xem</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 1. Mockup Danh Thiếp (Business Card Front & Back) */}
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Phôi Danh Thiếp Giấy Mỹ Thuật (Front &amp; Back)
                </span>

                <div className="space-y-3">
                  {/* Mặt trước */}
                  <div
                    className="w-full min-h-[190px] rounded-xl p-4 flex flex-col justify-between shadow-lg border border-amber-900/10 relative overflow-hidden"
                    style={{ backgroundColor: neutralColor }}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-stone-400">
                      <span>MẶT TRƯỚC • BLIND EMBOSS</span>
                      <span className="text-[8px] font-mono" style={{ color: accentColor }}>COTTON 380GSM</span>
                    </div>

                    {/* Biểu tượng Logo Vector + Tên thương hiệu + Tagline */}
                    <div className="text-center my-auto py-1 space-y-2">
                      {/* Biểu tượng Logo Vector (Kích thước ~60px - 75px) */}
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 mx-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full drop-shadow-md transition-transform hover:scale-105 duration-300"
                        dangerouslySetInnerHTML={{ __html: currentOption?.svg || project.logo_svg }}
                      />
                      <div className="space-y-0.5">
                        <div
                          className="text-sm sm:text-base font-bold tracking-widest leading-tight uppercase"
                          style={{
                            color: primaryColor,
                            fontFamily: `'${headingFont}', serif`
                          }}
                        >
                          {project.brand_name.toUpperCase()}
                        </div>
                        <div
                          className="text-[9px] uppercase tracking-wider line-clamp-1 italic font-serif"
                          style={{ color: secondaryColor }}
                        >
                          &ldquo;{project.tagline}&rdquo;
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-mono text-stone-400">
                      <span>LUMINA BRAND LAB</span>
                      <span style={{ color: accentColor }}>EST. 2026 • ĐÀ LẠT</span>
                    </div>
                  </div>

                  {/* Mặt sau */}
                  <div
                    className="w-full h-36 rounded-xl p-4 flex justify-between items-end shadow-lg text-white relative overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="space-y-1 text-left">
                      <div className="text-xs font-bold tracking-wider" style={{ color: neutralColor }}>
                        {project.client_name}
                      </div>
                      <div className="text-[10px] text-stone-300">
                        {project.brand_name} Founder
                      </div>
                      <div className="text-[9px] font-mono text-stone-300 pt-1">
                        Hotline: {project.client_phone}<br />
                        Email: {project.client_email}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/20">
                      <QrCode className="w-8 h-8 text-white/90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Mockup Bao Bì Cà Phê Kraft (Packaging) */}
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-3">
                    Bao Bì Túi Giấy Kraft &amp; Tem Niêm Phong
                  </span>

                  <div className="w-full min-h-[340px] rounded-xl bg-gradient-to-b from-[#8C6D58] to-[#5C4033] p-5 sm:p-6 flex flex-col items-center justify-between shadow-2xl border border-stone-700/50 text-center relative overflow-hidden">
                    {/* Tem dán miệng túi */}
                    <div
                      className="px-4 py-1.5 rounded-b-md text-[9px] font-bold uppercase tracking-widest text-white shadow-md"
                      style={{ backgroundColor: accentColor }}
                    >
                      LẮNG NGHE GIÓ KỂ • 100% ARABICA
                    </div>

                    {/* Logo & Nhãn dán giữa túi - Render Vector Logo Symbol */}
                    <div
                      className="w-52 p-4 rounded-xl shadow-xl border border-stone-300 space-y-2 my-auto"
                      style={{ backgroundColor: neutralColor }}
                    >
                      {/* Biểu tượng Logo Vector (Kích thước ~60px) */}
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full drop-shadow-sm"
                        dangerouslySetInnerHTML={{ __html: currentOption?.svg || project.logo_svg }}
                      />
                      <div className="space-y-0.5">
                        <div
                          className="text-sm font-bold tracking-wider leading-tight uppercase"
                          style={{
                            color: primaryColor,
                            fontFamily: `'${headingFont}', serif`
                          }}
                        >
                          {project.brand_name.toUpperCase()}
                        </div>
                        <div
                          className="text-[8.5px] tracking-wide line-clamp-1 italic font-serif"
                          style={{ color: secondaryColor }}
                        >
                          {project.tagline}
                        </div>
                      </div>
                      <div className="w-8 h-[1px] bg-stone-400 mx-auto" />
                      <div className="text-[8px] font-mono text-stone-500">
                        ROASTED IN HIGHLANDS • 250G
                      </div>
                    </div>

                    {/* Đáy túi kraft */}
                    <div className="text-[9px] text-amber-200/80 font-mono tracking-widest">
                      VALVE 1-WAY ECO PACKAGING
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={pickerModal.isOpen}
        onClose={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
        onSelectAsset={handleSelectAsset}
        filterType={pickerModal.type}
        title={pickerModal.title}
      />
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Sparkles,
  Code2,
  Upload,
  RefreshCw,
  RotateCcw,
  Check,
  Palette,
  FileCode,
  Layers,
  Crown,
  CheckCircle2,
  Send,
  HelpCircle,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Shapes,
  Hexagon,
  Circle,
  Diamond,
  Type as TypeIcon,
  Leaf
} from "lucide-react";
import { LogoLayoutConfig, LogoOption, ProjectRecord } from "../../../types/curation";
import { transformLogoSvg } from "../../../lib/svgUtils";

interface TabLogoDesignEditorProps {
  project: ProjectRecord;
  activeOptionId: "opt_1" | "opt_2" | "opt_3";
  onSelectOption: (optionId: "opt_1" | "opt_2" | "opt_3") => void;
  onChange: (updates: Partial<ProjectRecord>) => void;
}

export const TabLogoDesignEditor: React.FC<TabLogoDesignEditorProps> = ({
  project,
  activeOptionId,
  onSelectOption,
  onChange
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"layout" | "ai" | "code">("layout");

  // Options array
  const options = project.logo_options || [];
  const currentOption = options.find((o) => o.id === activeOptionId) || options[0];

  // Layout parameters for the active option
  const layoutConfig: LogoLayoutConfig = currentOption?.settings
    ? {
        layout: currentOption.settings.layout || "stacked",
        iconScale: currentOption.settings.iconScale || 1.0,
        iconPosX: currentOption.settings.iconPosX || 0,
        iconPosY: currentOption.settings.iconPosY || 0,
        iconShape: currentOption.settings.iconShape,
        letterSpacing: currentOption.settings.letterSpacing || 0.16,
        iconColor: currentOption.settings.primaryColor,
        titleColor: currentOption.settings.primaryColor
      }
    : project.logo_layout || {
        layout: "stacked",
        iconScale: 1.0,
        iconPosX: 0,
        iconPosY: 0,
        letterSpacing: 0.16
      };

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // SVG Code editor state
  const [svgCode, setSvgCode] = useState(currentOption?.svg || project.logo_svg || "");
  const [codeAppliedMsg, setCodeAppliedMsg] = useState(false);

  useEffect(() => {
    if (currentOption?.svg) {
      setSvgCode(currentOption.svg);
    }
  }, [currentOption?.svg, activeOptionId]);

  // Update layout of current active option & project
  const updateLayout = (updates: Partial<LogoLayoutConfig>) => {
    const newConfig: LogoLayoutConfig = {
      ...layoutConfig,
      ...updates
    };

    const transformedSvg = transformLogoSvg(
      currentOption?.svg || project.logo_svg,
      newConfig,
      project.palette,
      project.brand_name,
      project.tagline,
      project.typography.heading,
      project.typography.body
    );

    // Update in logo_options array
    const updatedOptions = options.map((opt) => {
      if (opt.id === activeOptionId) {
        return {
          ...opt,
          svg: transformedSvg,
          settings: {
            ...opt.settings,
            iconScale: newConfig.iconScale,
            iconPosX: newConfig.iconPosX,
            iconPosY: newConfig.iconPosY,
            iconShape: newConfig.iconShape,
            letterSpacing: newConfig.letterSpacing,
            layout: newConfig.layout,
            primaryColor: newConfig.titleColor
          }
        };
      }
      return opt;
    });

    const isCurrentMaster = project.selected_logo_id === activeOptionId;

    onChange({
      logo_options: updatedOptions,
      logo_layout: newConfig,
      logo_svg: isCurrentMaster ? transformedSvg : project.logo_svg
    });

    setSvgCode(transformedSvg);
  };

  // Nút di chuyển nhanh vị trí (Arrow buttons)
  const shiftPosition = (dx: number, dy: number) => {
    const currentX = layoutConfig.iconPosX || 0;
    const currentY = layoutConfig.iconPosY || 0;
    updateLayout({
      iconPosX: Math.max(-80, Math.min(80, currentX + dx)),
      iconPosY: Math.max(-80, Math.min(80, currentY + dy))
    });
  };

  // Sync palette from Tab 3 directly into current active option
  const applyPaletteToOption = () => {
    const primaryHex = project.palette.find((c) => c.role.toLowerCase().includes("primary"))?.hex || project.palette[0]?.hex || "#0A84FF";
    const secondaryHex = project.palette.find((c) => c.role.toLowerCase().includes("secondary"))?.hex || project.palette[1]?.hex || "#1C1C1E";
    const accentHex = project.palette.find((c) => c.role.toLowerCase().includes("accent"))?.hex || project.palette[2]?.hex || "#00F2FE";
    const neutralHex = project.palette.find((c) => c.role.toLowerCase().includes("neutral"))?.hex || "#F5F5F7";

    updateLayout({
      iconColor: primaryHex,
      titleColor: primaryHex,
      taglineColor: accentHex,
      bgColor: neutralHex
    });
  };

  // Set this option as the chosen Master Logo
  const handleSetAsMaster = () => {
    const chosen = options.find((o) => o.id === activeOptionId);
    if (!chosen) return;

    onChange({
      selected_logo_id: activeOptionId,
      logo_svg: chosen.svg
    });
  };

  // Switch Delivery Mode
  const handleDeliveryModeChange = (mode: "single" | "client_choice") => {
    onChange({
      delivery_mode: mode,
      order_tier: mode === "client_choice" ? "pro" : "standard"
    });
  };

  // AI Regenerate ONLY this option (Gọi API Gemini 2.5 Flash)
  const handleRegenerateThisOption = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingAi(true);
    setAiSuccessMsg(null);

    try {
      const res = await fetch(`/api/projects/${project.project_id}/ai-variation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          currentSvg: currentOption?.svg || project.logo_svg,
          optionId: activeOptionId
        })
      });

      const data = await res.json();
      if (data.success && data.newSvg) {
        const updatedOptions = options.map((opt) => {
          if (opt.id === activeOptionId) {
            return {
              ...opt,
              svg: data.newSvg,
              title: `${opt.title.split(" (")[0]} (AI Refined)`
            };
          }
          return opt;
        });

        const isCurrentMaster = project.selected_logo_id === activeOptionId;

        onChange({
          logo_options: updatedOptions,
          logo_svg: isCurrentMaster ? data.newSvg : project.logo_svg
        });

        setSvgCode(data.newSvg);
        setAiSuccessMsg(`✓ ${data.rationale || "Đã tái tạo vector thành công!"}`);
      } else {
        alert("Lỗi tái tạo AI: " + (data.error || "Không xác định"));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối khi gọi AI.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Apply Direct SVG Code Edit to current Option
  const handleApplySvgCode = () => {
    if (!svgCode.includes("<svg") || !svgCode.includes("</svg>")) {
      alert("Mã SVG không hợp lệ. Vui lòng kiểm tra thẻ <svg>...</svg>");
      return;
    }

    const updatedOptions = options.map((opt) => {
      if (opt.id === activeOptionId) {
        return { ...opt, svg: svgCode };
      }
      return opt;
    });

    const isCurrentMaster = project.selected_logo_id === activeOptionId;

    onChange({
      logo_options: updatedOptions,
      logo_svg: isCurrentMaster ? svgCode : project.logo_svg
    });

    setCodeAppliedMsg(true);
    setTimeout(() => setCodeAppliedMsg(false), 2500);
  };

  // Upload SVG from Figma / Illustrator for this option
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      alert("Vui lòng chọn file định dạng vector .svg");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.includes("<svg")) {
        const updatedOptions = options.map((opt) => {
          if (opt.id === activeOptionId) {
            return { ...opt, svg: content };
          }
          return opt;
        });

        const isCurrentMaster = project.selected_logo_id === activeOptionId;

        onChange({
          logo_options: updatedOptions,
          logo_svg: isCurrentMaster ? content : project.logo_svg
        });

        setSvgCode(content);
        alert(`Đã nạp file vector "${file.name}" vào ${currentOption?.title}.`);
      } else {
        alert("Nội dung file không chứa cấu trúc vector SVG hợp lệ.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Tab 4 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Bộ Công Cụ Thiết Kế Logo Master</span>
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
            3 Options Master
          </span>
        </div>
        <p className="text-xs text-stone-400">
          Chuyển đổi giữa 3 phương án để so sánh, can thiệp vị trí X/Y, hình dáng hình học, kích thước và màu sắc.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3 OPTION SWITCHER TABS TRỰC QUAN */}
      {/* ========================================================================= */}
      <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-300 uppercase tracking-wider text-[11px]">
            Chọn Option Để Biên Tập &amp; Can Thiệp:
          </span>
          {project.selected_logo_id === activeOptionId && (
            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Bản Chốt Hiện Tại</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = opt.id === activeOptionId;
            const isMaster = project.selected_logo_id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/80 text-amber-200 shadow-md ring-1 ring-amber-500/30"
                    : "bg-stone-950/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase">
                    {opt.id.replace("_", " ")}
                  </span>
                  {isMaster && <Crown className="w-3 h-3 text-amber-400" />}
                </div>
                <div className="text-xs font-semibold mt-1 truncate text-stone-100">
                  {opt.title.split(":")[1]?.trim() || opt.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action set as Master */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-stone-400">
            Đang biên tập: <strong className="text-stone-200">{currentOption?.title}</strong>
          </span>
          {project.selected_logo_id !== activeOptionId && (
            <button
              type="button"
              onClick={handleSetAsMaster}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>Đặt Option này làm Bản Chốt Master</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BẢNG ĐIỀU KHIỂN CHẾ ĐỘ BÀN GIAO (DELIVERY CONFIGURATION) */}
      {/* ========================================================================= */}
      <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Cấu Hình Chế Độ Bàn Giao Khách Hàng</span>
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
            {project.delivery_mode === "client_choice" ? "Gói Pro" : "Gói Standard"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Radio 1: Single Master Delivery */}
          <label
            onClick={() => handleDeliveryModeChange("single")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              project.delivery_mode === "single"
                ? "bg-stone-800/90 border-amber-500/60 text-stone-100 shadow-md ring-1 ring-amber-500/20"
                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
            }`}
          >
            <input
              type="radio"
              name="delivery_mode"
              checked={project.delivery_mode === "single"}
              onChange={() => handleDeliveryModeChange("single")}
              className="mt-1 accent-amber-500 cursor-pointer"
            />
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-200">
                Gói Tiêu Chuẩn (Bản Chốt Duy Nhất)
              </div>
              <p className="text-[10.5px] text-stone-400 leading-relaxed">
                Bạn chọn 1 Option xuất sắc nhất ({project.selected_logo_id?.toUpperCase()}). Khách mở Proposal sẽ nhận bản chốt duy nhất.
              </p>
            </div>
          </label>

          {/* Radio 2: Multi-Concept Client Choice (Gói Pro) */}
          <label
            onClick={() => handleDeliveryModeChange("client_choice")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              project.delivery_mode === "client_choice"
                ? "bg-amber-500/10 border-amber-500/60 text-stone-100 shadow-md ring-1 ring-amber-500/20"
                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
            }`}
          >
            <input
              type="radio"
              name="delivery_mode"
              checked={project.delivery_mode === "client_choice"}
              onChange={() => handleDeliveryModeChange("client_choice")}
              className="mt-1 accent-amber-500 cursor-pointer"
            />
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300">
                Gói Chuyên Nghiệp (Khách Tự Chọn 1 Trong 3)
              </div>
              <p className="text-[10.5px] text-stone-400 leading-relaxed">
                Proposal hiển thị lưới so sánh cả 3 Option. Khách hàng tự do bấm chọn 1 trong 3 trước khi tải bộ file.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Sub-tabs Switcher */}
      <div className="flex p-1 rounded-xl bg-stone-950 border border-stone-800 gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab("layout")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === "layout"
              ? "bg-stone-800 text-amber-300 shadow-sm border border-stone-700"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>a. Bố Cục &amp; Hình Học</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("ai")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === "ai"
              ? "bg-stone-800 text-amber-300 shadow-sm border border-stone-700"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>b. AI Gemini Flash</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("code")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === "code"
              ? "bg-stone-800 text-amber-300 shadow-sm border border-stone-700"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>c. Code &amp; Upload</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PHƯƠNG THỨC A: BỐ CỤC & CAN THIỆP HÌNH HỌC CHO ADMIN */}
      {/* ========================================================================= */}
      {activeSubTab === "layout" && (
        <div className="space-y-5 animate-fadeIn">
          {/* 1. Chọn kiểu hiển thị bố cục */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 block">
              1. Bố Cục Hiển Thị ({currentOption?.title})
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateLayout({ layout: "stacked" })}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  layoutConfig.layout === "stacked"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-semibold shadow-md shadow-amber-500/10"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700 flex flex-col items-center justify-center gap-1 p-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-5 h-1 rounded bg-stone-300" />
                </div>
                <div>
                  <div className="text-xs font-bold">Biểu Tượng Trên</div>
                  <div className="text-[10px] text-stone-400">Chữ ở dưới (Cân đối tâm)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateLayout({ layout: "horizontal" })}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  layoutConfig.layout === "horizontal"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-semibold shadow-md shadow-amber-500/10"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center gap-1 p-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="w-4 h-1 rounded bg-stone-300" />
                    <div className="w-3 h-0.5 rounded bg-stone-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold">Biểu Tượng Trái</div>
                  <div className="text-[10px] text-stone-400">Chữ ở phải (Bố cục ngang)</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. BỘ CHỈNH VỊ TRÍ BIỂU TƯỢNG (ICON POSITION CONTROLS) */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Move className="w-4 h-4" />
                <span>2. Vị Trí Biểu Tượng (Tọa Độ X, Y)</span>
              </label>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-300 border border-stone-800">
                  X: {layoutConfig.iconPosX ? `${layoutConfig.iconPosX > 0 ? "+" : ""}${layoutConfig.iconPosX}px` : "0px"}
                </span>
                <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-300 border border-stone-800">
                  Y: {layoutConfig.iconPosY ? `${layoutConfig.iconPosY > 0 ? "+" : ""}${layoutConfig.iconPosY}px` : "0px"}
                </span>
              </div>
            </div>

            {/* Slider Tọa độ Dọc (Y-Offset: Lên / Xuống) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-300">
                <span>Tọa độ Dọc (Lên / Xuống):</span>
                <span className="font-mono text-amber-300">
                  {layoutConfig.iconPosY || 0} px
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={layoutConfig.iconPosY || 0}
                onChange={(e) => updateLayout({ iconPosY: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>Lên trên (-50px)</span>
                <span>Tâm chuẩn (0px)</span>
                <span>Xuống dưới (+50px)</span>
              </div>
            </div>

            {/* Slider Tọa độ Ngang (X-Offset: Trái / Phải) */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
              <div className="flex justify-between text-xs text-stone-300">
                <span>Tọa độ Ngang (Trái / Phải):</span>
                <span className="font-mono text-amber-300">
                  {layoutConfig.iconPosX || 0} px
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={layoutConfig.iconPosX || 0}
                onChange={(e) => updateLayout({ iconPosX: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>Sang trái (-50px)</span>
                <span>Tâm chuẩn (0px)</span>
                <span>Sang phải (+50px)</span>
              </div>
            </div>

            {/* 5 Nút Căn Nhanh */}
            <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-stone-400 font-medium">Căn chỉnh nhanh:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftPosition(0, -10)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
                  title="Di chuyển lên 10px"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>Lên</span>
                </button>
                <button
                  type="button"
                  onClick={() => shiftPosition(0, 10)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
                  title="Di chuyển xuống 10px"
                >
                  <ArrowDown className="w-3 h-3" />
                  <span>Xuống</span>
                </button>
                <button
                  type="button"
                  onClick={() => shiftPosition(-10, 0)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
                  title="Di chuyển sang trái 10px"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Trái</span>
                </button>
                <button
                  type="button"
                  onClick={() => shiftPosition(10, 0)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
                  title="Di chuyển sang phải 10px"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Phải</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateLayout({ iconPosX: 0, iconPosY: 0 })}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
                  title="Đặt lại về tọa độ 0,0"
                >
                  🎯 Căn Giữa
                </button>
              </div>
            </div>
          </div>

          {/* 3. BỘ CHỈNH KÍCH THƯỚC BIỂU TƯỢNG (ICON SIZE / SCALE 50% - 200%) */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Maximize className="w-4 h-4" />
                <span>3. Kích Thước Biểu Tượng (50% — 200%)</span>
              </label>
              <span className="font-mono text-amber-300 text-xs font-bold px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                {Math.round((layoutConfig.iconScale || 1.0) * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={layoutConfig.iconScale || 1.0}
              onChange={(e) => updateLayout({ iconScale: parseFloat(e.target.value) })}
              className="w-full h-2 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>50% (Nhỏ gọn)</span>
              <span>100% (Chuẩn)</span>
              <span>150% (Ấn tượng)</span>
              <span>200% (Cực đại)</span>
            </div>

            {/* Quick scale pills */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0.6, 0.8, 1.0, 1.25, 1.5, 1.8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateLayout({ iconScale: s })}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-colors ${
                    Math.abs((layoutConfig.iconScale || 1.0) - s) < 0.03
                      ? "bg-amber-400 text-stone-950 font-bold"
                      : "bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          </div>

          {/* 4. BỘ CHỌN HÌNH DÁNG / CẤU TẠO BIỂU TƯỢNG (ICON SHAPE ARCHETYPE SWITCHER) */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Shapes className="w-4 h-4" />
                <span>4. Cấu Tạo Hình Dáng Biểu Tượng (Archetypes)</span>
              </label>
              <span className="text-[10px] text-stone-400">Đổi ngay không cần vẽ lại</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bấm chọn nhanh cấu tạo hình học để áp tức thì lên Live Canvas:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateLayout({ iconShape: "tech" })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  layoutConfig.iconShape === "tech"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-bold shadow-md ring-1 ring-amber-500/20"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white"
                }`}
              >
                <Hexagon className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">⬡ Khối Đa Giác Công Nghệ</div>
                  <div className="text-[10px] text-stone-400">Vi mạch số / Hexagon Mesh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateLayout({ iconShape: "circle" })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  layoutConfig.iconShape === "circle"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-bold shadow-md ring-1 ring-amber-500/20"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white"
                }`}
              >
                <Circle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">◯ Khối Tròn Tối Giản</div>
                  <div className="text-[10px] text-stone-400">Minimal Eclipse / Quỹ đạo</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateLayout({ iconShape: "luxury" })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  layoutConfig.iconShape === "luxury"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-bold shadow-md ring-1 ring-amber-500/20"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white"
                }`}
              >
                <Diamond className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">◈ Khối Kim Cương Sang Trọng</div>
                  <div className="text-[10px] text-stone-400">Luxury Rhombus Prism</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateLayout({ iconShape: "monogram" })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  layoutConfig.iconShape === "monogram"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-bold shadow-md ring-1 ring-amber-500/20"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white"
                }`}
              >
                <TypeIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">🔤 Chữ Lồng Monogram</div>
                  <div className="text-[10px] text-stone-400">Ký tự '{project.brand_name.trim().charAt(0).toUpperCase()}' cách điệu</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateLayout({ iconShape: "organic" })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all sm:col-span-2 ${
                  layoutConfig.iconShape === "organic"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-200 font-bold shadow-md ring-1 ring-amber-500/20"
                    : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white"
                }`}
              >
                <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">🌿 Khối Hữu Cơ Tự Nhiên</div>
                  <div className="text-[10px] text-stone-400">Botanical Curve / Mầm cây &amp; Làn sóng thiên nhiên</div>
                </div>
              </button>
            </div>
          </div>

          {/* 5. Khoảng cách ký tự chữ (Letter Spacing) */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 block">
                5. Khoảng Cách Ký Tự Chữ (Letter Spacing)
              </label>
              <span className="font-mono text-amber-300 font-bold text-xs">
                {(layoutConfig.letterSpacing || 0.16).toFixed(2)} em
              </span>
            </div>

            <input
              type="range"
              min="0.0"
              max="0.45"
              step="0.02"
              value={layoutConfig.letterSpacing || 0.16}
              onChange={(e) => updateLayout({ letterSpacing: parseFloat(e.target.value) })}
              className="w-full h-2 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>Khít (0.00em)</span>
              <span>Thoáng chuẩn (0.16em)</span>
              <span>Rộng sang trọng (0.45em)</span>
            </div>
          </div>

          {/* 6. Nút áp nhanh bảng màu Tab 3 */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>6. Đồng Bộ Bảng Màu Vào {currentOption?.id.toUpperCase()}</span>
              </label>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tự động áp các mã màu đã chọn ở Tab 3 vào biểu tượng vector, tên thương hiệu, khẩu hiệu và màu canvas của Option đang chọn.
            </p>

            <button
              type="button"
              onClick={applyPaletteToOption}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-850 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Áp Bảng màu Tab 3 lên riêng {currentOption?.title}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHƯƠNG THỨC B: TÁI TẠO RIÊNG OPTION BẰNG AI GEMINI FLASH */}
      {/* ========================================================================= */}
      {activeSubTab === "ai" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Gemini 2.5 Flash — Tái Tạo Riêng {currentOption?.id.toUpperCase()}</span>
              </label>
              <span className="text-[10px] text-stone-400">Giữ nguyên các option khác</span>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={`Nhập yêu cầu AI vẽ lại riêng cho ${currentOption?.id.toUpperCase()}: ví dụ "Đổi biểu tượng sang hình lập phương công nghệ 3D, làm nét dày hơn", "Vẽ vi mạch số phát sáng", "Làm nét mỏng thanh lịch"...`}
                className="w-full p-3.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-200 text-xs leading-relaxed outline-none transition-all placeholder-stone-600"
              />
            </div>

            {/* Quick Prompt suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400">Lệnh gợi ý theo ngành nghề:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Đổi biểu tượng sang hình lập phương công nghệ 3D, làm nét dày hơn",
                  "Vẽ vi mạch số đa giác công nghệ cao",
                  "Làm cho đường nét thanh mảnh tối giản",
                  "Khối kim cương ánh kim Champagne quý phái",
                  "Cánh hoa lụa mềm mại chuẩn Quiet Luxury"
                ].map((txt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiPrompt(txt);
                      handleRegenerateThisOption(txt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-200 transition-colors text-left"
                  >
                    + {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              disabled={isGeneratingAi || !aiPrompt.trim()}
              onClick={() => handleRegenerateThisOption()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Gemini 2.5 Flash Đang Tạo Mã Vector Mới...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Gọi AI Gemini 2.5 Flash Tái Tạo Riêng Option Này</span>
                </>
              )}
            </button>

            {aiSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{aiSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHƯƠNG THỨC C: TRÌNH CAN THIỆP MÃ NGUỒN SVG & UPLOAD */}
      {/* ========================================================================= */}
      {activeSubTab === "code" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Upload SVG box */}
          <div className="bg-stone-900/70 rounded-2xl p-4 border border-stone-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Nạp File Vector SVG Từ Máy Tính / Figma</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Thay thế trực tiếp mã nguồn của {currentOption?.title} bằng file thiết kế của bạn.
              </div>
            </div>
            <label className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold cursor-pointer shrink-0 transition-colors">
              <span>Chọn File .SVG</span>
              <input
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct Code Editor */}
          <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                <span>Trình Soạn Thảo XML / SVG Trực Tiếp</span>
              </label>
              <span className="font-mono text-[10px] text-stone-500">viewBox="0 0 500 500"</span>
            </div>

            <textarea
              rows={12}
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 focus:border-amber-500 outline-none leading-relaxed custom-scrollbar resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              {codeAppliedMsg ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã áp dụng mã SVG thành công!</span>
                </span>
              ) : (
                <span className="text-[11px] text-stone-500">Mã cập nhật ngay vào Live Preview.</span>
              )}

              <button
                type="button"
                onClick={handleApplySvgCode}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Áp Dụng Mã SVG Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

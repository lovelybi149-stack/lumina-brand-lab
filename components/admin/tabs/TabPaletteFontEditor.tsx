"use client";

import React from "react";
import { Palette, Type, Check, Sparkles, Sliders } from "lucide-react";
import { ColorItem, ProjectRecord, TypographyConfig } from "../../../types/curation";

interface TabPaletteFontEditorProps {
  project: ProjectRecord;
  onChange: (updates: Partial<ProjectRecord>) => void;
}

const GOOGLE_HEADING_FONTS = [
  { name: "Fraunces", category: "Organic Serif Wabi-sabi", preview: "Fraunces Elegance" },
  { name: "Playfair Display", category: "Classic Editorial Serif", preview: "Playfair Display" },
  { name: "Syne", category: "Bold Display Avant-garde", preview: "SYNE DISPLAY" },
  { name: "Cormorant Garamond", category: "Haute Couture Luxury", preview: "Cormorant Luxury" },
  { name: "Cinzel", category: "Architectural Roman Antiqua", preview: "CINZEL ANTIQUA" },
  { name: "Montserrat", category: "Clean Geometric Modern", preview: "MONTSERRAT" },
  { name: "Plus Jakarta Sans", category: "Contemporary Neo-grotesque", preview: "Plus Jakarta Sans" },
  { name: "Be Vietnam Pro", category: "Optimized Vietnamese Sans", preview: "Be Vietnam Pro" },
  { name: "Oswald", category: "Impact Industrial Condensed", preview: "OSWALD CONDENSED" },
  { name: "Prata", category: "Didone Fashion Editorial", preview: "Prata Classic" },
  { name: "Lora", category: "Literary Contemporary Serif", preview: "Lora Contemporary" }
];

const GOOGLE_BODY_FONTS = [
  { name: "Be Vietnam Pro", category: "Tối ưu tiếng Việt sắc nét", preview: "Be Vietnam Pro Regular" },
  { name: "Plus Jakarta Sans", category: "Hình học cân đối hiện đại", preview: "Plus Jakarta Sans" },
  { name: "Montserrat", category: "Đa năng chuẩn quốc tế", preview: "Montserrat Text" },
  { name: "Inter", category: "Chuẩn mực kỹ thuật số", preview: "Inter System" },
  { name: "Roboto", category: "Thanh thoát dễ đọc", preview: "Roboto Body" },
  { name: "Lato", category: "Mềm mại trang nhã", preview: "Lato Sans" }
];

const PRESET_PALETTES = [
  {
    name: "Wabi-sabi Highland (Đà Lạt Mộc)",
    primary: { hex: "#3D2B1F", name: "Nâu Vỏ Thông Già" },
    secondary: { hex: "#9E6B55", name: "Đất Đỏ Bazan Mờ" },
    accent: { hex: "#5B7065", name: "Xanh Thông Núi Mờ" },
    neutral: { hex: "#F4EFEA", name: "Trắng Giấy Dó Mộc" }
  },
  {
    name: "Quiet Luxury Noir (Tối Giản Sang Trọng)",
    primary: { hex: "#141415", name: "Deep Obsidian Noir" },
    secondary: { hex: "#7E7F83", name: "Mineral Slate Grey" },
    accent: { hex: "#C2A676", name: "Brushed Champagne Gold" },
    neutral: { hex: "#FAF9F6", name: "Chalk Linen White" }
  },
  {
    name: "Nordic Modern Forest (Bắc Âu)",
    primary: { hex: "#1B3B2B", name: "Thông Xanh Trầm" },
    secondary: { hex: "#52796F", name: "Xanh Rêu Hồ Sương" },
    accent: { hex: "#D8A48F", name: "Đất Sét Hồng Mờ" },
    neutral: { hex: "#F8F9FA", name: "Trắng Bắc Cực" }
  },
  {
    name: "Modern Artisan Coffee (Mộc Bắc Âu)",
    primary: { hex: "#2E1E1A", name: "Dark Espresso" },
    secondary: { hex: "#9C6644", name: "Terra Cotta Ấm" },
    accent: { hex: "#DDB892", name: "Warm Sand Vàng Mơ" },
    neutral: { hex: "#EDE0D4", name: "Sữa Hạt Yến Mạch" }
  }
];

export const TabPaletteFontEditor: React.FC<TabPaletteFontEditorProps> = ({
  project,
  onChange
}) => {
  const palette = project.palette || [];
  const typography = project.typography || {
    heading: "Fraunces",
    body: "Be Vietnam Pro"
  };

  const updateColor = (index: number, newHex: string, newName?: string) => {
    const updated = [...palette];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        hex: newHex,
        name: newName || updated[index].name
      };
      onChange({ palette: updated });
    }
  };

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    const updated: ColorItem[] = [
      { role: "Primary", name: preset.primary.name, hex: preset.primary.hex },
      { role: "Secondary", name: preset.secondary.name, hex: preset.secondary.hex },
      { role: "Accent", name: preset.accent.name, hex: preset.accent.hex },
      { role: "Neutral", name: preset.neutral.name, hex: preset.neutral.hex }
    ];
    onChange({ palette: updated });
  };

  const updateHeadingFont = (heading: string) => {
    onChange({
      typography: {
        ...typography,
        heading
      }
    });
  };

  const updateBodyFont = (body: string) => {
    onChange({
      typography: {
        ...typography,
        body
      }
    });
  };

  // Find 3 core colors
  const primaryColor = palette.find((c) => c.role.toLowerCase().includes("primary") || c.role.toLowerCase().includes("chủ đạo")) || palette[0] || { hex: "#3D2B1F", name: "Màu chủ đạo" };
  const secondaryColor = palette.find((c) => c.role.toLowerCase().includes("secondary") || c.role.toLowerCase().includes("phụ")) || palette[1] || { hex: "#9E6B55", name: "Màu phụ" };
  const accentColor = palette.find((c) => c.role.toLowerCase().includes("accent") || c.role.toLowerCase().includes("nhấn")) || palette[2] || { hex: "#5B7065", name: "Màu điểm nhấn" };
  const neutralColor = palette.find((c) => c.role.toLowerCase().includes("neutral") || c.role.toLowerCase().includes("nền")) || palette[3] || { hex: "#F4EFEA", name: "Màu nền canvas" };

  return (
    <div className="space-y-6 text-stone-200">
      {/* 1. Direct Visual Color Picker (3 core colors + Canvas) */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Bảng Màu Trực Quan (Color Picker &amp; Mã HEX)
          </label>
          <span className="text-[11px] text-stone-400">Click ô màu để chọn trực tiếp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Color */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-amber-400">
                1. Màu Chủ Đạo (Primary)
              </span>
              <span className="text-[10px] text-stone-400">60% Tỷ lệ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor.hex}
                  onChange={(e) => updateColor(0, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-sm flex items-center justify-center text-xs"
                  style={{ backgroundColor: primaryColor.hex }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={primaryColor.hex}
                  onChange={(e) => updateColor(0, e.target.value)}
                  className="w-full px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-md font-mono text-xs uppercase text-stone-100"
                />
                <input
                  type="text"
                  value={primaryColor.name}
                  onChange={(e) => updateColor(0, primaryColor.hex, e.target.value)}
                  placeholder="Tên nghệ thuật..."
                  className="w-full px-2 py-0.5 bg-transparent text-[11px] text-stone-400 border-b border-transparent focus:border-stone-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-amber-400">
                2. Màu Phụ (Secondary)
              </span>
              <span className="text-[10px] text-stone-400">30% Tỷ lệ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={secondaryColor.hex}
                  onChange={(e) => updateColor(1, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-sm flex items-center justify-center text-xs"
                  style={{ backgroundColor: secondaryColor.hex }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={secondaryColor.hex}
                  onChange={(e) => updateColor(1, e.target.value)}
                  className="w-full px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-md font-mono text-xs uppercase text-stone-100"
                />
                <input
                  type="text"
                  value={secondaryColor.name}
                  onChange={(e) => updateColor(1, secondaryColor.hex, e.target.value)}
                  placeholder="Tên nghệ thuật..."
                  className="w-full px-2 py-0.5 bg-transparent text-[11px] text-stone-400 border-b border-transparent focus:border-stone-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-amber-400">
                3. Màu Điểm Nhấn (Accent)
              </span>
              <span className="text-[10px] text-stone-400">10% Tỷ lệ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={accentColor.hex}
                  onChange={(e) => updateColor(2, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-sm flex items-center justify-center text-xs"
                  style={{ backgroundColor: accentColor.hex }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={accentColor.hex}
                  onChange={(e) => updateColor(2, e.target.value)}
                  className="w-full px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-md font-mono text-xs uppercase text-stone-100"
                />
                <input
                  type="text"
                  value={accentColor.name}
                  onChange={(e) => updateColor(2, accentColor.hex, e.target.value)}
                  placeholder="Tên nghệ thuật..."
                  className="w-full px-2 py-0.5 bg-transparent text-[11px] text-stone-400 border-b border-transparent focus:border-stone-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Neutral Background Color */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-stone-300">
                4. Màu Nền Canvas (Neutral)
              </span>
              <span className="text-[10px] text-stone-400">Nền phôi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={neutralColor.hex}
                  onChange={(e) => updateColor(3, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-stone-700 shadow-sm flex items-center justify-center text-xs"
                  style={{ backgroundColor: neutralColor.hex }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={neutralColor.hex}
                  onChange={(e) => updateColor(3, e.target.value)}
                  className="w-full px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-md font-mono text-xs uppercase text-stone-100"
                />
                <input
                  type="text"
                  value={neutralColor.name}
                  onChange={(e) => updateColor(3, neutralColor.hex, e.target.value)}
                  placeholder="Tên nghệ thuật..."
                  className="w-full px-2 py-0.5 bg-transparent text-[11px] text-stone-400 border-b border-transparent focus:border-stone-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preset Palettes */}
        <div className="pt-2 border-t border-stone-800/80 space-y-2">
          <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Bảng màu chuẩn tuyển chọn (Bấm áp dụng nhanh trọn bộ 4 màu):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PALETTES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="text-xs text-stone-300 font-medium group-hover:text-amber-200">
                  {p.name}
                </div>
                <div className="flex items-center -space-x-1.5">
                  <div className="w-4 h-4 rounded-full border border-stone-800" style={{ backgroundColor: p.primary.hex }} />
                  <div className="w-4 h-4 rounded-full border border-stone-800" style={{ backgroundColor: p.secondary.hex }} />
                  <div className="w-4 h-4 rounded-full border border-stone-800" style={{ backgroundColor: p.accent.hex }} />
                  <div className="w-4 h-4 rounded-full border border-stone-800" style={{ backgroundColor: p.neutral.hex }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Typography Dropdowns (Google Fonts) */}
      <div className="bg-stone-900/70 rounded-2xl p-5 border border-stone-800 space-y-4">
        <label className="text-xs uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Hệ Thống Phông Chữ (Google Fonts Thẩm Mỹ)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Heading Font */}
          <div className="space-y-2">
            <label className="text-xs text-stone-400 block">Font Tiêu Đề (Heading Font):</label>
            <select
              value={typography.heading}
              onChange={(e) => updateHeadingFont(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 outline-none"
            >
              {GOOGLE_HEADING_FONTS.map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name} — {font.category}
                </option>
              ))}
            </select>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 text-stone-300">
              <span className="text-[10px] text-amber-400/80 block uppercase tracking-wider mb-1">
                Xem trước phông tiêu đề:
              </span>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: `'${typography.heading}', serif` }}
              >
                {project.brand_name.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Body Font */}
          <div className="space-y-2">
            <label className="text-xs text-stone-400 block">Font Thân Bài (Body Font):</label>
            <select
              value={typography.body}
              onChange={(e) => updateBodyFont(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 outline-none"
            >
              {GOOGLE_BODY_FONTS.map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name} — {font.category}
                </option>
              ))}
            </select>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 text-stone-300">
              <span className="text-[10px] text-amber-400/80 block uppercase tracking-wider mb-1">
                Xem trước phông thân bài:
              </span>
              <p
                className="text-xs leading-relaxed text-stone-300"
                style={{ fontFamily: `'${typography.body}', sans-serif` }}
              >
                Aa Bb Cc Dd Ee Gg Hh 0123456789. Tối ưu hoàn hảo cho hiển thị tiếng Việt có dấu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


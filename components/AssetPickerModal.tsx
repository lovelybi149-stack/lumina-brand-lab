"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Check,
  Sparkles,
  Layers,
  Palette,
  Image as ImageIcon,
  ExternalLink,
  Filter,
  CheckCircle2,
  FolderOpen,
  ArrowRight
} from "lucide-react";
import { LibraryAsset, AssetType } from "../types/library";

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (asset: LibraryAsset) => void;
  onSelectAsset?: (asset: LibraryAsset) => void;
  title?: string;
  initialType?: AssetType;
  filterType?: AssetType;
  targetIndustry?: string;
  currentSelectedUrl?: string;
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectAsset,
  title = "Chọn Tài Sản Từ Kho Thư Viện Lumina",
  initialType = "all",
  filterType,
  targetIndustry,
  currentSelectedUrl
}) => {
  const effectiveSelect = onSelect || onSelectAsset || (() => {});
  const effectiveInitialType = filterType || initialType;
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<AssetType>(initialType);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<LibraryAsset | null>(null);

  // Sync initial type when opened
  useEffect(() => {
    if (isOpen) {
      setActiveType(initialType);
      fetchAssets();
    }
  }, [isOpen, initialType]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/library?tab=curated");
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setAssets(data.assets);
      }
    } catch (err) {
      console.error("Lỗi nạp assets cho modal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Unique industries
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      a.industry?.forEach((ind) => {
        if (ind && ind.toLowerCase() !== "all") {
          set.add(ind);
        }
      });
    });
    return Array.from(set);
  }, [assets]);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Type match
      if (activeType !== "all" && asset.type !== activeType) {
        return false;
      }
      // Industry match
      if (selectedIndustry !== "all") {
        const matchesInd = asset.industry?.some(
          (i) => i.toLowerCase() === "all" || i.toLowerCase().includes(selectedIndustry.toLowerCase())
        );
        if (!matchesInd) return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = asset.title.toLowerCase().includes(q);
        const matchCat = asset.category.toLowerCase().includes(q);
        const matchTag = asset.style_tags?.some((t) => t.toLowerCase().includes(q));
        const matchInd = asset.industry?.some((i) => i.toLowerCase().includes(q));
        if (!matchTitle && !matchCat && !matchTag && !matchInd) return false;
      }
      return true;
    });
  }, [assets, activeType, selectedIndustry, searchQuery]);

  if (!isOpen) return null;

  const handleConfirmSelect = () => {
    if (selectedAsset) {
      effectiveSelect(selectedAsset);
      onClose();
    }
  };

  const isCurrentUrl = (url: string) => {
    if (!currentSelectedUrl) return false;
    return currentSelectedUrl.includes(url) || url.includes(currentSelectedUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-100 tracking-wide">
                  {title}
                </h3>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Lumina DAM
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Chọn phôi sản phẩm hoặc cảm hứng moodboard từ kho số hóa để áp dụng ngay vào dự án
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 bg-stone-950/40 border-b border-stone-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveType("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeType === "all"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-transparent"
              }`}
            >
              Tất Cả ({assets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveType("mockup")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                activeType === "mockup"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Phôi Mockup ({assets.filter((a) => a.type === "mockup").length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType("moodboard")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                activeType === "moodboard"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Moodboard ({assets.filter((a) => a.type === "moodboard").length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType("texture")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                activeType === "texture"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Textures ({assets.filter((a) => a.type === "texture").length})</span>
            </button>
          </div>

          {/* Search & Industry */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm phôi, tên, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="all">Mọi ngành</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assets Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[360px] max-h-[55vh]">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-stone-400">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <span className="text-xs">Đang mở kho lưu trữ Lumina DAM...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-800 rounded-2xl">
              <ImageIcon className="w-10 h-10 text-stone-600 mb-2" />
              <div className="text-sm font-semibold text-stone-300">Không tìm thấy tài sản phù hợp</div>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm &ldquo;Tất Cả&rdquo; để xem đầy đủ kho phôi
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const isCurrent = isCurrentUrl(asset.preview_url);

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 flex flex-col bg-stone-950 ${
                      isSelected
                        ? "border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10 scale-[1.02]"
                        : isCurrent
                        ? "border-emerald-500/60 ring-1 ring-emerald-500/30"
                        : "border-stone-800 hover:border-stone-700 hover:shadow-md"
                    }`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                      <img
                        src={asset.preview_url}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Badges Overlay */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md text-stone-200 border border-stone-800">
                          {asset.category}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                            Đang dùng
                          </span>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md animate-scale-in">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Overlay Coordinates chip for mockups */}
                      {asset.overlay_coordinates && (
                        <div className="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-stone-300">
                          {asset.overlay_coordinates.width}×{asset.overlay_coordinates.height}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {asset.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-400">
                          <span>{asset.dimensions || "Chuẩn Studio"}</span>
                          <span>•</span>
                          <span className="truncate">{asset.industry?.[0] || "Đa ngành"}</span>
                        </div>
                      </div>

                      {/* Style tags */}
                      {asset.style_tags && asset.style_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {asset.style_tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-stone-800 bg-stone-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-400 truncate max-w-md">
            {selectedAsset ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-200 font-semibold truncate">
                  {selectedAsset.title}
                </span>
                <span className="text-stone-500 font-mono text-[11px]">
                  ({selectedAsset.preview_url})
                </span>
              </div>
            ) : (
              <span>Chọn một ảnh từ danh sách để áp dụng cho dự án</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirmSelect}
              disabled={!selectedAsset}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedAsset
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md shadow-amber-500/20 cursor-pointer"
                  : "bg-stone-800 text-stone-500 cursor-not-allowed"
              }`}
            >
              <span>Áp Dụng Cho Dự Án</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

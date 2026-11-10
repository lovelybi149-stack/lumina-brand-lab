"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Palette,
  ExternalLink,
  Upload,
  Eye,
  FileText,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Archive,
  RefreshCw,
  ChevronRight,
  Grid,
  Info
} from "lucide-react";
import { StudioNavbar } from "../../components/StudioNavbar";
import { StudioFooter } from "../../components/StudioFooter";
import { LibraryAsset, GeneratedProjectArchive, AssetType } from "../../types/library";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"curated" | "generated">("curated");
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [projects, setProjects] = useState<GeneratedProjectArchive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [activeType, setActiveType] = useState<AssetType>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & UI States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [detailAsset, setDetailAsset] = useState<LibraryAsset | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "mockup" as "mockup" | "moodboard" | "texture",
    category: "Stationery",
    industry: "F&B / Ẩm thực",
    style_tags: "",
    overlay_x: "370",
    overlay_y: "250",
    overlay_w: "860",
    overlay_h: "500",
    file: null as File | null
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label = "đường dẫn") => {
    const fullUrl = text.startsWith("http") ? text : window.location.origin + text;
    navigator.clipboard.writeText(fullUrl);
    showToast(`✓ Đã sao chép ${label}: ${text}`);
  };

  const fetchLibraryData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/library?tab=all");
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error("Lỗi nạp thư viện:", e);
      showToast("Lỗi kết nối khi tải kho thư viện");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  // Distinct industries
  const industryList = [
    { id: "all", label: "Tất Cả Ngành" },
    { id: "F&B", label: "F&B / Ẩm Thực" },
    { id: "Thời trang", label: "Thời Trang & May Mặc" },
    { id: "Công nghệ", label: "Công Nghệ & Số Hóa" },
    { id: "Doanh nghiệp", label: "Doanh Nghiệp & Dịch Vụ" }
  ];

  // Filtered Curated Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Type
      if (activeType !== "all" && asset.type !== activeType) return false;
      // Industry
      if (selectedIndustry !== "all") {
        const matches = asset.industry?.some(
          (ind) => ind.toLowerCase() === "all" || ind.toLowerCase().includes(selectedIndustry.toLowerCase())
        );
        if (!matches) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = asset.title.toLowerCase().includes(q);
        const mCat = asset.category.toLowerCase().includes(q);
        const mTags = asset.style_tags?.some((t) => t.toLowerCase().includes(q));
        const mInd = asset.industry?.some((i) => i.toLowerCase().includes(q));
        if (!mTitle && !mCat && !mTags && !mInd) return false;
      }
      return true;
    });
  }, [assets, activeType, selectedIndustry, searchQuery]);

  // Filtered Generated Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedIndustry !== "all") {
        if (!project.industry.toLowerCase().includes(selectedIndustry.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mBrand = project.brand_name.toLowerCase().includes(q);
        const mClient = project.client_name.toLowerCase().includes(q);
        const mId = project.project_id.toLowerCase().includes(q);
        const mTagline = project.tagline.toLowerCase().includes(q);
        const mInd = project.industry.toLowerCase().includes(q);
        if (!mBrand && !mClient && !mId && !mTagline && !mInd) return false;
      }
      return true;
    });
  }, [projects, selectedIndustry, searchQuery]);

  // Handle Upload Submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert("Vui lòng chọn một file ảnh từ máy tính.");
      return;
    }

    setIsSubmittingUpload(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("type", uploadForm.type);
      formData.append("category", uploadForm.category);
      formData.append("industry", uploadForm.industry);
      formData.append("style_tags", uploadForm.style_tags);

      if (uploadForm.type === "mockup") {
        formData.append(
          "overlay_coordinates",
          JSON.stringify({
            x: parseInt(uploadForm.overlay_x) || 370,
            y: parseInt(uploadForm.overlay_y) || 250,
            width: parseInt(uploadForm.overlay_w) || 860,
            height: parseInt(uploadForm.overlay_h) || 500
          })
        );
      }

      const res = await fetch("/api/library", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showToast("✓ Đã tải tài sản mới lên kho thư viện thành công!");
        setIsUploadModalOpen(false);
        setUploadForm({
          title: "",
          type: "mockup",
          category: "Stationery",
          industry: "F&B / Ẩm thực",
          style_tags: "",
          overlay_x: "370",
          overlay_y: "250",
          overlay_w: "860",
          overlay_h: "500",
          file: null
        });
        fetchLibraryData();
      } else {
        alert("Lỗi tải lên: " + (data.error || "Không xác định"));
      }
    } catch (err) {
      alert("Lỗi kết nối khi tải ảnh lên kho.");
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // Download all files for a project
  const handleDownloadAllProjectFiles = (project: GeneratedProjectArchive) => {
    const filesToDownload = [
      { url: project.files.svg_url, name: `${project.project_id}_logo_master.svg` },
      { url: project.files.png_url, name: `${project.project_id}_logo_transparent.png` },
      { url: project.files.mockup_url, name: `${project.project_id}_mockup_namecard.png` },
      { url: project.files.pdf_url, name: `${project.project_id}_brand_guideline.pdf` }
    ].filter((f) => Boolean(f.url));

    if (filesToDownload.length === 0) {
      alert("Chưa có file nào sẵn sàng để tải.");
      return;
    }

    // Trigger sequential download
    filesToDownload.forEach((file, index) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 400);
    });

    showToast(`✓ Đang tải trọn bộ ${filesToDownload.length} file của ${project.brand_name}!`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30">
      {/* Studio Navbar */}
      <StudioNavbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900/95 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              LUMINA BRAND LAB
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-amber-400 font-semibold">KHO MẪU NHẬN DIỆN THƯƠNG HIỆU</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-stone-800">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                <Archive className="w-3.5 h-3.5" />
                <span>Kho Thư Viện Mẫu Nhận Diện Chuẩn Studio</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-100">
                LUMINA <span className="text-amber-400">KHO MẪU NHẬN DIỆN</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
                Kho lưu trữ trung tâm các phôi sản phẩm sạch (Mockups), textures chất liệu tự nhiên, bảng cảm hứng (Moodboards) theo ngành hàng và trọn bộ thành phẩm nhận diện thương hiệu đã xuất bản.
              </p>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>Tải Thêm Ảnh Vào Kho</span>
              </button>

              <Link
                href="/review"
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Tra Cứu &amp; Duyệt Mẫu</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Phôi Sạch 300 DPI
              </div>
              <div className="text-2xl font-bold font-serif text-stone-100 mt-1">
                {assets.filter((a) => a.type === "mockup").length} Phôi
              </div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">Danh thiếp, ly sứ, túi kraft...</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Moodboards Cảm Hứng
              </div>
              <div className="text-2xl font-bold font-serif text-stone-100 mt-1">
                {assets.filter((a) => a.type === "moodboard").length} Bảng
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">F&B Coffee, Fashion, Tech...</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Textures Chất Liệu
              </div>
              <div className="text-2xl font-bold font-serif text-stone-100 mt-1">
                {assets.filter((a) => a.type === "texture").length} Mẫu
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">Kraft, Linen dệt, Gỗ trầm...</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/60 border border-amber-500/20 bg-amber-500/[0.03]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                Dự Án Đã Xuất Bản
              </div>
              <div className="text-2xl font-bold font-serif text-amber-300 mt-1">
                {projects.length} Thương Hiệu
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">Trọn bộ SVG + PNG + PDF</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* I. CHUYỂN ĐỔI 2 TAB LỚN */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-3">
            {/* Segmented Big Tabs */}
            <div className="flex items-center p-1.5 rounded-2xl bg-stone-900 border border-stone-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("curated")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                  activeTab === "curated"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>[Tab 1] Kho Phôi & Cảm Hứng Thiết Kế</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    activeTab === "curated"
                      ? "bg-stone-950/20 text-stone-900 font-bold"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  {assets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("generated")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                  activeTab === "generated"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>[Tab 2] Kho Thành Phẩm Dự Án Đã Xuất Bản</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    activeTab === "generated"
                      ? "bg-stone-950/20 text-stone-900 font-bold"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  {projects.length}
                </span>
              </button>
            </div>

            {/* Quick Refresh */}
            <button
              type="button"
              onClick={fetchLibraryData}
              className="self-end sm:self-auto p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1.5 transition-colors"
              title="Làm mới kho tài sản"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* II. BỘ LỌC NHANH (FILTER CHIPS & SEARCH) */}
          {/* ========================================================================= */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            {/* Filter Category & Industry Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Chips for Tab 1 */}
              {activeTab === "curated" && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveType("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activeType === "all"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "bg-stone-800/80 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Tất Cả Thể Loại
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveType("mockup")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeType === "mockup"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "bg-stone-800/80 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mockup Phôi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveType("moodboard")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeType === "moodboard"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "bg-stone-800/80 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Moodboard Cảm Hứng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveType("texture")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeType === "texture"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "bg-stone-800/80 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Texture Chất Liệu</span>
                  </button>
                  <div className="h-5 w-[1px] bg-stone-700 mx-1 hidden sm:block" />
                </>
              )}

              {/* Industry Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1 hidden sm:inline">
                  Ngành:
                </span>
                {industryList.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      selectedIndustry === ind.id
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                        : "bg-stone-800/50 text-stone-400 hover:text-stone-300 border border-stone-800"
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === "curated"
                    ? "Tìm phôi, tên ảnh, phong cách..."
                    : "Tìm theo tên thương hiệu, mã dự án..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* III. HIỂN THỊ NỘI DUNG THEO TAB */}
          {/* ========================================================================= */}

          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-3 text-stone-400">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <span className="text-sm font-medium">Đang đồng bộ kho dữ liệu Lumina DAM...</span>
            </div>
          ) : activeTab === "curated" ? (
            /* ========================================================================= */
            /* TAB 1: KHO PHÔI & CẢM HỨNG THIẾT KẾ (CURATED ASSETS) */
            /* ========================================================================= */
            <div>
              {filteredAssets.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-stone-800 bg-stone-900/30">
                  <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <div className="text-base font-semibold text-stone-300">Không tìm thấy tài sản nào</div>
                  <p className="text-xs text-stone-500 mt-1">
                    Thử chọn &ldquo;Tất Cả Thể Loại&rdquo; hoặc xóa từ khóa tìm kiếm.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/90 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer">
                        <img
                          src={asset.preview_url}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Category & Format Badges (Always visible top) */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border ${
                              asset.type === "mockup"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : asset.type === "texture"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                            }`}
                          >
                            {asset.type}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-950/80 text-stone-300 border border-stone-800">
                            {asset.category}
                          </span>
                        </div>

                        {/* Overlay Hover Details & Quick Action Buttons */}
                        <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20">
                          {/* Top part on hover */}
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-stone-100 line-clamp-2">
                              {asset.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400">
                              <span>{asset.dimensions || "300 DPI"}</span>
                              <span>•</span>
                              <span>{asset.file_format || "Raster"}</span>
                            </div>

                            {/* Overlay coordinates if mockup */}
                            {asset.overlay_coordinates && (
                              <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 inline-block">
                                Vùng phôi: {asset.overlay_coordinates.width} × {asset.overlay_coordinates.height} px
                              </div>
                            )}
                          </div>

                          {/* Action Buttons on Hover */}
                          <div className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Nút Tải Về */}
                              <a
                                href={asset.preview_url}
                                download
                                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Tải Về</span>
                              </a>

                              {/* Nút Sao Chép Đường Dẫn */}
                              <button
                                type="button"
                                onClick={() => copyToClipboard(asset.preview_url, "đường dẫn phôi")}
                                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-700 transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao Chép</span>
                              </button>
                            </div>

                            {/* Xem Chi Tiết Lightbox */}
                            <button
                              type="button"
                              onClick={() => setDetailAsset(asset)}
                              className="w-full py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-[11px] text-stone-300 flex items-center justify-center gap-1 border border-stone-800 transition-colors"
                            >
                              <Maximize2 className="w-3 h-3 text-amber-400" />
                              <span>Xem Thông Số & Tọa Độ</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Meta (Always Visible) */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                        <div>
                          <h3 className="text-xs font-semibold text-stone-200 line-clamp-1 group-hover:text-amber-300 transition-colors">
                            {asset.title}
                          </h3>
                          <div className="text-[11px] text-stone-400 mt-0.5 truncate">
                            {asset.industry?.join(", ") || "Đa ngành"}
                          </div>
                        </div>

                        {/* Style tags */}
                        {asset.style_tags && asset.style_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {asset.style_tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-950 text-stone-400 border border-stone-800/80"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* TAB 2: KHO THÀNH PHẨM DỰ ÁN ĐÃ XUẤT BẢN (CLIENT BRAND ARCHIVE) */
            /* ========================================================================= */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    Kho Lưu Trữ Nhận Diện Dự Án Đã Xuất Bản
                  </h3>
                  <p className="text-xs text-stone-400">
                    Mỗi dự án bao gồm Vector Master (SVG), PNG trong suốt 300 DPI, Mockup danh thiếp thực tế và Cẩm nang Brand Guideline (PDF).
                  </p>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-stone-800 bg-stone-900/30">
                  <Archive className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <div className="text-base font-semibold text-stone-300">Không tìm thấy dự án phù hợp</div>
                  <p className="text-xs text-stone-500 mt-1">
                    Vui lòng kiểm tra lại bộ lọc ngành hoặc từ khóa tìm kiếm.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.project_id}
                      className="group rounded-3xl bg-stone-900 border border-stone-800/90 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Top Mockup Preview with Project ID Badge */}
                      <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
                        <img
                          src={project.preview_mockup_url}
                          alt={project.brand_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                            {project.project_id}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border ${
                              project.status === "Approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            }`}
                          >
                            {project.status === "Approved" ? "Đã Phê Duyệt" : "Chờ Duyệt"}
                          </span>
                        </div>

                        {/* Proposal Link Pill */}
                        {project.proposal_url && (
                          <Link
                            href={project.proposal_url}
                            className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md text-stone-300 hover:text-white border border-stone-800 flex items-center gap-1 transition-colors"
                          >
                            <span>Xem Proposal</span>
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                          </Link>
                        )}
                      </div>

                      {/* Project Meta Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                                {project.brand_name}
                              </h3>
                              <p className="text-xs text-amber-400/90 font-medium italic mt-0.5">
                                &ldquo;{project.tagline}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-stone-400 space-y-0.5 pt-1">
                            <div>
                              <span className="text-stone-500">Khách hàng:</span>{" "}
                              <span className="text-stone-300 font-medium">{project.client_name}</span>
                            </div>
                            <div>
                              <span className="text-stone-500">Ngành:</span>{" "}
                              <span className="text-stone-300">{project.industry}</span>
                            </div>
                          </div>

                          {/* Color Palette Swatches */}
                          {project.palette && project.palette.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1.5">
                                Bảng Màu Nhận Diện:
                              </span>
                              <div className="flex items-center gap-1.5">
                                {project.palette.map((c, i) => (
                                  <div
                                    key={i}
                                    className="group/color relative w-6 h-6 rounded-md border border-stone-700/60 shadow-sm cursor-pointer"
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => copyToClipboard(c.hex, `mã màu ${c.name}`)}
                                    title={`${c.name} (${c.hex})`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Package Files Breakdown & Actions */}
                        <div className="space-y-3 pt-3 border-t border-stone-800/80">
                          {/* File Checklist */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {/* 1. logo_master.svg */}
                            <a
                              href={project.files.svg_url}
                              download={`${project.project_id}_logo_master.svg`}
                              className={`p-2 rounded-xl flex items-center justify-between border transition-colors ${
                                project.files.svg_url
                                  ? "bg-stone-950/60 border-stone-800 hover:border-amber-500/40 text-stone-300"
                                  : "bg-stone-950/20 border-stone-900 text-stone-600 pointer-events-none"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate">Vector Master</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase text-stone-500">SVG</span>
                            </a>

                            {/* 2. logo_transparent.png */}
                            <a
                              href={project.files.png_url}
                              download={`${project.project_id}_logo_transparent.png`}
                              className={`p-2 rounded-xl flex items-center justify-between border transition-colors ${
                                project.files.png_url
                                  ? "bg-stone-950/60 border-stone-800 hover:border-amber-500/40 text-stone-300"
                                  : "bg-stone-950/20 border-stone-900 text-stone-600 pointer-events-none"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <ImageIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span className="truncate">300 DPI Nền Trong</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase text-stone-500">PNG</span>
                            </a>

                            {/* 3. mockup_namecard.png */}
                            <a
                              href={project.files.mockup_url}
                              download={`${project.project_id}_mockup_namecard.png`}
                              className={`p-2 rounded-xl flex items-center justify-between border transition-colors ${
                                project.files.mockup_url
                                  ? "bg-stone-950/60 border-stone-800 hover:border-amber-500/40 text-stone-300"
                                  : "bg-stone-950/20 border-stone-900 text-stone-600 pointer-events-none"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">Phôi Danh Thiếp</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase text-stone-500">PNG</span>
                            </a>

                            {/* 4. brand_guideline.pdf */}
                            <a
                              href={project.files.pdf_url}
                              download={`${project.project_id}_brand_guideline.pdf`}
                              className={`p-2 rounded-xl flex items-center justify-between border transition-colors ${
                                project.files.pdf_url
                                  ? "bg-stone-950/60 border-stone-800 hover:border-amber-500/40 text-stone-300"
                                  : "bg-stone-950/20 border-stone-900 text-stone-600 pointer-events-none"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span className="truncate">Cẩm Nang 5 Trang</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase text-stone-500">PDF</span>
                            </a>
                          </div>

                          {/* Primary CTA: Tải trọn bộ [SVG + PNG + PDF] */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDownloadAllProjectFiles(project)}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                            >
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>Tải Trọn Bộ [SVG + PNG + PDF]</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  project.proposal_url || `/generated/${project.project_id}`,
                                  `link dự án ${project.brand_name}`
                                )
                              }
                              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
                              title="Sao chép link gói dự án"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* IV. MODAL XEM CHI TIẾT ASSET (LIGHTBOX & SPECS) */}
      {/* ========================================================================= */}
      {detailAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailAsset(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  {detailAsset.type} • {detailAsset.category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                  {detailAsset.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailAsset(null)}
                className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image & Specs */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                <img
                  src={detailAsset.preview_url}
                  alt={detailAsset.title}
                  className="w-full h-auto max-h-[50vh] object-contain"
                />
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-amber-400 tracking-wider font-semibold">
                    Thông Số Kỹ Thuật Phôi
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block">Kích thước:</span>
                      <span className="text-stone-200 font-mono font-medium">
                        {detailAsset.dimensions || "1600 × 1000 px"}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Định dạng file:</span>
                      <span className="text-stone-200 font-mono font-medium">
                        {detailAsset.file_format || "PNG (300 DPI)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Ngành áp dụng:</span>
                      <span className="text-stone-200">
                        {detailAsset.industry?.join(", ") || "Đa ngành"}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Vị trí lưu trữ:</span>
                      <span className="text-stone-300 font-mono text-[11px] truncate block">
                        {detailAsset.preview_url}
                      </span>
                    </div>
                  </div>

                  {/* Overlay Coordinates */}
                  {detailAsset.overlay_coordinates && (
                    <div className="pt-2 border-t border-stone-800">
                      <span className="text-[11px] text-stone-400 block mb-1">
                        Tọa độ ghép Logo (Bounding Box):
                      </span>
                      <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono text-amber-300">
                        X: {detailAsset.overlay_coordinates.x} | Y: {detailAsset.overlay_coordinates.y} | W:{" "}
                        {detailAsset.overlay_coordinates.width}px | H:{" "}
                        {detailAsset.overlay_coordinates.height}px
                      </div>
                    </div>
                  )}
                </div>

                {/* Style tags */}
                {detailAsset.style_tags && (
                  <div>
                    <span className="text-xs text-stone-500 block mb-1.5">Style Vibes / Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailAsset.style_tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs border border-stone-700"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code usage snippet */}
                <div>
                  <span className="text-xs text-stone-500 block mb-1.5">Mã nhúng mẫu (Next.js / HTML):</span>
                  <pre className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-300 overflow-x-auto">
                    {`<img src="${detailAsset.preview_url}" alt="${detailAsset.title}" />`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(detailAsset.preview_url, "đường dẫn ảnh")}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép URL</span>
              </button>

              <a
                href={detailAsset.preview_url}
                download
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tải File Về Máy</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* V. MODAL TẢI THÊM ẢNH MỚI VÀO KHO (UPLOAD NEW ASSET) */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:px-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    Tải Thêm Ảnh Vào Kho Thư Viện
                  </h3>
                  <p className="text-xs text-stone-400">
                    Lưu trữ ảnh vào thư mục /public/library/ và cập nhật siêu dữ liệu tìm kiếm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUploadSubmit} className="p-4 sm:p-6 space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  File ảnh tải lên (PNG, JPG, SVG):
                </label>
                <div className="border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-2xl p-6 text-center bg-stone-950/60 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadForm((prev) => ({
                        ...prev,
                        file,
                        title: prev.title || file?.name.replace(/\.[^/.]+$/, "") || ""
                      }));
                    }}
                    className="hidden"
                    id="asset-file-input"
                  />
                  <label htmlFor="asset-file-input" className="cursor-pointer block space-y-2">
                    <ImageIcon className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-xs text-stone-300 font-medium">
                      {uploadForm.file ? (
                        <span className="text-amber-300 font-semibold">{uploadForm.file.name}</span>
                      ) : (
                        <span>Nhấp để chọn file ảnh từ máy tính</span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Hỗ trợ PNG chất lượng cao 300 DPI, JPG hoặc SVG vector
                    </p>
                  </label>
                </div>
              </div>

              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1">
                    Tên Asset / Tiêu đề:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phôi Hộp Cứng Ép Kim"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1">
                    Phân hệ Thể loại:
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e: any) => setUploadForm({ ...uploadForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="mockup">Mockup Phôi Sản Phẩm</option>
                    <option value="moodboard">Moodboard Cảm Hứng</option>
                    <option value="texture">Texture Chất Liệu</option>
                  </select>
                </div>
              </div>

              {/* Category & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1">
                    Danh mục (Category):
                  </label>
                  <input
                    type="text"
                    placeholder="Stationery, Packaging, Signage..."
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1">
                    Ngành hàng mục tiêu:
                  </label>
                  <input
                    type="text"
                    placeholder="F&B / Ẩm thực, Thời trang, Công nghệ..."
                    value={uploadForm.industry}
                    onChange={(e) => setUploadForm({ ...uploadForm, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Style tags */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  Style Tags (phân cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="Rustic, Minimalist, Wabi-sabi, Luxury..."
                  value={uploadForm.style_tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, style_tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* If mockup: Coordinates input */}
              {uploadForm.type === "mockup" && (
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold block">
                    Tọa Độ Vùng Ghép Logo (Overlay Coordinates):
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500">X (px):</span>
                      <input
                        type="number"
                        value={uploadForm.overlay_x}
                        onChange={(e) => setUploadForm({ ...uploadForm, overlay_x: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Y (px):</span>
                      <input
                        type="number"
                        value={uploadForm.overlay_y}
                        onChange={(e) => setUploadForm({ ...uploadForm, overlay_y: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Width (px):</span>
                      <input
                        type="number"
                        value={uploadForm.overlay_w}
                        onChange={(e) => setUploadForm({ ...uploadForm, overlay_w: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Height (px):</span>
                      <input
                        type="number"
                        value={uploadForm.overlay_h}
                        onChange={(e) => setUploadForm({ ...uploadForm, overlay_h: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingUpload && <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />}
                  <span>{isSubmittingUpload ? "Đang Tải Lên..." : "Tải Lên Kho"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Studio Footer */}
      <StudioFooter />
    </div>
  );
}

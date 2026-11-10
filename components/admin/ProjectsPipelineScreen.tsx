"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Building2,
  Bell,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { ProjectRecord, ProjectStatus } from "../../types/curation";

interface ProjectsPipelineScreenProps {
  projects: ProjectRecord[];
  onOpenWorkspace: (project: ProjectRecord) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  onLogout?: () => void;
}

type FilterType = "All" | "Revising" | "Pending" | "Reviewing" | "Completed";

export const ProjectsPipelineScreen: React.FC<ProjectsPipelineScreenProps> = ({
  projects,
  onOpenWorkspace,
  onRefresh,
  isLoading = false,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(5);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter: FilterType) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  // 1. Lọc theo từ khóa tìm kiếm & trạng thái tab
  const filteredProjects = (projects || []).filter((p) => {
    if (!p) return false;
    const id = p.project_id || "";
    const brand = p.brand_name || "";
    const client = p.client_name || "";
    const phone = p.client_phone || "";
    const industry = p.industry || "";

    const matchesSearch =
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      industry.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "All") return true;
    if (statusFilter === "Revising") return p.status === "Admin_Revising" || !!p.has_unread_feedback;
    if (statusFilter === "Pending") return p.status === "Pending" || p.status === "Draft";
    if (statusFilter === "Reviewing")
      return (
        p.status === "Client_Reviewing" ||
        p.status === "Waiting_Client_Final_Approval" ||
        p.status === "Awaiting_Payment"
      );
    if (statusFilter === "Completed") return p.status === "Completed" || p.status === "Approved";

    return true;
  });

  // 2. SẮP XẾP CHUẨN: Đơn mới nhất trên cùng (LUMINA-05 -> 04 -> 01), đơn cũ nhất dưới cùng
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const numA = parseInt((a.project_id?.match(/\d+/) || ["0"])[0], 10);
    const numB = parseInt((b.project_id?.match(/\d+/) || ["0"])[0], 10);
    if (numA !== numB) return numB - numA;
    const timeA = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
    const timeB = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
    return timeB - timeA;
  });

  // 3. TÍNH TOÁN PHÂN TRANG & SỐ LƯỢNG
  const totalFiltered = sortedProjects.length;
  const itemsPerPage = pageSize === "all" ? Math.max(1, totalFiltered) : pageSize;
  const totalPages = pageSize === "all" ? 1 : Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = pageSize === "all"
    ? sortedProjects
    : sortedProjects.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

  const startIndex = totalFiltered === 0 ? 0 : (safeCurrentPage - 1) * (pageSize === "all" ? 0 : pageSize) + 1;
  const endIndex = pageSize === "all" ? totalFiltered : Math.min(safeCurrentPage * (pageSize as number), totalFiltered);

  const totalCount = (projects || []).length;
  const revisingCount = (projects || []).filter(
    (p) => p && (p.status === "Admin_Revising" || !!p.has_unread_feedback)
  ).length;
  const pendingCount = (projects || []).filter((p) => p && (p.status === "Pending" || p.status === "Draft")).length;
  const reviewingCount = (projects || []).filter(
    (p) =>
      p &&
      (p.status === "Client_Reviewing" ||
        p.status === "Waiting_Client_Final_Approval" ||
        p.status === "Awaiting_Payment")
  ).length;
  const completedCount = (projects || []).filter(
    (p) => p && (p.status === "Completed" || p.status === "Approved")
  ).length;

  const revisingProjects = (projects || []).filter(
    (p) => p && (p.status === "Admin_Revising" || !!p.has_unread_feedback)
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return { date: "1/11/2026", time: "00:00" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: "1/11/2026", time: "00:00" };
      return {
        date: d.toLocaleDateString("vi-VN"),
        time: d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      };
    } catch {
      return { date: "1/11/2026", time: "00:00" };
    }
  };

  const renderProjectStatusTag = (project: ProjectRecord) => {
    if (project.status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã Hoàn Tất &amp; Bàn Giao</span>
        </span>
      );
    }
    if (project.status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã Phê Duyệt</span>
        </span>
      );
    }
    if (project.status === "Admin_Revising" || project.has_unread_feedback) {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20 animate-pulse">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Khách Yêu Cầu Sửa Đợt {project.current_revision || 1}</span>
          </span>
          {project.client_feedback && (
            <div className="text-[10px] text-amber-300/80 italic truncate max-w-[200px]">
              &ldquo;{project.client_feedback}&rdquo;
            </div>
          )}
        </div>
      );
    }
    if (project.status === "Client_Reviewing") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Khách Đang Duyệt Đợt {project.current_revision || 1}</span>
        </span>
      );
    }
    if (project.status === "Waiting_Client_Final_Approval") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>Chờ Khách Nghiệm Thu</span>
        </span>
      );
    }
    if (project.status === "Awaiting_Payment") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <span>Chờ Thanh Toán VietQR</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Chờ Duyệt Thẩm Mỹ</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Studio Navbar for Admin */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-300 text-lg tracking-tighter">
                  L
                </span>
              </div>
            </div>
            <div>
              <div className="font-serif font-bold text-stone-100 text-base sm:text-lg tracking-wider flex items-center gap-2">
                <span>LUMINA</span>
                <span className="font-sans font-light text-amber-400 text-xs sm:text-sm">
                  CURATION DASHBOARD
                </span>
              </div>
              <div className="text-[10px] text-stone-400 tracking-widest uppercase">
                BÀN LÀM VIỆC CỦA GIÁM ĐỐC SÁNG TẠO (BƯỚC 4)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/review"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Xem Cổng Duyệt Khách Hàng</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-stone-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer group"
                title="Đăng xuất khỏi Bàn làm việc Quản trị"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-400" />
                <span>Đăng Xuất</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Page Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>HỆ THỐNG QUẢN LÝ DỰ ÁN &amp; THẨM ĐỊNH THẨM MỸ BÁN TỰ ĐỘNG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Projects Pipeline — Quản Lý Đơn Đặt Hàng
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Thẩm định các concept AI đã sinh ra, trực tiếp căn chỉnh câu từ, màu sắc, font chữ và thiết kế logo trước khi xuất bản bàn giao.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm Mới Dữ Liệu</span>
          </button>
        </div>

        {/* Banner thông báo khi có đơn khách yêu cầu sửa */}
        {revisingProjects.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-amber-500/10 animate-pulse">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                  <span>CÓ {revisingProjects.length} ĐƠN HÀNG VỪA GỬI YÊU CẦU CHỈNH SỬA!</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="text-xs text-stone-300">
                  {revisingProjects.map((p) => `Đơn hàng [${p.project_id} - ${p.brand_name}]: Khách vừa gửi yêu cầu sửa đổi đợt ${p.current_revision || 1}!`).join(" • ")}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenWorkspace(revisingProjects[0])}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
            >
              Mở Đơn Cần Sửa Ngay
            </button>
          </div>
        )}

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-900/80 rounded-2xl p-5 border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400">
              Tổng Số Đơn Đặt Hàng
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              {totalCount}
            </div>
            <div className="text-[11px] text-stone-500">Đồng bộ từ Database CSV</div>
          </div>

          <div className="bg-amber-500/10 rounded-2xl p-5 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-300">
                Khách Yêu Cầu Sửa
              </span>
              {revisingCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
              {revisingCount}
            </div>
            <div className="text-[11px] text-amber-400/80">Cần Giám đốc Sáng tạo tinh chỉnh</div>
          </div>

          <div className="bg-blue-500/5 rounded-2xl p-5 border border-blue-500/20 space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-blue-400">
              Khách Đang Duyệt
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-blue-300">
              {reviewingCount}
            </div>
            <div className="text-[11px] text-blue-400/80">Đang chờ phản hồi từ khách</div>
          </div>

          <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/20 space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
              Đã Hoàn Tất Bàn Giao
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
              {completedCount}
            </div>
            <div className="text-[11px] text-emerald-400/80">Đã xuất trọn bộ SVG, PNG, PDF</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 p-3 rounded-2xl border border-stone-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm theo Mã, Tên thương hiệu, SĐT..."
              className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => handleStatusFilterChange("All")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "All"
                  ? "bg-stone-800 text-stone-100 border border-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Tất Cả ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("Revising")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Revising"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-stone-400 hover:text-amber-300"
              }`}
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Cần Sửa ({revisingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("Pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Pending"
                  ? "bg-stone-800 text-stone-200 border border-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>Chờ Duyệt ({pendingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("Reviewing")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Reviewing"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                  : "text-stone-400 hover:text-blue-300"
              }`}
            >
              <span>Khách Duyệt ({reviewingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("Completed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-stone-400 hover:text-emerald-300"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Đã Bàn Giao ({completedCount})</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* THANH ĐIỀU HƯỚNG MŨI TÊN TRÁI / PHẢI PHÍA TRÊN CÙNG (TOP NAVIGATION) */}
        {/* ===================================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/80 p-3 sm:px-5 rounded-2xl border border-stone-800 text-xs shadow-lg">
          <div className="flex flex-wrap items-center gap-2 text-stone-300">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>BẢNG DANH SÁCH ĐƠN HÀNG</span>
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-stone-400">
              {pageSize === "all" ? (
                <>Hiển thị toàn bộ <strong className="text-amber-300">{totalFiltered}</strong> đơn hàng (Cuộn chuột xem tất cả)</>
              ) : (
                <>Đang hiển thị <strong className="text-stone-100">{startIndex} - {endIndex}</strong> trên tổng số <strong className="text-amber-300">{totalFiltered}</strong> đơn</>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-400">
              <ArrowUpDown className="w-2.5 h-2.5 text-amber-400" />
              <span>Mới nhất trên cùng</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Lựa chọn số lượng hiển thị trên 1 trang */}
            <div className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-xl border border-stone-800">
              <span className="text-[11px] text-stone-500 hidden md:inline">Hiển thị:</span>
              <button
                type="button"
                onClick={() => { setPageSize(5); setCurrentPage(1); }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  pageSize === 5 ? "bg-amber-500 text-stone-950 font-bold shadow-sm" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                5 đơn
              </button>
              <button
                type="button"
                onClick={() => { setPageSize(10); setCurrentPage(1); }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  pageSize === 10 ? "bg-amber-500 text-stone-950 font-bold shadow-sm" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                10 đơn
              </button>
              <button
                type="button"
                onClick={() => { setPageSize("all"); setCurrentPage(1); }}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  pageSize === "all" ? "bg-amber-500 text-stone-950 font-bold shadow-sm" : "text-stone-400 hover:text-stone-200"
                }`}
                title="Xem toàn bộ tất cả đơn hàng không phân trang"
              >
                Tất cả ({totalFiltered})
              </button>
            </div>

            {/* Mũi tên Trái (Trước) / Phải (Sau) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage <= 1 || pageSize === "all"}
                className="px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 disabled:opacity-30 disabled:pointer-events-none text-stone-300 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer font-medium"
                title="Trang đơn hàng trước"
              >
                <ChevronLeft className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Trước</span>
              </button>

              <div className="px-3 py-1 bg-stone-950 border border-stone-800 rounded-xl font-mono text-[11px] font-bold text-amber-300 shadow-inner">
                {pageSize === "all" ? "1 / 1" : `${safeCurrentPage} / ${totalPages}`}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage >= totalPages || pageSize === "all"}
                className="px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 disabled:opacity-30 disabled:pointer-events-none text-stone-300 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer font-medium"
                title="Trang đơn hàng kế tiếp"
              >
                <span className="hidden md:inline text-[11px]">Sau</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* BẢNG DANH SÁCH DỰ ÁN TRỰC QUAN (CÓ THANH CUỘN & HEADER CỐ ĐỊNH) */}
        {/* ===================================================================== */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden shadow-2xl">
          {/* Vùng cuộn dọc tối đa 580px có thanh trượt sang trọng */}
          <div className="overflow-x-auto max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-stone-900 hover:scrollbar-thumb-amber-500/60">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur-md text-stone-400 font-semibold border-b border-stone-800 uppercase tracking-wider text-[11px] shadow-sm">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Mã Dự Án</th>
                  <th className="py-4 px-4">Tên Thương Hiệu</th>
                  <th className="py-4 px-4">Khách Hàng &amp; SĐT</th>
                  <th className="py-4 px-4">Ngành Hàng</th>
                  <th className="py-4 px-4">Thời Gian Gửi</th>
                  <th className="py-4 px-4">Trạng Thái</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      Không tìm thấy dự án nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => (
                    <tr
                      key={project.project_id}
                      className="hover:bg-stone-850/60 transition-colors group"
                    >
                      {/* 1. Mã dự án */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-amber-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span>{project.project_id}</span>
                          {(project.status === "Admin_Revising" || project.has_unread_feedback) && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </div>
                      </td>

                      {/* 2. Tên thương hiệu */}
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-stone-100 text-sm tracking-wide">
                          {project.brand_name}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                          &ldquo;{project.tagline || "Chưa có khẩu hiệu"}&rdquo;
                        </div>
                      </td>

                      {/* 3. Khách hàng & SĐT */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-medium text-stone-200">
                          {project.client_name || "Khách hàng"}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-500" />
                          <span>{project.client_phone || "—"}</span>
                        </div>
                      </td>

                      {/* 4. Ngành hàng */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-stone-300">
                          {project.industry || "Tổng hợp"}
                        </span>
                      </td>

                      {/* 5. Thời gian gửi */}
                      <td className="py-4 px-4 text-stone-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          <span>{formatDate(project.submitted_at).date}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 pl-4">
                          {formatDate(project.submitted_at).time}
                        </div>
                      </td>

                      {/* 6. Trạng thái */}
                      <td className="py-4 px-4">
                        {renderProjectStatusTag(project)}
                      </td>

                      {/* 7. Thao tác: Nút Mở bàn làm việc */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(project.status === "Approved" || project.status === "Completed") && project.export_links?.client_proposal_url && (
                            <a
                              href={project.export_links.client_proposal_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
                              title="Xem trang Proposal của khách"
                            >
                              <ExternalLink className="w-4 h-4 text-amber-400" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenWorkspace(project)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer transform group-hover:scale-105"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Mở Bàn Làm Việc</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Footer Info & Quick Jump */}
          <div className="bg-stone-950/90 border-t border-stone-800 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div>
              Tổng số <strong className="text-amber-300 font-mono">{totalFiltered}</strong> đơn hàng đã nạp vào Bàn làm việc (Toàn bộ đơn hàng được hiển thị đầy đủ, không ẩn).
            </div>

            {pageSize !== "all" && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  &larr; Trang trước
                </button>
                <span className="font-mono text-amber-400 text-xs px-2">
                  {safeCurrentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Trang sau &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

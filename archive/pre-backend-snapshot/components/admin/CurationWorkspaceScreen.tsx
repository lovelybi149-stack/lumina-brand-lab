"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Sparkles,
  Info,
  Edit3,
  Palette,
  Sliders,
  RefreshCw,
  ExternalLink,
  Layers,
  Send,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  X,
  Target,
  LogOut
} from "lucide-react";
import { ProjectRecord } from "../../types/curation";
import { TabBriefInfo } from "./tabs/TabBriefInfo";
import { TabContentEditor } from "./tabs/TabContentEditor";
import { TabPaletteFontEditor } from "./tabs/TabPaletteFontEditor";
import { TabLogoDesignEditor } from "./tabs/TabLogoDesignEditor";
import { LivePreviewPanel } from "./preview/LivePreviewPanel";
import { ApprovalSuccessModal } from "./modals/ApprovalSuccessModal";

interface CurationWorkspaceScreenProps {
  project: ProjectRecord;
  onBackToPipeline: () => void;
  onProjectUpdated: (updated: ProjectRecord) => void;
  onLogout?: () => void;
}

export const CurationWorkspaceScreen: React.FC<CurationWorkspaceScreenProps> = ({
  project: initialProject,
  onBackToPipeline,
  onProjectUpdated,
  onLogout
}) => {
  const [project, setProject] = useState<ProjectRecord>(initialProject);
  const [activeTab, setActiveTab] = useState<"brief" | "content" | "palette" | "logo">("logo");
  const [activeOptionId, setActiveOptionId] = useState<"opt_1" | "opt_2" | "opt_3">(
    initialProject.selected_logo_id || "opt_1"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal gửi duyệt thành công (mô phỏng Email / SMS)
  const [reviewSentModal, setReviewSentModal] = useState<{
    isOpen: boolean;
    message: string;
    isFinal: boolean;
  }>({
    isOpen: false,
    message: "",
    isFinal: false
  });

  const [approvalModalData, setApprovalModalData] = useState<{
    isOpen: boolean;
    exportLinks: any;
  }>({
    isOpen: false,
    exportLinks: null
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle updates from any tab
  const handleProjectChange = (updates: Partial<ProjectRecord>) => {
    setProject((prev) => {
      const updated = { ...prev, ...updates };
      onProjectUpdated(updated);
      return updated;
    });
  };

  // Switch Active Logo Option (from either Left Tab 4 or Right Canvas Bar)
  const handleSelectOption = (optionId: "opt_1" | "opt_2" | "opt_3") => {
    setActiveOptionId(optionId);
  };

  // 1. Lưu bản nháp (Save Draft)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.project_id}/save-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
      const data = await res.json();
      if (data.success) {
        showToast("✓ Đã lưu bản nháp dự án thành công!");
      } else {
        alert("Lỗi lưu bản nháp: " + (data.error || "Không xác định"));
      }
    } catch (e: any) {
      alert("Lỗi kết nối khi lưu bản nháp.");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Tải thử file kiểm tra (Download Preview SVG)
  const handleDownloadPreview = () => {
    const activeSvg = project.logo_options?.find((o) => o.id === activeOptionId)?.svg || project.logo_svg;
    const blob = new Blob([activeSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${activeOptionId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✓ Đã tải file SVG ${activeOptionId.toUpperCase()} kiểm tra!`);
  };

  // 3. Phê duyệt & Xuất bản trọn bộ file (Approve & Publish)
  const handleApproveAndPublish = async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/projects/${project.project_id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const approvedProject: ProjectRecord = {
          ...project,
          status: "Approved",
          approved_at: data.data.approved_at,
          export_links: data.data.final_data.export_links
        };
        setProject(approvedProject);
        onProjectUpdated(approvedProject);

        setApprovalModalData({
          isOpen: true,
          exportLinks: data.data.final_data.export_links
        });
      } else {
        alert("Lỗi khi phê duyệt: " + (data.error || "Không xác định"));
      }
    } catch (e: any) {
      alert("Lỗi kết nối khi thực hiện phê duyệt.");
    } finally {
      setIsApproving(false);
    }
  };

  // 4. GỬI BẢN THIẾT KẾ CHO KHÁCH DUYỆT (Bước 1 & Bước 3)
  const isLastRound =
    project.revision_rounds === 1 ||
    (project.revision_rounds === 2 && (project.current_revision === 2 || project.status === "Admin_Revising"));

  const handleSendToClientReview = async () => {
    setIsSendingReview(true);
    try {
      const res = await fetch(`/api/projects/${project.project_id}/send-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_final: isLastRound })
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        onProjectUpdated(data.project);
        setReviewSentModal({
          isOpen: true,
          message: data.message,
          isFinal: isLastRound
        });
      } else {
        alert("Lỗi khi gửi duyệt: " + (data.error || "Không xác định"));
      }
    } catch (e: any) {
      alert("Lỗi kết nối khi gửi duyệt cho khách hàng.");
    } finally {
      setIsSendingReview(false);
    }
  };

  // 5. Đánh dấu đã tiếp nhận yêu cầu góp ý
  const handleAcknowledgeFeedback = async () => {
    try {
      const res = await fetch(`/api/projects/${project.project_id}/mark-read`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        onProjectUpdated(data.project);
        showToast("✓ Đã tiếp nhận yêu cầu góp ý của khách hàng!");
      }
    } catch (_) {}
  };

  // Hiển thị huy hiệu trạng thái đơn hàng
  const renderStatusBadge = () => {
    if (project.status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Đã Hoàn Tất &amp; Đã Bàn Giao</span>
        </span>
      );
    }
    if (project.status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Đã Phê Duyệt</span>
        </span>
      );
    }
    if (project.status === "Admin_Revising") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
          <Bell className="w-3 h-3 text-amber-400" />
          <span>Đang Sửa Theo Góp Ý</span>
        </span>
      );
    }
    if (project.status === "Client_Reviewing") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <span>Khách Đang Duyệt Concept</span>
        </span>
      );
    }
    if (project.status === "Waiting_Client_Final_Approval") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <span>Chờ Khách Duyệt Nghiệm Thu</span>
        </span>
      );
    }
    if (project.status === "Awaiting_Payment") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <span>Chờ Khách Thanh Toán VietQR</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <span>Chờ Duyệt Thẩm Mỹ</span>
      </span>
    );
  };

  // Hiển thị huy hiệu tiến trình duyệt theo số lần (Bước 3)
  const renderRevisionProgressBadge = () => {
    if (project.revision_rounds === 2) {
      if (project.status === "Admin_Revising") {
        return (
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span>Đang sửa: Đợt duyệt {project.current_revision || 1}/2</span>
          </span>
        );
      }
      if (project.current_revision === 2 || project.status === "Waiting_Client_Final_Approval") {
        return (
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <span>Đợt duyệt 2/2 (Lần duyệt cuối cùng)</span>
          </span>
        );
      }
      return (
        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700">
          <span>Đợt duyệt: Lần {project.current_revision || 1}/2</span>
        </span>
      );
    }
    return (
      <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
        <span>Đợt duyệt nghiệm thu cuối cùng</span>
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-stone-950 text-stone-100 overflow-hidden">
      {/* Top Workspace Header */}
      <header className="h-16 px-4 sm:px-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBackToPipeline}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pipeline Dự Án</span>
          </button>

          <div className="h-4 w-[1px] bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs font-bold border border-stone-700">
              {project.project_id}
            </span>
            <h1 className="font-serif font-bold text-base sm:text-lg text-stone-100 tracking-wide truncate max-w-[180px] sm:max-w-none">
              {project.brand_name.toUpperCase()}
            </h1>

            {/* Trạng thái đơn hàng */}
            {renderStatusBadge()}

            {/* Tiến trình duyệt */}
            {renderRevisionProgressBadge()}

            {/* Tier & Delivery mode indicator badge */}
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-amber-300 border border-stone-700">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>
                {project.delivery_mode === "client_choice" ? "Gói Pro: 3 Option Khách Chọn" : "Gói Standard: 1 Bản Chốt"}
              </span>
            </span>
          </div>
        </div>

        {/* Quick info right side */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <div className="text-xs text-stone-300 font-medium">{project.client_name}</div>
            <div className="text-[10px] text-stone-500">{project.client_phone}</div>
          </div>
          {toastMessage && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg animate-fadeIn">
              {toastMessage}
            </div>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-500/40 text-stone-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer group"
              title="Đăng xuất khỏi Bàn làm việc"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-400" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* GHIM NỔI BẬT COMMENT GÓP Ý CỦA KHÁCH HÀNG Ở ĐẦU TRANG (BƯỚC 2) */}
      {/* ========================================================================= */}
      {project.client_feedback && (
        <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-stone-900 border-b border-amber-500/40 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 z-20 shadow-lg animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0 animate-bounce">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider">
                  🔔 YÊU CẦU ĐIỀU CHỈNH TỪ KHÁCH HÀNG ({project.revision_rounds === 2 ? `ĐỢT DUYỆT ${project.current_revision || 1}/2` : "BẢN NGHIỆM THU"}):
                </span>
                {project.selected_logo_id && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-semibold">
                    Khách đang chọn: {project.selected_logo_id.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-stone-100 font-medium text-xs sm:text-sm italic">
                &ldquo;{project.client_feedback}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleAcknowledgeFeedback}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-stone-100 text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Đã tiếp nhận yêu cầu</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Split Screen Area: 45% LEFT vs 55% RIGHT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ========================================================================= */}
        {/* CỘT BÊN TRÁI: 45% CHIỀU RỘNG - BẢNG ĐIỀU KHIỂN & CHỈNH SỬA CHI TIẾT */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[45%] h-full flex flex-col border-r border-stone-800 bg-stone-925 shrink-0 overflow-hidden">
          {/* 4 Tabs Navigation Bar */}
          <div className="flex items-center border-b border-stone-800 bg-stone-900/60 p-1.5 shrink-0 overflow-x-auto gap-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("brief")}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "brief"
                  ? "bg-stone-800 text-amber-300 border border-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>1. Brief</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex-1 min-w-[95px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-stone-800 text-amber-300 border border-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>2. Nội Dung</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("palette")}
              className={`flex-1 min-w-[105px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "palette"
                  ? "bg-stone-800 text-amber-300 border border-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. Màu &amp; Font</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("logo")}
              className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "logo"
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Logo Master (3 Options)</span>
            </button>
          </div>

          {/* Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {activeTab === "brief" && <TabBriefInfo project={project} />}
            {activeTab === "content" && (
              <TabContentEditor project={project} onChange={handleProjectChange} />
            )}
            {activeTab === "palette" && (
              <TabPaletteFontEditor project={project} onChange={handleProjectChange} />
            )}
            {activeTab === "logo" && (
              <TabLogoDesignEditor
                project={project}
                activeOptionId={activeOptionId}
                onSelectOption={handleSelectOption}
                onChange={handleProjectChange}
              />
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT BÊN PHẢI: 55% CHIỀU RỘNG - XEM TRƯỚC THEO THỜI GIAN THỰC (LIVE PREVIEW) */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[55%] h-full flex flex-col overflow-hidden">
          <LivePreviewPanel
            project={project}
            activeOptionId={activeOptionId}
            onSelectOption={handleSelectOption}
            onProjectChange={handleProjectChange}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG: HÀNH ĐỘNG GỬI DUYỆT & PHÊ DUYỆT BÀN GIAO */}
      {/* ========================================================================= */}
      <footer className="h-20 px-4 sm:px-8 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Nút 1: Lưu bản nháp */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Lưu Bản Nháp</span>
          </button>

          {/* Nút 2: Tải thử file kiểm tra */}
          <button
            type="button"
            onClick={handleDownloadPreview}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải Thử Option {activeOptionId === "opt_1" ? "1" : activeOptionId === "opt_2" ? "2" : "3"} (SVG)</span>
          </button>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG CHÍNH */}
        <div className="flex items-center gap-3">
          {/* NÚT BƯỚC 1 & 3: GỬI BẢN THIẾT KẾ CHO KHÁCH DUYỆT */}
          <button
            type="button"
            disabled={isSendingReview}
            onClick={handleSendToClientReview}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
              isLastRound
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25"
            }`}
          >
            {isSendingReview ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Đang gửi thông báo cho khách...</span>
              </>
            ) : isLastRound ? (
              <>
                <Target className="w-4 h-4 text-white" />
                <span>🎯 GỬI BẢN CHỐT NGHIỆM THU CHO KHÁCH</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>🚀 GỬI BẢN THIẾT KẾ CHO KHÁCH DUYỆT</span>
              </>
            )}
          </button>

          {/* NÚT PHÊ DUYỆT & XUẤT BẢN TRỌN BỘ FILE BÀN GIAO */}
          <button
            type="button"
            disabled={isApproving}
            onClick={handleApproveAndPublish}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {isApproving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                <span>Đang Tự Động Xuất SVG, PNG &amp; PDF...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span className="hidden md:inline">Phê Duyệt &amp; Xuất Bản Trọn Bộ File Bàn Giao</span>
                <span className="md:hidden">Xuất File Bàn Giao</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL MÔ PHỎNG THÔNG BÁO EMAIL / SMS GỬI KHÁCH HÀNG (BƯỚC 1 & BƯỚC 3) */}
      {/* ========================================================================= */}
      {reviewSentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setReviewSentModal({ isOpen: false, message: "", isFinal: false })}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-stone-950 shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  {reviewSentModal.isFinal
                    ? "Đã Gửi Bản Chốt Nghiệm Thu Cho Khách!"
                    : "Đã Gửi Bản Thiết Kế Đợt 1 Cho Khách!"}
                </h3>
                <p className="text-xs text-stone-400">
                  Hệ thống tự động kích hoạt Cổng Duyệt Khách Hàng và gửi tin nhắn.
                </p>
              </div>
            </div>

            {/* Mô phỏng SMS / Zalo */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mô phỏng tin nhắn SMS / Zalo:</span>
                </span>
                <span>Gửi tới: {project.client_phone}</span>
              </div>
              <p className="text-stone-200 italic bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
                &ldquo;LUMINA BRAND LAB: Xin chào {project.client_name}, Lumina đã hoàn tất bản thảo nhận diện {project.brand_name}! Mời bạn truy cập mục Tra Cứu (Mã đơn: {project.project_id}) để xem chi tiết và phản hồi.&rdquo;
              </p>
            </div>

            {/* Mô phỏng Email */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-300">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Mô phỏng Email thông báo:</span>
                </span>
                <span>{project.client_email}</span>
              </div>
              <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/80 space-y-1">
                <div className="text-stone-300 font-semibold">
                  Tiêu đề: [Lumina] Bản thảo thiết kế thương hiệu {project.brand_name} ({project.project_id})
                </div>
                <div className="text-stone-400 text-[11px]">
                  Kính gửi {project.client_name}, Giám đốc Sáng tạo đã thẩm định và tinh chỉnh các concept logo. Mời bạn truy cập để xem xét và gửi góp ý trực tiếp.
                </div>
              </div>
            </div>

            {/* Nút hành động trong modal */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/review"
                target="_blank"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Mở Cổng Tra Cứu / Duyệt Khách Hàng</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setReviewSentModal({ isOpen: false, message: "", isFinal: false })}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chúc Mừng & Tải Tài Sản Thành Công */}
      {approvalModalData.isOpen && approvalModalData.exportLinks && (
        <ApprovalSuccessModal
          isOpen={approvalModalData.isOpen}
          onClose={() => setApprovalModalData({ isOpen: false, exportLinks: null })}
          project={project}
          exportLinks={approvalModalData.exportLinks}
        />
      )}
    </div>
  );
};

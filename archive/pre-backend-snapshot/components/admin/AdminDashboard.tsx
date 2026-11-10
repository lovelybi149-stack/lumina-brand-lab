"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectRecord } from "../../types/curation";
import { ProjectsPipelineScreen } from "./ProjectsPipelineScreen";
import { CurationWorkspaceScreen } from "./CurationWorkspaceScreen";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Admin Dashboard Caught Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-100">Khôi phục Bàn làm việc Quản trị</h2>
            <p className="text-xs text-stone-400">
              Hệ thống đã tự động bảo vệ phiên làm việc. Bạn chỉ cần nhấn nút bên dưới để tải lại dữ liệu mới nhất.
            </p>
            {this.state.error?.message && (
              <div className="text-[11px] font-mono text-amber-300/80 bg-stone-950 p-3 rounded-xl text-left overflow-auto max-h-32 border border-stone-800">
                Chi tiết: {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Tải Lại Bàn Làm Việc
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminDashboard: React.FC = () => {
  return (
    <AdminErrorBoundary>
      <AdminDashboardContent />
    </AdminErrorBoundary>
  );
};

const AdminDashboardContent: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra xác thực Admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/check", { cache: "no-store" });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchProjects();
        } else {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.replace("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch all projects from API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);

        // Nếu đang mở 1 project, cập nhật luôn dữ liệu mới nhất của project đó
        if (selectedProject) {
          const updated = data.projects.find(
            (p: ProjectRecord) => p.project_id === selectedProject.project_id
          );
          if (updated) setSelectedProject(updated);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải dự án:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (_) {}
    window.location.href = "/";
  };

  const handleOpenWorkspace = (project: ProjectRecord) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToPipeline = () => {
    setSelectedProject(null);
    fetchProjects();
  };

  const handleProjectUpdated = (updated: ProjectRecord) => {
    setSelectedProject(updated);
    setProjects((prev) =>
      prev.map((p) => (p.project_id === updated.project_id ? updated : p))
    );
  };

  // Trạng thái đang kiểm tra phiên làm việc hoặc chưa xác thực
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200">
        <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-sm tracking-wider uppercase">
          Đang xác thực quyền truy cập Giám đốc Sáng tạo...
        </p>
      </div>
    );
  }

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200">
        <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-sm tracking-wider uppercase">
          Đang nạp Bàn làm việc Giám đốc Sáng tạo...
        </p>
      </div>
    );
  }

  // Render Màn hình 2 nếu có project được chọn
  if (selectedProject) {
    return (
      <CurationWorkspaceScreen
        project={selectedProject}
        onBackToPipeline={handleBackToPipeline}
        onProjectUpdated={handleProjectUpdated}
        onLogout={handleLogout}
      />
    );
  }

  // Render Màn hình 1: Quản lý Dự Án (Projects Pipeline)
  return (
    <ProjectsPipelineScreen
      projects={projects}
      onOpenWorkspace={handleOpenWorkspace}
      onRefresh={fetchProjects}
      isLoading={loading}
      onLogout={handleLogout}
    />
  );
};

export default AdminDashboard;

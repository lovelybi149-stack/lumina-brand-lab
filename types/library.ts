/**
 * LUMINA BRAND LAB — DIGITAL ASSET MANAGEMENT (DAM) TYPES
 * Định nghĩa cấu trúc cho Kho Thư Viện Hình Ảnh Toàn Diện
 */

export type AssetType = "mockup" | "moodboard" | "texture" | "all";

export interface OverlayCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LibraryAsset {
  id: string;
  type: "mockup" | "moodboard" | "texture";
  title: string;
  category: string;
  industry: string[];
  preview_url: string;
  dimensions?: string;
  file_format?: string;
  style_tags?: string[];
  overlay_coordinates?: OverlayCoordinates;
  created_at?: string;
  author?: string;
  file_size?: string;
}

export interface GeneratedProjectFile {
  name: string;
  file_name: string;
  type: "svg" | "png" | "pdf" | "mockup";
  url: string;
  size?: string;
}

export interface GeneratedProjectArchive {
  project_id: string;
  brand_name: string;
  client_name: string;
  industry: string;
  tagline: string;
  status: "Pending" | "Approved";
  proposal_url?: string;
  preview_mockup_url: string;
  preview_logo_url: string;
  palette?: Array<{ name: string; hex: string; role: string }>;
  files: {
    svg_url: string;
    png_url: string;
    mockup_url: string;
    pdf_url: string;
  };
  created_at?: string;
}

export interface LibraryFilterOptions {
  tab: "curated" | "generated";
  type: AssetType;
  industry: string;
  searchQuery: string;
}

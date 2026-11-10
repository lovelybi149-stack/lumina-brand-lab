import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LibraryAsset, GeneratedProjectArchive } from "../../../types/library";
import { getAllProjects } from "../../../lib/curationService";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "libraryAssets.json");
const GENERATED_DIR = path.join(process.cwd(), "public", "generated");
const LIBRARY_DIR = path.join(process.cwd(), "public", "library");

/**
 * Đọc file metadata libraryAssets.json
 */
function readLibraryAssets(): LibraryAsset[] {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc file libraryAssets.json:", e);
    return [];
  }
}

/**
 * Lưu danh sách metadata vào libraryAssets.json
 */
function writeLibraryAssets(assets: LibraryAsset[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(assets, null, 2), "utf8");
}

/**
 * Quét các dự án thành phẩm tại /public/generated/
 */
async function getGeneratedProjects(): Promise<GeneratedProjectArchive[]> {
  const allDbProjects = await getAllProjects();
  const dbMap = new Map(allDbProjects.map((p) => [p.project_id, p]));

  const results: GeneratedProjectArchive[] = [];

  // Dự phòng danh sách cơ bản nếu database chưa đồng bộ
  const defaultProjects = [
    {
      id: "LUMINA-01",
      brand: "AURA ROASTERS",
      client: "Lê Tuấn Hưng",
      industry: "F&B / Specialty Coffee",
      tagline: "Awaken Your Pure Frequency",
      status: "Pending" as const,
      proposal: "/proposal/LUMINA-01"
    },
    {
      id: "LUMINA-02",
      brand: "L'ATELIER SILENCE",
      client: "Nguyễn Mai Chi",
      industry: "Thời trang & May mặc cao cấp",
      tagline: "The Power of Pure Form",
      status: "Approved" as const,
      proposal: "https://lumina-brandlab.com/proposals/LUMINA-02-LATELIER-SILENCE.pdf"
    },
    {
      id: "LUMINA-03",
      brand: "Gió Mộc Coffee",
      client: "Trần Hoàng Nguyên",
      industry: "F&B / Specialty Coffee & Trải nghiệm",
      tagline: "Chạm chất mộc, lắng tiếng gió reo",
      status: "Approved" as const,
      proposal: "/p/gio-moc-coffee"
    }
  ];

  if (fs.existsSync(GENERATED_DIR)) {
    const projectDirs = fs
      .readdirSync(GENERATED_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const pId of projectDirs) {
      const pFolder = path.join(GENERATED_DIR, pId);
      const dbRecord = dbMap.get(pId);
      const fallback = defaultProjects.find((dp) => dp.id === pId);

      const brandName = dbRecord?.brand_name || fallback?.brand || pId;
      const clientName = dbRecord?.client_name || fallback?.client || "Khách hàng Lumina";
      const industry = dbRecord?.industry || fallback?.industry || "Đa ngành";
      const tagline = dbRecord?.tagline || fallback?.tagline || "Archival Branding & Design";
      const status = (dbRecord?.status || fallback?.status || "Approved") as "Pending" | "Approved";

      // Kiểm tra sự tồn tại của các file
      const svgExists = fs.existsSync(path.join(pFolder, "logo_master.svg"));
      const pngExists = fs.existsSync(path.join(pFolder, "logo_transparent.png"));
      const mockupExists = fs.existsSync(path.join(pFolder, "mockup_namecard.png"));
      const pdfExists = fs.existsSync(path.join(pFolder, "brand_guideline.pdf"));

      results.push({
        project_id: pId,
        brand_name: brandName,
        client_name: clientName,
        industry: industry,
        tagline: tagline,
        status: status,
        proposal_url: dbRecord?.export_links?.client_proposal_url || fallback?.proposal || `/p/${pId.toLowerCase()}`,
        preview_mockup_url: mockupExists ? `/generated/${pId}/mockup_namecard.png` : `/library/mockups/blank_namecard_modern.png`,
        preview_logo_url: svgExists ? `/generated/${pId}/logo_master.svg` : `/generated/${pId}/logo_transparent.png`,
        palette: dbRecord?.palette?.map((c) => ({ name: c.name, hex: c.hex, role: c.role })) || [],
        files: {
          svg_url: svgExists ? `/generated/${pId}/logo_master.svg` : "",
          png_url: pngExists ? `/generated/${pId}/logo_transparent.png` : "",
          mockup_url: mockupExists ? `/generated/${pId}/mockup_namecard.png` : "",
          pdf_url: pdfExists ? `/generated/${pId}/brand_guideline.pdf` : ""
        }
      });
    }
  }

  return results;
}

/**
 * GET: Lấy danh sách tài sản thư viện (Curated Assets) & Kho thành phẩm (Generated Projects)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // 'mockup' | 'moodboard' | 'texture' | 'all'
    const industry = searchParams.get("industry") || "all";
    const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
    const tab = searchParams.get("tab") || "all"; // 'curated' | 'generated' | 'all'

    const allAssets = readLibraryAssets();
    const allProjects = await getGeneratedProjects();

    // 1. Lọc Curated Assets
    let filteredAssets = allAssets;

    if (type !== "all") {
      filteredAssets = filteredAssets.filter((a) => a.type === type);
    }

    if (industry !== "all" && industry !== "Tất cả") {
      filteredAssets = filteredAssets.filter((a) => {
        if (!a.industry || a.industry.length === 0) return true;
        return a.industry.some(
          (ind) => ind.toLowerCase() === "all" || ind.toLowerCase().includes(industry.toLowerCase())
        );
      });
    }

    if (searchQuery) {
      filteredAssets = filteredAssets.filter((a) => {
        const titleMatch = a.title.toLowerCase().includes(searchQuery);
        const categoryMatch = a.category.toLowerCase().includes(searchQuery);
        const tagMatch = a.style_tags?.some((t) => t.toLowerCase().includes(searchQuery));
        const indMatch = a.industry?.some((i) => i.toLowerCase().includes(searchQuery));
        return titleMatch || categoryMatch || tagMatch || indMatch;
      });
    }

    // 2. Lọc Generated Projects
    let filteredProjects = allProjects;

    if (industry !== "all" && industry !== "Tất cả") {
      filteredProjects = filteredProjects.filter((p) =>
        p.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (searchQuery) {
      filteredProjects = filteredProjects.filter((p) => {
        const brandMatch = p.brand_name.toLowerCase().includes(searchQuery);
        const clientMatch = p.client_name.toLowerCase().includes(searchQuery);
        const idMatch = p.project_id.toLowerCase().includes(searchQuery);
        const taglineMatch = p.tagline.toLowerCase().includes(searchQuery);
        const indMatch = p.industry.toLowerCase().includes(searchQuery);
        return brandMatch || clientMatch || idMatch || taglineMatch || indMatch;
      });
    }

    // Thống kê nhanh
    const stats = {
      totalCurated: allAssets.length,
      totalMockups: allAssets.filter((a) => a.type === "mockup").length,
      totalMoodboards: allAssets.filter((a) => a.type === "moodboard").length,
      totalTextures: allAssets.filter((a) => a.type === "texture").length,
      totalGeneratedProjects: allProjects.length
    };

    return NextResponse.json({
      success: true,
      assets: tab === "generated" ? [] : filteredAssets,
      projects: tab === "curated" ? [] : filteredProjects,
      stats
    });
  } catch (error: any) {
    console.error("Lỗi GET /api/library:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi tải kho thư viện: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Tải thêm ảnh mới vào kho thư viện (Upload File hoặc thêm Metadata)
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const allAssets = readLibraryAssets();

    let newAsset: LibraryAsset;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string) || "Tài sản mới tải lên";
      const type = (formData.get("type") as "mockup" | "moodboard" | "texture") || "mockup";
      const category = (formData.get("category") as string) || "General";
      const industryInput = (formData.get("industry") as string) || "All";
      const styleTagsInput = (formData.get("style_tags") as string) || "";
      const subfolder = (formData.get("subfolder") as string) || "";
      const overlayCoordsRaw = formData.get("overlay_coordinates") as string | null;

      let previewUrl = "";

      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Chuẩn hóa tên file sạch
        const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileName = `${Date.now()}_${originalName}`;

        let targetDir = path.join(LIBRARY_DIR, "mockups");
        let relUrl = `/library/mockups/${fileName}`;

        if (type === "texture") {
          targetDir = path.join(LIBRARY_DIR, "textures");
          relUrl = `/library/textures/${fileName}`;
        } else if (type === "moodboard") {
          const sub = subfolder || "general";
          targetDir = path.join(LIBRARY_DIR, "moodboards", sub);
          relUrl = `/library/moodboards/${sub}/${fileName}`;
        }

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(path.join(targetDir, fileName), buffer);
        previewUrl = relUrl;
      } else {
        const directUrl = formData.get("preview_url") as string;
        if (directUrl) {
          previewUrl = directUrl;
        } else {
          return NextResponse.json(
            { success: false, error: "Vui lòng đính kèm file ảnh hoặc đường dẫn preview_url." },
            { status: 400 }
          );
        }
      }

      // Xử lý tọa độ overlay nếu có
      let overlayCoordinates = undefined;
      if (overlayCoordsRaw) {
        try {
          overlayCoordinates = JSON.parse(overlayCoordsRaw);
        } catch {
          // bỏ qua
        }
      }

      const industryList = industryInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const styleTags = styleTagsInput
        ? styleTagsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

      newAsset = {
        id: `${type}-${Date.now().toString().slice(-4)}`,
        type,
        title,
        category,
        industry: industryList.length > 0 ? industryList : ["All"],
        preview_url: previewUrl,
        style_tags: styleTags,
        overlay_coordinates: overlayCoordinates,
        created_at: new Date().toISOString()
      };
    } else {
      // Nhận JSON payload
      const body = await request.json();
      if (!body.title || !body.preview_url || !body.type) {
        return NextResponse.json(
          { success: false, error: "Thiếu các trường bắt buộc: title, preview_url, type." },
          { status: 400 }
        );
      }

      newAsset = {
        id: body.id || `${body.type}-${Date.now().toString().slice(-4)}`,
        type: body.type,
        title: body.title,
        category: body.category || "General",
        industry: Array.isArray(body.industry) ? body.industry : [body.industry || "All"],
        preview_url: body.preview_url,
        dimensions: body.dimensions,
        file_format: body.file_format,
        style_tags: body.style_tags,
        overlay_coordinates: body.overlay_coordinates,
        created_at: new Date().toISOString()
      };
    }

    allAssets.unshift(newAsset);
    writeLibraryAssets(allAssets);

    return NextResponse.json({
      success: true,
      message: "✓ Đã tải tài sản mới lên kho thư viện thành công!",
      asset: newAsset
    });
  } catch (error: any) {
    console.error("Lỗi POST /api/library:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi lưu tài sản: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * LUMINA BRAND LAB — VECTOR DESIGN ARCHETYPES (KHO TRI THỨC HÌNH HỌC THIẾT KẾ)
 * 
 * Định nghĩa các khuôn mẫu hình học vector chuẩn mực theo từng ngành nghề và phong cách.
 * Được nạp trực tiếp vào Prompt của Gemini API (gemini-2.5-flash) để hướng dẫn AI
 * tạo ra các concept logo vector SVG chuẩn in ấn, tỷ lệ vàng, sắc sảo và đúng bản sắc.
 */

export interface DesignArchetype {
  styleName: string;
  targetIndustries: string[];
  visualMetaphors: string[];
  geometryRules: {
    strokeHierarchy: { primary: string; secondary: string; accent: string };
    recommendedShapes: string[];
  };
  sampleSvgSnippet: string;
}

export const DESIGN_ARCHETYPES: Record<string, DesignArchetype> = {
  TECH_GEOMETRIC: {
    styleName: "Cấu Trúc Đa Giác & Vi Mạch Hiện Đại",
    targetIndustries: ["Công nghệ & Phần mềm", "Trí tuệ nhân tạo", "Fintech", "Kỹ thuật số", "AI Film"],
    visualMetaphors: ["Khối lập phương không gian", "Vi mạch số", "Góc vát đối xứng", "Cổng logic quang học"],
    geometryRules: {
      strokeHierarchy: { primary: "2.8px", secondary: "1.6px", accent: "0.8px" },
      recommendedShapes: ["polygon", "circle (node)", "polyline", "isometric cubes"]
    },
    sampleSvgSnippet: `<g id="logo-emblem" transform="translate(250, 185)"><polygon points="0,-65 56,-32 56,32 0,65 -56,32 -56,-32" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><polygon points="0,-42 36,-21 36,21 0,42 -36,21 -36,-21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="6 3"/><circle cx="0" cy="0" r="5" fill="currentColor"/><circle cx="0" cy="-65" r="3.5" fill="currentColor"/><circle cx="56" cy="32" r="3.5" fill="currentColor"/><circle cx="-56" cy="32" r="3.5" fill="currentColor"/><line x1="0" y1="-42" x2="0" y2="-65" stroke="currentColor" stroke-width="1.6"/><line x1="36" y1="21" x2="56" y2="32" stroke="currentColor" stroke-width="1.6"/><line x1="-36" y1="21" x2="-56" y2="32" stroke="currentColor" stroke-width="1.6"/></g>`
  },

  LUXURY_MONOGRAM: {
    styleName: "Chữ Lồng Hoàng Gia & Lăng Kính Kim Cương",
    targetIndustries: ["Thời trang & Phụ kiện", "Mỹ phẩm & Làm đẹp", "Bất động sản", "Trang sức cao cấp", "Quiet Luxury"],
    visualMetaphors: ["Lăng kính kim cương", "Monogram chữ cái thanh mảnh", "Cung tròn elip", "Khung thức kiến trúc"],
    geometryRules: {
      strokeHierarchy: { primary: "1.8px", secondary: "1.2px", accent: "0.6px" },
      recommendedShapes: ["rhombus", "interlocking arcs", "oval", "serif initial typography"]
    },
    sampleSvgSnippet: `<g id="logo-emblem" transform="translate(250, 185)"><polygon points="0,-60 48,0 0,60 -48,0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="0" cy="0" r="36" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><circle cx="0" cy="0" r="48" fill="none" stroke="currentColor" stroke-width="0.6" stroke-opacity="0.6"/><circle cx="0" cy="-60" r="2.5" fill="currentColor"/><circle cx="0" cy="60" r="2.5" fill="currentColor"/><circle cx="48" cy="0" r="2.5" fill="currentColor"/><circle cx="-48" cy="0" r="2.5" fill="currentColor"/></g>`
  },

  ORGANIC_ARTISANAL: {
    styleName: "Đường Cong Hữu Cơ & Tinh Thần Wabi-sabi",
    targetIndustries: ["F&B / Ẩm thực", "Nông sản", "Spa & Trà đạo", "Cà phê đặc sản", "Thủ công mỹ nghệ"],
    visualMetaphors: ["Vòng tròn Ensō", "Mầm lá tự nhiên", "Giọt sương", "Thớ gỗ già", "Làn gió núi"],
    geometryRules: {
      strokeHierarchy: { primary: "2.6px", secondary: "1.8px", accent: "1.0px" },
      recommendedShapes: ["smooth bezier curves", "leaf vectors", "enso rings", "organic droplets"]
    },
    sampleSvgSnippet: `<g id="logo-emblem" transform="translate(250, 185)"><path d="M -50 0 C -50 -45 45 -50 50 0 C 55 45 -40 55 -45 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M -25 -5 C -25 -28 20 -28 20 -2 C 20 22 -15 22 -12 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="35" cy="-45" r="3.5" fill="currentColor"/><circle cx="-42" cy="38" r="2.5" fill="currentColor"/></g>`
  },

  MINIMAL_CORPORATE: {
    styleName: "Cấu Trúc Tối Giản Vững Chãi & Trụ Cột Phát Triển",
    targetIndustries: ["Tài chính - Ngân hàng", "Luật & Tư vấn", "Doanh nghiệp / Corporate", "In ấn & Xuất bản"],
    visualMetaphors: ["Cột thức kiến trúc", "Khối lập phương đối xứng", "Mũi tên vươn cao", "Vòng tròn liên kết"],
    geometryRules: {
      strokeHierarchy: { primary: "3.0px", secondary: "2.0px", accent: "1.0px" },
      recommendedShapes: ["sharp rects", "orthogonal lines", "golden circles", "symmetry axes"]
    },
    sampleSvgSnippet: `<g id="logo-emblem" transform="translate(250, 185)"><rect x="-45" y="-45" width="90" height="90" rx="8" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M -45 0 L 45 0 M 0 -45 L 0 45" stroke="currentColor" stroke-width="1.8"/><circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="2.0" stroke-dasharray="4 3"/></g>`
  },

  CREATIVE_EDITORIAL: {
    styleName: "Nghệ Thuật Đương Đại & Hình Học Phá Cách",
    targetIndustries: ["Truyền thông & Giải trí", "Studio Thiết kế", "Sáng tạo nội dung", "Kiến trúc & Nội thất"],
    visualMetaphors: ["Giao thoa ánh sáng", "Hình học trừu tượng", "Lăng kính đa sắc", "Khung nhìn điện ảnh"],
    geometryRules: {
      strokeHierarchy: { primary: "2.4px", secondary: "1.6px", accent: "0.8px" },
      recommendedShapes: ["intersecting circles", "dynamic polygons", "abstract curves"]
    },
    sampleSvgSnippet: `<g id="logo-emblem" transform="translate(250, 185)"><circle cx="-22" cy="0" r="45" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="22" cy="0" r="45" fill="none" stroke="currentColor" stroke-width="2.2"/><polygon points="0,-35 28,15 -28,15" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="0" cy="0" r="4" fill="currentColor"/></g>`
  }
};

/**
 * Tìm kiếm Archetype phù hợp nhất dựa trên Ngành nghề và Phong cách
 */
export function getArchetypeForIndustry(
  industry: string,
  styleVibes: string[] = []
): { key: string; archetype: DesignArchetype } {
  const combined = `${industry} ${styleVibes.join(" ")}`.toLowerCase();

  if (
    combined.includes("công nghệ") ||
    combined.includes("phần mềm") ||
    combined.includes("tech") ||
    combined.includes("ai film") ||
    combined.includes("fintech") ||
    combined.includes("morphic") ||
    combined.includes("số")
  ) {
    return { key: "TECH_GEOMETRIC", archetype: DESIGN_ARCHETYPES.TECH_GEOMETRIC };
  }

  if (
    combined.includes("thời trang") ||
    combined.includes("mỹ phẩm") ||
    combined.includes("làm đẹp") ||
    combined.includes("fashion") ||
    combined.includes("beauty") ||
    combined.includes("luxury") ||
    combined.includes("bất động sản")
  ) {
    return { key: "LUXURY_MONOGRAM", archetype: DESIGN_ARCHETYPES.LUXURY_MONOGRAM };
  }

  if (
    combined.includes("f&b") ||
    combined.includes("ẩm thực") ||
    combined.includes("cà phê") ||
    combined.includes("coffee") ||
    combined.includes("trà") ||
    combined.includes("nông sản") ||
    combined.includes("organic") ||
    combined.includes("rustic") ||
    combined.includes("wabi-sabi")
  ) {
    return { key: "ORGANIC_ARTISANAL", archetype: DESIGN_ARCHETYPES.ORGANIC_ARTISANAL };
  }

  if (
    combined.includes("sáng tạo") ||
    combined.includes("truyền thông") ||
    combined.includes("studio") ||
    combined.includes("nghệ thuật") ||
    combined.includes("creative")
  ) {
    return { key: "CREATIVE_EDITORIAL", archetype: DESIGN_ARCHETYPES.CREATIVE_EDITORIAL };
  }

  return { key: "MINIMAL_CORPORATE", archetype: DESIGN_ARCHETYPES.MINIMAL_CORPORATE };
}

/**
 * Tạo khối hướng dẫn nạp vào System Prompt của Gemini AI
 */
export function formatArchetypesForGeminiPrompt(): string {
  let text = "### VECTOR DESIGN ARCHETYPES KNOWLEDGE BASE (KHO TRI THỨC HÌNH HỌC THIẾT KẾ):\n\n";

  for (const [key, arch] of Object.entries(DESIGN_ARCHETYPES)) {
    text += `#### [ARCHETYPE: ${key}] - ${arch.styleName}\n`;
    text += `- Ngành nghề mục tiêu: ${arch.targetIndustries.join(", ")}\n`;
    text += `- Ẩn dụ thị giác: ${arch.visualMetaphors.join(", ")}\n`;
    text += `- Phân cấp nét vẽ (Stroke Hierarchy): Nét chính ${arch.geometryRules.strokeHierarchy.primary}, Nét phụ ${arch.geometryRules.strokeHierarchy.secondary}, Nét điểm nhấn ${arch.geometryRules.strokeHierarchy.accent}\n`;
    text += `- Hình khối khuyên dùng: ${arch.geometryRules.recommendedShapes.join(", ")}\n`;
    text += `- Đoạn mã SVG mẫu tham chiếu cho #logo-emblem:\n\`\`\`xml\n${arch.sampleSvgSnippet}\n\`\`\`\n\n`;
  }

  return text;
}

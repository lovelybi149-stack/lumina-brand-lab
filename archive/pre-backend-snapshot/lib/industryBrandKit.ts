/**
 * LUMINA BRAND LAB — INDUSTRY BRAND IDENTITY GENERATOR
 * Tự động tạo Slogan, Câu chuyện thương hiệu, Bảng màu và 3 Option Logo Master
 * theo đúng Ngành nghề & Tên thương hiệu của khách hàng (không dùng fallback cà phê cho mọi ngành).
 */

import { ColorItem, LogoOption, TypographyConfig } from "../types/curation";

export type IndustryCategory = "tech" | "fashion" | "fnb" | "printing" | "corporate";

/**
 * Phân loại ngành nghề dựa trên thông tin Brief của khách
 */
export function detectIndustryCategory(
  industry: string,
  targetAudience = "",
  brandName = ""
): IndustryCategory {
  const combined = `${industry} ${targetAudience} ${brandName}`.toLowerCase();

  if (
    combined.includes("in ấn") ||
    combined.includes("printing") ||
    combined.includes("crestec")
  ) {
    return "printing";
  }

  if (
    combined.includes("công nghệ") ||
    combined.includes("phần mềm") ||
    combined.includes("software") ||
    combined.includes("tech") ||
    combined.includes("ai film") ||
    combined.includes("morphic") ||
    combined.includes("digital") ||
    combined.includes("dữ liệu") ||
    combined.includes("phim ai")
  ) {
    return "tech";
  }

  if (
    combined.includes("thời trang") ||
    combined.includes("may mặc") ||
    combined.includes("làm đẹp") ||
    combined.includes("mỹ phẩm") ||
    combined.includes("fashion") ||
    combined.includes("beauty") ||
    combined.includes("atelier") ||
    combined.includes("ready-to-wear") ||
    combined.includes("quiet luxury")
  ) {
    return "fashion";
  }

  if (
    combined.includes("f&b") ||
    combined.includes("cà phê") ||
    combined.includes("coffee") ||
    combined.includes("ẩm thực") ||
    combined.includes("nhà hàng") ||
    combined.includes("quán") ||
    combined.includes("trà") ||
    combined.includes("roaster")
  ) {
    return "fnb";
  }

  return "corporate";
}

/**
 * Tạo hình dáng biểu tượng dựa trên Archetype Switcher
 */
export function renderEmblemShape(
  shape: "tech" | "circle" | "luxury" | "monogram" | "organic",
  brandName: string,
  pColor: string,
  sColor: string,
  aColor: string
): string {
  const initial = (brandName || "L").trim().charAt(0).toUpperCase();

  switch (shape) {
    case "tech":
      return `
    <!-- Khối Đa Giác Công Nghệ / Vi Mạch Số -->
    <polygon points="0,-85 74,-42 74,42 0,85 -74,42 -74,-42" fill="none" stroke="${pColor}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="${sColor}" stroke-width="1.8" stroke-linejoin="round" stroke-dasharray="8 4"/>
    <circle cx="0" cy="0" r="16" fill="${pColor}" opacity="0.15"/>
    <circle cx="0" cy="0" r="6" fill="${aColor}"/>
    <line x1="0" y1="-85" x2="0" y2="-60" stroke="${aColor}" stroke-width="2"/>
    <line x1="74" y1="-42" x2="52" y2="-30" stroke="${aColor}" stroke-width="2"/>
    <line x1="74" y1="42" x2="52" y2="30" stroke="${aColor}" stroke-width="2"/>
    <line x1="0" y1="85" x2="0" y2="60" stroke="${aColor}" stroke-width="2"/>
    <line x1="-74" y1="42" x2="-52" y2="30" stroke="${aColor}" stroke-width="2"/>
    <line x1="-74" y1="-42" x2="-52" y2="-30" stroke="${aColor}" stroke-width="2"/>
    <circle cx="0" cy="-85" r="4" fill="${aColor}"/>
    <circle cx="74" cy="-42" r="4" fill="${sColor}"/>
    <circle cx="74" cy="42" r="4" fill="${pColor}"/>
    <circle cx="0" cy="85" r="4" fill="${aColor}"/>
    <circle cx="-74" cy="42" r="4" fill="${sColor}"/>
    <circle cx="-74" cy="-42" r="4" fill="${pColor}"/>
      `;

    case "circle":
      return `
    <!-- Khối Tròn Tối Giản / Minimal Eclipse -->
    <circle cx="0" cy="0" r="75" fill="none" stroke="${pColor}" stroke-width="2.5" stroke-dasharray="320 18"/>
    <circle cx="0" cy="0" r="52" fill="none" stroke="${sColor}" stroke-width="1.8"/>
    <circle cx="20" cy="-15" r="32" fill="${aColor}" opacity="0.25"/>
    <circle cx="-12" cy="18" r="8" fill="${pColor}"/>
    <line x1="-85" y1="0" x2="85" y2="0" stroke="${sColor}" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.6"/>
    <circle cx="75" cy="0" r="3.5" fill="${aColor}"/>
    <circle cx="-75" cy="0" r="3.5" fill="${aColor}"/>
      `;

    case "luxury":
      return `
    <!-- Khối Kim Cương Sang Trọng / Luxury Rhombus Prism -->
    <polygon points="0,-85 68,0 0,85 -68,0" fill="none" stroke="${pColor}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="0,-60 48,0 0,60 -48,0" fill="none" stroke="${sColor}" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="0" y1="-85" x2="0" y2="85" stroke="${aColor}" stroke-width="1.2" stroke-opacity="0.7"/>
    <line x1="-68" y1="0" x2="68" y2="0" stroke="${aColor}" stroke-width="1.2" stroke-opacity="0.7"/>
    <circle cx="0" cy="0" r="6" fill="${pColor}"/>
    <circle cx="0" cy="-85" r="3" fill="${sColor}"/>
    <circle cx="0" cy="85" r="3" fill="${sColor}"/>
    <circle cx="-68" cy="0" r="3" fill="${sColor}"/>
    <circle cx="68" cy="0" r="3" fill="${sColor}"/>
      `;

    case "monogram":
      return `
    <!-- Chữ Lồng Monogram '${initial}' Cách Điệu -->
    <circle cx="0" cy="0" r="76" fill="none" stroke="${sColor}" stroke-width="1.8" stroke-opacity="0.5"/>
    <rect x="-56" y="-56" width="112" height="112" rx="16" fill="none" stroke="${pColor}" stroke-width="2.2" stroke-dasharray="320 20"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Space Grotesk', 'Playfair Display', sans-serif" font-weight="800" font-size="64" fill="${pColor}" letter-spacing="0.05em">${initial}</text>
    <circle cx="45" cy="-45" r="4.5" fill="${aColor}"/>
    <circle cx="-45" cy="45" r="3" fill="${sColor}"/>
      `;

    case "organic":
    default:
      return `
    <!-- Khối Hữu Cơ Tự Nhiên / Organic Leaf Wave -->
    <path d="M -75 -25 C -90 25 -65 70 -20 85 C 25 100 70 75 85 30 C 98 -10 80 -60 45 -80 C 10 -100 -45 -90 -68 -55" fill="none" stroke="${sColor}" stroke-width="2" stroke-dasharray="260 16" stroke-linecap="round"/>
    <path d="M 0 65 C -4 20 -2 -25 35 -65" fill="none" stroke="${pColor}" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M 0 15 C -25 -5 -50 -10 -65 -35 C -45 -45 -15 -35 0 -5" fill="none" stroke="${aColor}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M 12 -15 C 35 -30 65 -30 80 -10 C 65 10 35 12 12 -5" fill="none" stroke="${sColor}" stroke-width="2.0" stroke-linecap="round"/>
    <circle cx="35" cy="-70" r="3.5" fill="${aColor}"/>
    <circle cx="-65" cy="-40" r="2.5" fill="${sColor}"/>
      `;
  }
}

/**
 * Sinh cấu hình Brand Kit động chuẩn xác theo ngành nghề
 */
export function getIndustryBrandKit(
  category: IndustryCategory,
  brandName: string,
  targetAudience = "",
  userSlogan?: string
) {
  const initial = (brandName || "L").trim().charAt(0).toUpperCase();

  if (category === "tech") {
    const defaultSlogan = userSlogan || "Kiến tạo cấu trúc số tương lai";
    const taglines = [
      defaultSlogan,
      "Đột phá giải pháp, định hình tương lai",
      "Nơi trí tuệ nhân tạo định hình cảm xúc",
      "Tái tạo hiện thực qua từng khung hình số"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Electric Blue (Xanh Điện Tử)", hex: "#0A84FF", rgb: "rgb(10, 132, 255)" },
      { role: "Secondary", name: "Space Graphite (Xám Chì)", hex: "#1C1C1E", rgb: "rgb(28, 28, 30)" },
      { role: "Accent", name: "Cyan Laser (Xanh Ngọc Số)", hex: "#00F2FE", rgb: "rgb(0, 242, 254)" },
      { role: "Neutral", name: "Silver Mist (Trắng Bạc)", hex: "#F5F5F7", rgb: "rgb(245, 245, 247)" }
    ];

    const typography: TypographyConfig = {
      heading: "Space Grotesk",
      body: "Plus Jakarta Sans",
      pairing_rationale: "Bộ đôi Sans-serif hình học công nghệ cao, tối ưu tuyệt đối cho hiển thị kỹ thuật số và hỗ trợ tiếng Việt sắc nét.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    };

    const brandStory = `Được thành lập với sứ mệnh tiên phong kiến tạo tương lai số, ${brandName} giao thoa giữa tư duy kỹ thuật chuẩn xác và sức sáng tạo không giới hạn. Chúng tôi khai phóng tiềm năng của trí tuệ nhân tạo và công nghệ đồ họa tiên tiến để chuyển hóa những ý tưởng phức tạp thành những câu chuyện thị giác sống động, mang tầm nhìn vượt thời gian.`;

    const mockups = {
      namecard: {
        front: "Mặt trước phủ màu Đen Graphite #1C1C1E dập kim Hologram biểu tượng vi mạch số, tạo hiệu ứng chuyển sắc tương lai.",
        back: "Mặt sau nền Trắng Bạc #F5F5F7 với mã QR truy cập studio và thông tin kỹ sư số in UV nổi sắc sảo."
      },
      packaging: {
        type: "Hộp phần cứng & Portfolio kỹ thuật số phủ mờ màng Soft-touch.",
        description: "Tem niêm phong bảo mật màu Electric Blue phát quang dưới ánh sáng văn phòng công nghệ."
      },
      signage: {
        type: "Biển hiệu Acrylic đen khối nổi khắc laser hắt LED Cyan 4000K.",
        description: "Logo phát sáng đường nét vi mạch sắc nét tại sảnh trụ sở studio công nghệ."
      }
    };

    return {
      category,
      tagline: defaultSlogan,
      taglines,
      palette,
      typography,
      brandStory,
      mockups,
      options: buildTechLogoOptions(brandName, defaultSlogan, palette, typography, initial)
    };
  }

  if (category === "fashion") {
    const defaultSlogan = userSlogan || "Tinh hoa phong cách, chuẩn mực thanh lịch";
    const taglines = [
      defaultSlogan,
      "The Power of Pure Form",
      "Đẳng cấp thầm lặng, khí chất độc bản",
      "Tĩnh lặng trong phom dáng, chuẩn xác từng đường kim"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Deep Obsidian (Đen Tuyền)", hex: "#111111", rgb: "rgb(17, 17, 17)" },
      { role: "Secondary", name: "Champagne Gold (Vàng Ánh Kim)", hex: "#D4AF37", rgb: "rgb(212, 175, 55)" },
      { role: "Accent", name: "Mineral Taupe (Nâu Xám Khoáng)", hex: "#8C827A", rgb: "rgb(140, 130, 122)" },
      { role: "Neutral", name: "Raw Silk Cream (Be Lụa Thô)", hex: "#F7F5F0", rgb: "rgb(247, 245, 240)" }
    ];

    const typography: TypographyConfig = {
      heading: "Playfair Display",
      body: "Be Vietnam Pro",
      pairing_rationale: "Font tiêu đề Serif cổ điển tôn vinh sự quý phái thượng lưu, kết hợp font nội dung Be Vietnam Pro thanh thoát, chuẩn tỷ lệ vàng.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap"
    };

    const brandStory = `${brandName} là bản tuyên ngôn của sự sang trọng chuẩn mực và phong cách sống tĩnh lặng (Quiet Luxury). Chúng tôi kiến tạo vẻ đẹp trường tồn qua phom dáng chuẩn xác, chất liệu tự nhiên thượng hạng và từng đường cắt tối giản tinh xảo, tôn vinh khí chất độc bản của những tâm hồn am tường thẩm mỹ.`;

    const mockups = {
      namecard: {
        front: "Mặt trước chất liệu giấy cotton 450gsm màu Be Lụa ép kim mờ Champagne Gold biểu tượng monogram.",
        back: "Mặt sau nền Đen Obsidian với đường gân vải lụa ép chìm thanh lịch."
      },
      packaging: {
        type: "Túi giấy mua sắm thời trang quai dệt lụa cao cấp.",
        description: "Hộp cứng đựng sản phẩm bọc giấy mỹ thuật dập nổi logo."
      },
      signage: {
        type: "Biển hiệu đồng xước mờ Brushed Brass gắn nổi trên tường đá cẩm thạch.",
        description: "Hệ thống đèn Spotlight rọi ấm 3000K tôn vinh vẻ đẹp tĩnh lặng của boutique."
      }
    };

    return {
      category,
      tagline: defaultSlogan,
      taglines,
      palette,
      typography,
      brandStory,
      mockups,
      options: buildFashionLogoOptions(brandName, defaultSlogan, palette, typography, initial)
    };
  }

  if (category === "printing") {
    const defaultSlogan = userSlogan || "Sắc nét từng bản in, khẳng định bản sắc";
    const taglines = [
      defaultSlogan,
      "Đột phá công nghệ in ấn, định hình bản sắc",
      "Chuẩn màu từng micron, hoàn hảo mọi ấn phẩm",
      "Precision & Perfection in Every Print"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Cyan Process (Xanh Cyan Chuẩn)", hex: "#00A8E8", rgb: "rgb(0, 168, 232)" },
      { role: "Secondary", name: "Charcoal Slate (Xám Chì Bản Kẽm)", hex: "#2B2D42", rgb: "rgb(43, 45, 66)" },
      { role: "Accent", name: "Laser Magenta (Hồng Magenta Nhấn)", hex: "#E63946", rgb: "rgb(230, 57, 70)" },
      { role: "Neutral", name: "Clean Artboard (Trắng Giấy Phủ)", hex: "#F8F9FA", rgb: "rgb(248, 249, 250)" }
    ];

    const typography: TypographyConfig = {
      heading: "Space Grotesk",
      body: "Plus Jakarta Sans",
      pairing_rationale: "Bộ font hình học sắc sảo, mô phỏng các góc cạnh căn chỉnh của bản kẽm in ấn chuyên nghiệp.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
    };

    const brandStory = `Với bề dày kinh nghiệm và công nghệ in ấn chuẩn xác hàng đầu, ${brandName} là đối tác tin cậy hiện thực hóa mọi ý tưởng thiết kế trên từng chất liệu cao cấp. Từ độ phủ mực vi mô đến kỹ thuật gia công tinh tế, chúng tôi cam kết chất lượng tuyệt đối cho từng bản in xuất xưởng.`;

    const mockups = {
      namecard: {
        front: "Mặt trước phủ màu Xám Chì #2B2D42 in UV bóng biểu tượng chữ C cách điệu, mép danh thiếp mạ cạnh màu Cyan.",
        back: "Mặt sau nền Trắng Giấy Phủ với thông số màu in CMYK chuẩn xác."
      },
      packaging: {
        type: "Hộp mẫu in catalogue & mẫu giấy chuyên dụng.",
        description: "Bao bì bìa carton cứng bồi giấy kraft xám kèm tem định vị chuẩn in."
      },
      signage: {
        type: "Biển hiệu thép mạ kẽm sơn tĩnh điện chữ nổi mica xanh Cyan phát sáng viền.",
        description: "Hệ thống nhận diện thương hiệu chuẩn xác tại phân xưởng in."
      }
    };

    return {
      category,
      tagline: defaultSlogan,
      taglines,
      palette,
      typography,
      brandStory,
      mockups,
      options: buildPrintingLogoOptions(brandName, defaultSlogan, palette, typography, initial)
    };
  }

  // Fallback F&B / Wabi-sabi
  const defaultSlogan = userSlogan || "Chạm chất mộc, lắng tiếng gió reo";
  const taglines = [
    defaultSlogan,
    "Awaken Your Pure Frequency",
    "Hương vị nguyên bản từ triền đồi bazan",
    "Giao hòa tĩnh lặng giữa cà phê và thiên nhiên"
  ];

  const palette: ColorItem[] = [
    { role: "Primary", name: "Nâu Vỏ Thông Già", hex: "#3D2B1F", rgb: "rgb(61, 43, 31)" },
    { role: "Secondary", name: "Đất Đỏ Bazan Mờ", hex: "#9E6B55", rgb: "rgb(158, 107, 85)" },
    { role: "Accent", name: "Xanh Thông Núi Mờ", hex: "#5B7065", rgb: "rgb(91, 112, 101)" },
    { role: "Neutral", name: "Trắng Giấy Dó Mộc", hex: "#F4EFEA", rgb: "rgb(244, 239, 234)" }
  ];

  const typography: TypographyConfig = {
    heading: "Fraunces",
    body: "Be Vietnam Pro",
    pairing_rationale: "Serif hữu cơ Fraunces kết hợp Sans-serif mộc mạc Be Vietnam Pro cho phong cách Wabi-sabi tự nhiên.",
    google_fonts_url: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&display=swap"
  };

  const brandStory = `Ẩn mình giữa triền đồi thông lộng gió của Đà Lạt, ${brandName} là nơi thời gian chậm lại để tâm hồn tìm về nguyên bản. Giao hòa giữa triết lý Wabi-sabi tôn vinh nét đẹp thô mộc tự nhiên và hồn gỗ Tây Nguyên trầm ấm, từng giọt hương vị đặc sản tại ${brandName} mở ra không gian tĩnh lặng nuôi dưỡng sự an yên và khơi nguồn cảm hứng sáng tạo thuần khiết.`;

  const mockups = {
    namecard: {
      front: "Mặt trước phủ màu Trắng Giấy Dó Mộc trên chất liệu cotton 380gsm dập nổi mù biểu tượng.",
      back: "Mặt sau nền Nâu Vỏ Thông Già với thông tin liên hệ và mã QR in lụa thanh nhã."
    },
    packaging: {
      type: "Túi kraft màng nhôm sinh học kèm tem dán thủ công.",
      description: "Tem niêm phong màu Xanh Thông Núi ghi chú ngày rang và biểu tượng mộc."
    },
    signage: {
      type: "Biển hiệu gỗ thông đốt Shou Sugi Ban khắc chìm.",
      description: "Hệ thống đèn LED vàng ấm 2700K hắt sáng từ bên trong thớ gỗ."
    }
  };

  return {
    category: "fnb" as const,
    tagline: defaultSlogan,
    taglines,
    palette,
    typography,
    brandStory,
    mockups,
    options: buildFnbLogoOptions(brandName, defaultSlogan, palette, typography)
  };
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH CÔNG NGHỆ & PHẦN MỀM (TECH / AI / MORPHIC)       */
/* ========================================================================= */
function buildTechLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig,
  initial: string
): LogoOption[] {
  const p = palette[0]?.hex || "#0A84FF";
  const s = palette[1]?.hex || "#1C1C1E";
  const a = palette[2]?.hex || "#00F2FE";
  const n = palette[3]?.hex || "#F5F5F7";
  const hFont = typography.heading;
  const bFont = typography.body;

  // Opt 1: Khối Đa Giác / Vi Mạch Số (Digital Geometric Nodes)
  const opt1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 0.18em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: ${p}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${p}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <polygon points="0,-85 74,-42 74,42 0,85 -74,42 -74,-42" fill="none" stroke="${s}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="${p}" stroke-width="2" stroke-linejoin="round" stroke-dasharray="10 4"/>
    <circle cx="0" cy="0" r="14" fill="${p}" opacity="0.15"/>
    <circle cx="0" cy="0" r="6" fill="${a}"/>
    <line x1="0" y1="-85" x2="0" y2="-60" stroke="${a}" stroke-width="2"/>
    <line x1="74" y1="-42" x2="52" y2="-30" stroke="${a}" stroke-width="2"/>
    <line x1="74" y1="42" x2="52" y2="30" stroke="${a}" stroke-width="2"/>
    <line x1="0" y1="85" x2="0" y2="60" stroke="${a}" stroke-width="2"/>
    <line x1="-74" y1="42" x2="-52" y2="30" stroke="${a}" stroke-width="2"/>
    <line x1="-74" y1="-42" x2="-52" y2="-30" stroke="${a}" stroke-width="2"/>
    <circle cx="0" cy="-85" r="4" fill="${p}"/>
    <circle cx="74" cy="-42" r="4" fill="${a}"/>
    <circle cx="74" cy="42" r="4" fill="${p}"/>
    <circle cx="0" cy="85" r="4" fill="${a}"/>
    <circle cx="-74" cy="42" r="4" fill="${p}"/>
    <circle cx="-74" cy="-42" r="4" fill="${a}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">AI &amp; DIGITAL VISUAL LAB</text>
    <g transform="translate(250, 388)">
      <line x1="-70" y1="0" x2="-12" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.5" fill="${a}"/>
      <line x1="12" y1="0" x2="70" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${p}" letter-spacing="0.25em">NEXT-GEN STUDIO</text>
  </g>
</svg>`;

  // Opt 2: Chữ cái đầu cách điệu tối giản (Tech Monogram)
  const opt2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 0.18em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10.5px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: ${p}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${s}" stroke-width="0.8" stroke-opacity="0.2" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <circle cx="0" cy="0" r="76" fill="none" stroke="${p}" stroke-width="1.8" stroke-opacity="0.5"/>
    <rect x="-56" y="-56" width="112" height="112" rx="16" fill="none" stroke="${s}" stroke-width="2.5" stroke-dasharray="320 20"/>
    <text x="0" y="24" text-anchor="middle" font-family="'${hFont}', sans-serif" font-weight="800" font-size="64" fill="${p}" letter-spacing="0.05em">${initial}</text>
    <circle cx="45" cy="-45" r="4.5" fill="${a}"/>
    <circle cx="-45" cy="45" r="3.5" fill="${p}"/>
    <line x1="-56" y1="0" x2="-76" y2="0" stroke="${a}" stroke-width="1.8"/>
    <line x1="56" y1="0" x2="76" y2="0" stroke="${a}" stroke-width="1.8"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">CYBER TECH MONOGRAM</text>
    <g transform="translate(250, 388)">
      <line x1="-60" y1="0" x2="-10" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.5" fill="${s}"/>
      <line x1="10" y1="0" x2="60" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${p}" letter-spacing="0.25em">ARTIFICIAL INTELLIGENCE</text>
  </g>
</svg>`;

  // Opt 3: Khối lập phương vô cực (Infinite Cube / Quantum Flux)
  const opt3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 0.18em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10.5px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: ${p}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <!-- Mặt trên lập phương -->
    <polygon points="0,-75 62,-40 0,-5 -62,-40" fill="${p}" opacity="0.2" stroke="${p}" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Mặt trái -->
    <polygon points="-62,-40 0,-5 0,65 -62,30" fill="${s}" opacity="0.15" stroke="${s}" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Mặt phải -->
    <polygon points="0,-5 62,-40 62,30 0,65" fill="${a}" opacity="0.3" stroke="${a}" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Lõi năng lượng lượng tử bên trong -->
    <circle cx="0" cy="-5" r="9" fill="${p}"/>
    <line x1="0" y1="-5" x2="0" y2="-75" stroke="${a}" stroke-width="1.8" stroke-dasharray="4 3"/>
    <line x1="0" y1="-5" x2="62" y2="30" stroke="${p}" stroke-width="1.8" stroke-dasharray="4 3"/>
    <line x1="0" y1="-5" x2="-62" y2="30" stroke="${s}" stroke-width="1.8" stroke-dasharray="4 3"/>
    <circle cx="0" cy="-75" r="3.5" fill="${a}"/>
    <circle cx="62" cy="30" r="3.5" fill="${p}"/>
    <circle cx="-62" cy="30" r="3.5" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">INFINITE DIMENSION CUBE</text>
    <g transform="translate(250, 388)">
      <line x1="-60" y1="0" x2="-10" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.5" fill="${a}"/>
      <line x1="10" y1="0" x2="60" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${p}" letter-spacing="0.25em">QUANTUM &amp; CODE</text>
  </g>
</svg>`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Khối Đa Giác / Vi Mạch Số",
      concept_note: "Biểu tượng mạng lưới hình học đối xứng thể hiện tính chuẩn xác của mã code và sức mạnh xử lý số.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "tech", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Chữ Cái Đầu Cách Điệu (Tech Monogram)",
      concept_note: `Monogram '${initial}' đóng khung vi mạch, cô đọng bản sắc thương hiệu trong biểu tượng nhận diện tối giản.`,
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "monogram", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Khối Lập Phương Vô Cực (Infinite Cube)",
      concept_note: "Cấu trúc lập phương không gian đa chiều, tượng trưng cho trí tuệ nhân tạo khai phá thế giới số vô tận.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH THỜI TRANG & LÀM ĐẸP (FASHION / QUIET LUXURY)    */
/* ========================================================================= */
function buildFashionLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig,
  initial: string
): LogoOption[] {
  const p = palette[0]?.hex || "#111111";
  const s = palette[1]?.hex || "#D4AF37";
  const a = palette[2]?.hex || "#8C827A";
  const n = palette[3]?.hex || "#F7F5F0";
  const hFont = typography.heading;
  const bFont = typography.body;

  // Opt 1: Khối Kim Cương / Đường Nét Thanh Lịch (Luxury Prism)
  const opt1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.22em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${s}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <polygon points="0,-82 66,0 0,82 -66,0" fill="none" stroke="${p}" stroke-width="2.4" stroke-linejoin="round"/>
    <polygon points="0,-58 46,0 0,58 -46,0" fill="none" stroke="${s}" stroke-width="1.6" stroke-linejoin="round"/>
    <line x1="0" y1="-82" x2="0" y2="82" stroke="${a}" stroke-width="1" stroke-opacity="0.6"/>
    <line x1="-66" y1="0" x2="66" y2="0" stroke="${a}" stroke-width="1" stroke-opacity="0.6"/>
    <circle cx="0" cy="0" r="5" fill="${p}"/>
    <circle cx="0" cy="-82" r="3" fill="${s}"/>
    <circle cx="0" cy="82" r="3" fill="${s}"/>
    <circle cx="-66" cy="0" r="3" fill="${s}"/>
    <circle cx="66" cy="0" r="3" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">HAUTE COUTURE &amp; ATELIER</text>
    <g transform="translate(250, 388)">
      <line x1="-60" y1="0" x2="-12" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.5"/>
      <circle cx="0" cy="0" r="2.2" fill="${s}"/>
      <line x1="12" y1="0" x2="60" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.5"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${a}" letter-spacing="0.25em">PARIS • MILANO • HANOI</text>
  </g>
</svg>`;

  // Opt 2: Chữ Lồng Monogram Quý Tộc
  const opt2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.22em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${p}" stroke-width="0.7" stroke-opacity="0.2" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <circle cx="0" cy="0" r="76" fill="none" stroke="${s}" stroke-width="1.8" stroke-dasharray="320 18"/>
    <circle cx="0" cy="0" r="58" fill="none" stroke="${a}" stroke-width="1" stroke-opacity="0.5"/>
    <text x="0" y="22" text-anchor="middle" font-family="'${hFont}', serif" font-weight="700" font-size="62" fill="${p}" letter-spacing="0.08em">${initial}</text>
    <circle cx="0" cy="-76" r="3" fill="${s}"/>
    <circle cx="0" cy="76" r="3" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">TIMELESS LUXURY MONOGRAM</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2" fill="${s}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${a}" letter-spacing="0.25em">EST. 2024</text>
  </g>
</svg>`;

  // Opt 3: Biểu Tượng Cánh Hoa Tối Giản (Minimal Floral)
  const opt3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.22em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${s}" stroke-width="0.7" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <path d="M 0 -80 C 35 -45 50 -10 0 45 C -50 -10 -35 -45 0 -80 Z" fill="none" stroke="${p}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M -70 -15 C -35 -35 5 -20 35 25 C -5 45 -40 30 -70 -15 Z" fill="none" stroke="${s}" stroke-width="1.8" stroke-linejoin="round" opacity="0.8"/>
    <path d="M 70 -15 C 35 -35 -5 -20 -35 25 C 5 45 40 30 70 -15 Z" fill="none" stroke="${a}" stroke-width="1.8" stroke-linejoin="round" opacity="0.8"/>
    <circle cx="0" cy="55" r="4" fill="${s}"/>
    <circle cx="0" cy="-80" r="2.5" fill="${p}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">ORGANIC SILK &amp; SILHOUETTE</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2" fill="${s}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${a}" letter-spacing="0.25em">NATURE &amp; ELEGANCE</text>
  </g>
</svg>`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Khối Kim Cương Sang Trọng (Luxury Prism)",
      concept_note: "Phom dáng hình học thanh mảnh chuẩn mực Haute Couture, tôn vinh khí chất thời thượng trường tồn.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Monogram Quý Tộc Cách Điệu",
      concept_note: `Chữ cái '${initial}' được uốn nét chuẩn mực, lồng trong hai vòng quỹ đạo vàng ánh kim sang trọng.`,
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "monogram", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Cánh Hoa Lụa Tối Giản (Minimal Floral)",
      concept_note: "Đường cong tự nhiên mô phỏng thớ vải lụa mềm rủ và cánh hoa thanh tao, mang tinh thần Quiet Luxury.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH IN ẤN / CRESTEC (PRINTING & PRECISION COLOR)      */
/* ========================================================================= */
function buildPrintingLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig,
  initial: string
): LogoOption[] {
  const p = palette[0]?.hex || "#00A8E8";
  const s = palette[1]?.hex || "#2B2D42";
  const a = palette[2]?.hex || "#E63946";
  const n = palette[3]?.hex || "#F8F9FA";
  const hFont = typography.heading;
  const bFont = typography.body;

  // Opt 1: Chữ C Cách Điệu In Ấn (Chuyên cho CRESTEC)
  const opt1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.20em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9.5px; letter-spacing: 0.22em; fill: #6B7280; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${p}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <!-- Vòng cung chữ C cách điệu công nghệ in kẽm -->
    <path d="M 45 -55 C 10 -85 -55 -70 -75 -25 C -95 25 -70 80 -15 85 C 35 90 70 50 65 15" fill="none" stroke="${p}" stroke-width="12" stroke-linecap="round"/>
    <path d="M 28 -38 C 5 -60 -40 -48 -55 -15 C -70 20 -50 60 -10 65 C 25 70 50 40 45 15" fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="65" cy="15" r="7" fill="${a}"/>
    <circle cx="45" cy="-55" r="5" fill="${p}"/>
    <!-- Thước căn chuẩn in CMYK -->
    <line x1="-85" y1="0" x2="-75" y2="0" stroke="${s}" stroke-width="2"/>
    <line x1="75" y1="0" x2="85" y2="0" stroke="${s}" stroke-width="2"/>
    <line x1="0" y1="-85" x2="0" y2="-75" stroke="${s}" stroke-width="2"/>
    <line x1="0" y1="75" x2="0" y2="85" stroke="${s}" stroke-width="2"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">HIGH PRECISION PRINTING</text>
    <g transform="translate(250, 388)">
      <line x1="-70" y1="0" x2="-10" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.5"/>
      <circle cx="0" cy="0" r="2.5" fill="${a}"/>
      <line x1="10" y1="0" x2="70" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.5"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="#9CA3AF" letter-spacing="0.25em">OFFSET • DIGITAL • PACKAGING</text>
  </g>
</svg>`;

  // Opt 2: Căn chỉnh bản kẽm đối xứng
  const opt2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.20em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9.5px; letter-spacing: 0.22em; fill: #6B7280; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${s}" stroke-width="0.8" stroke-opacity="0.2" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <rect x="-60" y="-60" width="120" height="120" rx="14" fill="none" stroke="${s}" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="${p}" stroke-width="8" stroke-dasharray="190 40"/>
    <circle cx="0" cy="0" r="16" fill="${a}"/>
    <circle cx="-60" cy="-60" r="4" fill="${p}"/>
    <circle cx="60" cy="-60" r="4" fill="${s}"/>
    <circle cx="60" cy="60" r="4" fill="${p}"/>
    <circle cx="-60" cy="60" r="4" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">COLOR CALIBRATION MATRIX</text>
    <g transform="translate(250, 388)">
      <line x1="-60" y1="0" x2="-10" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.5" fill="${s}"/>
      <line x1="10" y1="0" x2="60" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
  </g>
</svg>`;

  // Opt 3: Khối Tròn Đa Sắc In Ấn
  const opt3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.20em; fill: ${s}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.35em; fill: ${p}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9.5px; letter-spacing: 0.22em; fill: #6B7280; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <circle cx="-18" cy="0" r="48" fill="none" stroke="${p}" stroke-width="5" opacity="0.85"/>
    <circle cx="18" cy="0" r="48" fill="none" stroke="${s}" stroke-width="5" opacity="0.85"/>
    <circle cx="0" cy="0" r="14" fill="${a}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">CMYK CHROMATIC OVERLAY</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.5" fill="${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
  </g>
</svg>`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Chữ C Cách Điệu In Ấn (Crestec Monogram)",
      concept_note: "Biểu tượng chữ C cách điệu nét đậm viền kép kết hợp hạt điểm màu, chuẩn theo đúng brief khách hàng.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "monogram", letterSpacing: 0.20, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Ma Trận Căn Chuẩn Bản Kẽm (Registration Matrix)",
      concept_note: "Cấu trúc định vị góc kẽm in 4 góc kết hợp vòng xoay Cyan tạo sự an tâm tuyệt đối về chất lượng kỹ thuật.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "tech", letterSpacing: 0.20, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Giao Thoa Đa Sắc (Chromatic Overlay)",
      concept_note: "Sự giao thoa quang học của hai vòng tròn màu in Cyan và Charcoal, thể hiện bản sắc sáng tạo không ngừng.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.20, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH F&B / CÀ PHÊ (GIÓ MỘC / AURA ROASTERS)           */
/* ========================================================================= */
function buildFnbLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig
): LogoOption[] {
  const p = palette[0]?.hex || "#3D2B1F";
  const s = palette[1]?.hex || "#9E6B55";
  const a = palette[2]?.hex || "#5B7065";
  const n = palette[3]?.hex || "#F4EFEA";
  const hFont = typography.heading;
  const bFont = typography.body;

  // Opt 1: Ensō Wabi-sabi & Làn Gió Mộc
  const opt1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 32px; letter-spacing: 0.16em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.38em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.24em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${s}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <path d="M -75 -40 C -95 0 -85 55 -45 80 C -5 105 55 95 80 55 C 102 18 90 -45 55 -75 C 22 -100 -35 -95 -65 -65" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round" stroke-dasharray="280 20"/>
    <path d="M -85 20 C -70 -35 -20 -70 40 -65 C 75 -62 82 -25 58 5 C 38 30 -5 25 -20 -5 C -30 -30 -5 -48 18 -42" fill="none" stroke="${s}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M -60 55 C -25 75 35 70 65 30 C 85 -5 65 -45 25 -52 C -15 -58 -45 -25 -35 15 C -28 42 5 45 22 28" fill="none" stroke="${a}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="88" cy="-15" r="3" fill="${a}"/>
    <circle cx="-70" cy="-60" r="2" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="370" text-anchor="middle" class="brand-sub">COFFEE &amp; SLOW WORKSPACE</text>
    <g transform="translate(250, 390)">
      <line x1="-70" y1="0" x2="-15" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.5"/>
      <circle cx="0" cy="0" r="2.5" fill="${a}"/>
      <line x1="15" y1="0" x2="70" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.5"/>
    </g>
    <text x="250" y="415" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
    <text x="250" y="434" text-anchor="middle" font-family="'${bFont}', sans-serif" font-weight="500" font-size="8" fill="${s}" letter-spacing="0.28em">EST. 2024</text>
  </g>
</svg>`;

  // Opt 2: Mầm Cây Đôi (Botanical Sprout)
  const opt2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.20em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10.5px; letter-spacing: 0.35em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${p}" stroke-width="0.7" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <path d="M -80 -15 C -95 30 -70 75 -25 90 C 25 105 75 80 90 35 C 102 -5 85 -55 50 -80 C 15 -100 -40 -95 -68 -60" fill="none" stroke="${s}" stroke-width="1.8" stroke-dasharray="260 18" stroke-linecap="round"/>
    <path d="M 0 65 C -5 20 -2 -25 35 -65" fill="none" stroke="${p}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M 0 15 C -25 -5 -50 -10 -65 -35 C -45 -45 -15 -35 0 -5" fill="none" stroke="${a}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M 12 -15 C 35 -30 65 -30 80 -10 C 65 10 35 12 12 -5" fill="none" stroke="${s}" stroke-width="2.0" stroke-linecap="round"/>
    <circle cx="35" cy="-70" r="3" fill="${a}"/>
    <circle cx="-65" cy="-40" r="2.5" fill="${s}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">ARTISANAL BOTANICAL &amp; COFFEE</text>
    <g transform="translate(250, 388)">
      <line x1="-60" y1="0" x2="-10" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="${p}"/>
      <line x1="10" y1="0" x2="60" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
  </g>
</svg>`;

  // Opt 3: Đỉnh Núi & Tỷ Lệ Vàng Mộc
  const opt3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('${typography.google_fonts_url}');
      .brand-title { font-family: '${hFont}', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.18em; fill: ${p}; }
      .brand-sub { font-family: '${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: ${s}; }
      .brand-tagline { font-family: '${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: ${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
    <polygon points="0,-75 65,45 -65,45" fill="none" stroke="${p}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="0,-45 42,45 -42,45" fill="none" stroke="${s}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="0" cy="0" r="18" fill="none" stroke="${a}" stroke-width="1.5"/>
    <circle cx="0" cy="-75" r="3.5" fill="${a}"/>
    <circle cx="65" cy="45" r="3" fill="${p}"/>
    <circle cx="-65" cy="45" r="3" fill="${p}"/>
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">GOLDEN RATIO MOUNTAIN PEAK</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2" fill="${s}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">${tagline.toUpperCase()}</text>
  </g>
</svg>`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Ensō Wabi-sabi & Làn Gió Mộc",
      concept_note: "Vòng tròn Ensō bất toàn cùng những nét cuộn của gió mộc và thớ gỗ thông Đà Lạt.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "organic", letterSpacing: 0.16, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Botanical Sprout & Mầm Cây Đôi",
      concept_note: "Mầm cây hữu cơ vươn lên từ hạt cà phê mộc, mang ý niệm về khởi sinh thuần khiết.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "organic", letterSpacing: 0.20, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Đỉnh Núi & Tỷ Lệ Vàng Mộc",
      concept_note: "Hình học đỉnh núi LangBiang kết hợp vòng tròn mặt trời theo tỷ lệ vàng thiêng liêng.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    }
  ];
}


const fs = require('fs');
const path = 'lib/industryBrandKit.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. New categories inside getIndustryBrandKit
const targetPrintingEnd = `    return {
      category,
      tagline: defaultSlogan,
      taglines,
      palette,
      typography,
      brandStory,
      mockups,
      options: buildPrintingLogoOptions(brandName, defaultSlogan, palette, typography, initial)
    };
  }`;

const newCategoryBlocks = `    return {
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

  if (category === "agriculture") {
    const defaultSlogan = userSlogan || "Hương xanh - Chất sạch";
    const taglines = [
      defaultSlogan,
      "Nông sản sạch từ tâm người trồng",
      "Sinh thái thuần khiết, tươi mát mỗi ngày",
      "Green Harvest, Healthy Life"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Emerald Forest (Xanh Ngọc Sinh Thái)", hex: "#059669", rgb: "rgb(5, 150, 105)" },
      { role: "Secondary", name: "Sprout Green (Xanh Mầm Lá)", hex: "#10B981", rgb: "rgb(16, 185, 129)" },
      { role: "Accent", name: "Sunlight Gold (Vàng Nắng Phù Sa)", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
      { role: "Neutral", name: "Clean Pearl (Trắng Tinh Khiết)", hex: "#F0FDF4", rgb: "rgb(240, 253, 244)" }
    ];

    const typography: TypographyConfig = {
      heading: "Plus Jakarta Sans",
      body: "Be Vietnam Pro",
      pairing_rationale: "Font chữ hiện đại, khỏe khoắn kết hợp sự trong lành thuần khiết của nông nghiệp hữu cơ chuẩn quốc tế.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
    };

    const brandStory = \`\${brandName} là hành trình tìm về những giá trị thuần khiết nhất từ thiên nhiên. Chúng tôi kết nối quy trình canh tác sinh thái bền vững với bàn tay chăm sóc tận tâm, mang nguồn thực phẩm sạch, tươi ngon và tràn đầy năng lượng đất trời đến từng bữa ăn gia đình.\`;

    const mockups = {
      namecard: {
        front: "Mặt trước chất liệu giấy sinh học kraft trắng in UV biểu tượng mầm lá xanh tươi.",
        back: "Mặt sau nền Xanh Ngọc Sinh Thái với thông tin truy xuất nguồn gốc nông trại."
      },
      packaging: {
        type: "Bao bì hộp giấy tự hủy sinh học & tem niêm phong hữu cơ.",
        description: "Tem dán đạt chuẩn Organic với dấu chứng nhận xanh mát."
      },
      signage: {
        type: "Biển hiệu gỗ tần bì sáng màu cắt CNC biểu tượng xanh lá hắt LED ấm.",
        description: "Không gian trưng bày nông sản sạch văn minh, hiện đại."
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
      options: buildAgricultureLogoOptions(brandName, defaultSlogan, palette, typography)
    };
  }

  if (category === "education") {
    const defaultSlogan = userSlogan || "Kiến tạo tri thức, khơi nguồn sáng tạo";
    const taglines = [
      defaultSlogan,
      "Hệ sinh thái tri thức & không gian sáng tạo",
      "Kết nối trí tuệ, khai phóng tiềm năng",
      "Architecture of Creative Knowledge"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Amber Honey (Hổ Phách Tổ Ong)", hex: "#D97706", rgb: "rgb(217, 119, 6)" },
      { role: "Secondary", name: "Architectural Slate (Xám Đen Đô Thị)", hex: "#1E293B", rgb: "rgb(30, 41, 59)" },
      { role: "Accent", name: "Solar Orange (Cam Năng Động)", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
      { role: "Neutral", name: "Warm Parchment (Giấy Thức Ấm)", hex: "#FFFBEB", rgb: "rgb(255, 251, 235)" }
    ];

    const typography: TypographyConfig = {
      heading: "Space Grotesk",
      body: "Plus Jakarta Sans",
      pairing_rationale: "Bộ font hình học hiện đại thể hiện cấu trúc tổ ong và tính kiến tạo không gian tri thức cấp tiến.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap"
    };

    const brandStory = \`\${brandName} là tổ ấm của những ý tưởng đột phá và cộng đồng tri thức không ngừng học hỏi. Lấy cảm hứng từ cấu trúc tổ ong hoàn hảo của tự nhiên, chúng tôi kiến tạo môi trường học tập và làm việc đa chiều, nơi mỗi cá nhân đều tìm thấy động lực phát triển và kết nối giá trị bền vững.\`;

    const mockups = {
      namecard: {
        front: "Mặt trước dập nổi hình khối lục giác tổ ong trên nền Xám Đen Đô Thị sang trọng.",
        back: "Mặt sau nền Hổ Phách với thông tin thành viên và mã QR thẻ cộng đồng tri thức."
      },
      packaging: {
        type: "Bộ giáo trình cao cấp đóng gáy xoắn bìa cứng ép nhũ vàng cam.",
        description: "Túi vải canvas đa dụng in logo cách điệu sắc sảo."
      },
      signage: {
        type: "Biển hiệu khối lục giác inox vàng xước hairline hắt đèn LED vàng 3000K.",
        description: "Không gian sảnh lễ tân co-working & trung tâm đào tạo sáng tạo."
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
      options: buildEducationLogoOptions(brandName, defaultSlogan, palette, typography)
    };
  }

  if (category === "lifestyle") {
    const defaultSlogan = userSlogan || "Vững cuộc sống - Vững niềm tin";
    const taglines = [
      defaultSlogan,
      "Tỏa sáng nụ cười, nâng tầm cuộc sống",
      "Nơi vẻ đẹp rạng rỡ bắt đầu từ sự tự tin",
      "Radiance in Every Smile"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Ocean Cerulean (Xanh Lam Biển)", hex: "#0284C7", rgb: "rgb(2, 132, 199)" },
      { role: "Secondary", name: "Obsidian Navy (Xanh Đen Quý Phái)", hex: "#0F172A", rgb: "rgb(15, 23, 42)" },
      { role: "Accent", name: "Radiant Coral (Hồng San Hô)", hex: "#F43F5E", rgb: "rgb(244, 63, 94)" },
      { role: "Neutral", name: "Porcelain Pure (Trắng Sứ Thanh Khiết)", hex: "#F8FAFC", rgb: "rgb(248, 250, 252)" }
    ];

    const typography: TypographyConfig = {
      heading: "Fraunces",
      body: "Be Vietnam Pro",
      pairing_rationale: "Đường cong thanh lịch của Fraunces hòa quyện với vẻ đẹp trong trẻo, mang lại cảm giác thân thiện, uy tín và rạng ngời.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&display=swap"
    };

    const brandStory = \`Nụ cười là ngôn ngữ diệu kỳ nhất của sự tự tin. Tại \${brandName}, chúng tôi dành trọn tâm huyết kiến tạo những nụ cười rạng ngời, khỏe khoắn và tràn đầy sức sống. Bằng công nghệ tiên tiến và thẩm mỹ tinh tế chuẩn mực tỷ lệ vàng, chúng tôi đồng hành cùng bạn trên hành trình khẳng định bản thân.\`;

    const mockups = {
      namecard: {
        front: "Mặt trước phủ màu Trắng Sứ Thanh Khiết ép kim bóng nụ cười hình học.",
        back: "Mặt sau nền Xanh Lam Biển với thông tin bác sĩ và lịch hẹn chăm sóc."
      },
      packaging: {
        type: "Hộp quà tặng chăm sóc nụ cười phủ màng nhung cao cấp.",
        description: "Túi đựng mỹ phẩm nha khoa thiết kế tối giản, thanh lịch."
      },
      signage: {
        type: "Biển hiệu mica uốn cong phát sáng viền LED dịu nhẹ chuẩn y khoa.",
        description: "Mặt tiền phòng khám thẩm mỹ sang trọng, ấm cúng và an tâm."
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
      options: buildLifestyleLogoOptions(brandName, defaultSlogan, palette, typography)
    };
  }

  if (category === "creative") {
    const defaultSlogan = userSlogan || "Sáng tạo bản sắc, dẫn lối tương lai";
    const taglines = [
      defaultSlogan,
      "Design Excellence & Strategic Impact",
      "Đột phá thị giác, khẳng định vị thế",
      "Pure Form, Bold Statement"
    ];

    const palette: ColorItem[] = [
      { role: "Primary", name: "Pitch Black (Đen Tuyền Đồ Họa)", hex: "#111111", rgb: "rgb(17, 17, 17)" },
      { role: "Secondary", name: "Deep Charcoal (Xám Khối)", hex: "#1F2937", rgb: "rgb(31, 41, 55)" },
      { role: "Accent", name: "Dynamic Crimson (Đỏ Năng Lượng Nhấn)", hex: "#E50914", rgb: "rgb(229, 9, 20)" },
      { role: "Neutral", name: "Studio Pure White (Trắng Bản Vẽ)", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)" }
    ];

    const typography: TypographyConfig = {
      heading: "Space Grotesk",
      body: "Plus Jakarta Sans",
      pairing_rationale: "Bộ font hình học tương phản mạnh mẽ, thể hiện phong cách thiết kế đương đại đậm chất thể thao và công nghệ sáng tạo.",
      google_fonts_url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
    };

    const brandStory = \`\${brandName} là xưởng sáng tạo của những giải pháp thị giác sắc sảo và mang tính định hình. Chúng tôi kết hợp nguyên lý hình học chặt chẽ với cảm hứng động học hiện đại để kiến tạo những biểu tượng thương hiệu trường tồn, mạnh mẽ và tạo dấu ấn tức thì.\`;

    const mockups = {
      namecard: {
        front: "Mặt trước nền Đen Tuyền ép kim đỏ vệt nhấn góc nghiêng, cắt góc dynamic.",
        back: "Mặt sau nền Trắng Bản Vẽ với typography căn chỉnh cực kỳ chuẩn xác."
      },
      packaging: {
        type: "Hộp brand identity kit bọc vải đen mờ in dập chìm.",
        description: "Bộ ấn phẩm nhận diện chuẩn agency quốc tế."
      },
      signage: {
        type: "Biển hiệu thép đen anodized cắt laser gắn vệt đỏ acrylic phát sáng.",
        description: "Studio thiết kế hiện đại, tối giản và chuyên nghiệp."
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
      options: buildCreativeLogoOptions(brandName, defaultSlogan, palette, typography)
    };
  }`;

if (!code.includes(targetPrintingEnd)) {
  console.error("Target printing end not found!");
  process.exit(1);
}

code = code.replace(targetPrintingEnd, newCategoryBlocks);

// 2. Builder functions to append at bottom
const builderFunctions = `
/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH NÔNG NGHIỆP SẠCH / GREEN FARM (ORGANIC HARVEST) */
/* ========================================================================= */
function buildAgricultureLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig
): LogoOption[] {
  const p = palette[0]?.hex || "#059669";
  const s = palette[1]?.hex || "#10B981";
  const a = palette[2]?.hex || "#F59E0B";
  const n = palette[3]?.hex || "#F0FDF4";
  const hFont = typography.heading;
  const bFont = typography.body;

  const opt1Emblem = renderBotanicalCircleEmblem(brandName, p, s, a);
  const opt1Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.16em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt1Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">ORGANIC BOTANICAL &amp; PURE HARVEST</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'\${bFont}', sans-serif" font-weight="500" font-size="8" fill="\${p}" letter-spacing="0.25em">FARM-TO-TABLE FRESHNESS</text>
  </g>
</svg>\`;

  const opt2Emblem = renderBoldLigatureMonogram("G", "F", p, s, a);
  const opt2Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.16em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt2Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">GEOMETRIC DUO LIGATURE [GF]</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  const opt3Emblem = renderConcentricLabyrinthEmblem(brandName, p, s, a);
  const opt3Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.16em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt3Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">GOLDEN HARVEST CONCENTRIC LABYRINTH</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${p}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Vòng Tròn Sinh Thái Mầm Xanh (Botanical Circle Shield)",
      concept_note: "Biểu tượng hình tròn bảo hộ bao bọc mầm lá sinh thái vươn cao đón ánh dương, đúng chuẩn yêu cầu thực phẩm sạch.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.16, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Khối Chữ Ghép Ligature Hiện Đại (GF Ligature)",
      concept_note: "Nghệ thuật chữ lồng G & F khối đặc với vệt góc nghiêng động học, tạo diện mạo thương hiệu nông nghiệp thế hệ mới.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.16, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Vành Đai Đồng Tâm Mùa Vụ (Golden Harvest Labyrinth)",
      concept_note: "Hệ cung tròn đồng tâm tỷ lệ vàng tượng trưng cho vòng tuần hoàn mùa vụ màu mỡ và hạt ngọc phù sa.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.16, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH GIÁO DỤC & CO-WORKING / TOONG (HONEYCOMB ARCH)  */
/* ========================================================================= */
function buildEducationLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig
): LogoOption[] {
  const p = palette[0]?.hex || "#D97706";
  const s = palette[1]?.hex || "#1E293B";
  const a = palette[2]?.hex || "#F59E0B";
  const n = palette[3]?.hex || "#FFFBEB";
  const hFont = typography.heading;
  const bFont = typography.body;

  const opt1Emblem = renderHoneycombHexagonEmblem(brandName, p, s, a);
  const opt1Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${s}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt1Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">HONEYCOMB KNOWLEDGE ARCHITECTURE</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'\${bFont}', sans-serif" font-weight="500" font-size="8" fill="\${p}" letter-spacing="0.25em">LEARNING &amp; CO-WORKING ECOSYSTEM</text>
  </g>
</svg>\`;

  const opt2Emblem = renderBoldLigatureMonogram("T", "G", p, s, a);
  const opt2Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${s}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt2Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">BOLD T-LIGATURE MONOGRAM</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  const opt3Emblem = renderContinuousInfinityWordmark(brandName, p, s, a);
  const opt3Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${s}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt3Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">CONTINUOUS INFINITY FLOW LIGATURE</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Lục Giác Tổ Ong Kiến Tạo Tri Thức (Honeycomb Hexagon)",
      concept_note: "Biểu tượng tổ ong hình học cách điệu màu vàng cam lồng ghép chữ T âm bản, tượng trưng cho sự gắn kết tri thức và sáng tạo.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "tech", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Khối Chữ T Nối Liền Liền Mạch (Bold T-Ligature Architecture)",
      concept_note: "Khối monogram chữ T & G dũng mãnh với vệt góc nghiêng động học, mang phong thái vững chãi của nền tảng đào tạo hàng đầu.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Dòng Chảy Vô Cực Phát Triển (Continuous Infinity Knowledge Flow)",
      concept_note: "Dải ruy băng vô cực uốn lượn liên hoàn không đứt đoạn qua các ký tự T-O-O-N-G, biểu trưng cho sự tiến bộ và mở rộng không giới hạn.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO NGÀNH NHA KHOA & SỨC KHỎE / SMILE (RADIANT JOY)       */
/* ========================================================================= */
function buildLifestyleLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig
): LogoOption[] {
  const p = palette[0]?.hex || "#0284C7";
  const s = palette[1]?.hex || "#0F172A";
  const a = palette[2]?.hex || "#F43F5E";
  const n = palette[3]?.hex || "#F8FAFC";
  const hFont = typography.heading;
  const bFont = typography.body;

  const opt1Emblem = renderRadiantSmileEmblem(brandName, p, s, a);
  const opt1Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', serif; font-weight: 700; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt1Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">DENTAL &amp; AESTHETIC STUDIO</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'\${bFont}', sans-serif" font-weight="500" font-size="8" fill="\${s}" letter-spacing="0.25em">CONFIDENCE IN EVERY SMILE</text>
  </g>
</svg>\`;

  const opt2Emblem = renderBoldLigatureMonogram("S", "M", p, s, a);
  const opt2Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', serif; font-weight: 700; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.25" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt2Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">BOLD S-LIGATURE ACCENT SLASH</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  const opt3Emblem = renderConcentricLabyrinthEmblem(brandName, p, s, a);
  const opt3Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', serif; font-weight: 700; font-size: 32px; letter-spacing: 0.18em; fill: \${s}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.35em; fill: \${p}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt3Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">CONCENTRIC RADIANT JOY TARGET</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Nụ Cười Rạng Rỡ Hình Học Tỷ Lệ Vàng (Radiant Geometric Smile)",
      concept_note: "Đường cong nụ cười rạng rỡ uốn lượn hình học với tỷ lệ vàng quang học, mang lại cảm giác thân thiện và niềm tin vững chãi.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Chữ S Năng Động & Vệt Nhấn Thể Thao (Bold S-Ligature)",
      concept_note: "Khối monogram chữ S & M mạnh mẽ với vệt nhấn góc nghiêng san hô, tôn vinh lối sống năng động và nụ cười tự tin.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Vành Đai Đồng Tâm Ánh Dương (Concentric Radiant Joy)",
      concept_note: "Hệ cung tròn đồng tâm tỏa sáng như ánh dương ban mai, biểu đạt cho sức khỏe ngập tràn và sự an tâm tuyệt đối.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.18, primaryColor: p, layout: "stacked" }
    }
  ];
}

/* ========================================================================= */
/* 3 LOGO OPTIONS CHO STUDIO SÁNG TẠO & AGENCY (AS CREATIVE ARCHETYPE)       */
/* ========================================================================= */
function buildCreativeLogoOptions(
  brandName: string,
  tagline: string,
  palette: ColorItem[],
  typography: TypographyConfig
): LogoOption[] {
  const p = palette[0]?.hex || "#111111";
  const s = palette[1]?.hex || "#1F2937";
  const a = palette[2]?.hex || "#E50914";
  const n = palette[3]?.hex || "#FFFFFF";
  const hFont = typography.heading;
  const bFont = typography.body;

  const pair = extractBrandMonogramLetters(brandName);
  const opt1Emblem = renderBoldLigatureMonogram(pair.char1, pair.char2, p, s, a);
  const opt1Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.22em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.2" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt1Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">BOLD GEOMETRIC LIGATURE MONOGRAM</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="1" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
    <text x="250" y="433" text-anchor="middle" font-family="'\${bFont}', sans-serif" font-weight="500" font-size="8" fill="\${a}" letter-spacing="0.25em">CREATIVE DESIGN CONCEPT</text>
  </g>
</svg>\`;

  const opt2Emblem = renderContinuousInfinityWordmark(brandName, p, s, a);
  const opt2Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.22em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.2" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt2Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">CONTINUOUS INFINITY FLOW LIGATURE</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${s}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  const opt3Emblem = renderConcentricLabyrinthEmblem(brandName, p, s, a);
  const opt3Svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      @import url('\${typography.google_fonts_url}');
      .brand-title { font-family: '\${hFont}', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: 0.22em; fill: \${p}; }
      .brand-sub { font-family: '\${bFont}', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.40em; fill: \${s}; }
      .brand-tagline { font-family: '\${bFont}', sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.25em; fill: \${a}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="\${n}" rx="28"/>
  <rect x="22" y="22" width="456" height="456" fill="none" stroke="\${a}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <g id="logo-emblem" transform="translate(250, 185) scale(1)">
\${opt3Emblem}
  </g>
  <g id="logo-typography">
    <text x="250" y="336" text-anchor="middle" class="brand-title">\${brandName.toUpperCase()}</text>
    <text x="250" y="368" text-anchor="middle" class="brand-sub">GOLDEN RATIO GEOMETRIC TARGET</text>
    <g transform="translate(250, 388)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="2.2" fill="\${a}"/>
      <line x1="10" y1="0" x2="50" y2="0" stroke="\${p}" stroke-width="0.8" stroke-opacity="0.4"/>
    </g>
    <text x="250" y="414" text-anchor="middle" class="brand-tagline">\${tagline.toUpperCase()}</text>
  </g>
</svg>\`;

  return [
    {
      id: "opt_1",
      title: "Option 1: Bold Geometric Duo-Ligature Monogram [AS Creative Archetype]",
      concept_note: "Khối biểu tượng chữ ghép liền nét với vệt góc nghiêng động học (Dynamic Accent Slash), lấy cảm hứng từ chuẩn mực AS Creative.",
      svg: opt1Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_2",
      title: "Option 2: Dòng Chảy Vô Cực Liền Mạch (Continuous Infinity Ribbon Ligature)",
      concept_note: "Dải ruy băng vô cực tuần hoàn uốn lượn liên hoàn không đứt đoạn, đại diện cho sức sáng tạo trường tồn.",
      svg: opt2Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "luxury", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    },
    {
      id: "opt_3",
      title: "Option 3: Vành Đai Tỷ Lệ Vàng (Concentric Geometric Target)",
      concept_note: "Hệ vành đai đồng tâm với khe mở tỷ lệ vàng tạo hình ký tự mở và tâm ngọc hội tụ quyền uy chuẩn mực.",
      svg: opt3Svg,
      settings: { iconScale: 1.0, iconPosX: 0, iconPosY: 0, iconShape: "circle", letterSpacing: 0.22, primaryColor: p, layout: "stacked" }
    }
  ];
}
`;

code += builderFunctions;

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully updated lib/industryBrandKit.ts');

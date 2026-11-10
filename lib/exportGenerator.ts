/**
 * LUMINA BRAND LAB — AUTOMATED ASSET EXPORTER SERVICE 2.0
 * Chức năng:
 * - Xuất file vector master: logo_master.svg
 * - Xuất file PNG độ nét cao 300 DPI, nền trong suốt: logo_transparent.png
 * - Xuất cẩm nang thương hiệu chuẩn Pitch Deck 16:9 PDF (5 Trang): brand_guideline.pdf
 *   Trang 1: Bìa thương hiệu (Tên, Tagline, Logo typo, Metadata bảo mật)
 *   Trang 2: Brand Persona & Story (Câu chuyện thương hiệu, tệp khách, tính cách)
 *   Trang 3: Bảng màu nhận diện (Mã HEX, RGB, CMYK, tỷ lệ 60-30-10)
 *   Trang 4: Typography (Bảng chữ cái mẫu hoa/thường/số, phân cấp tỷ lệ)
 *   Trang 5: Ứng dụng thực tế (Mockup danh thiếp, ly tách/bao bì mẫu, biển hiệu)
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import PDFDocument from "pdfkit";
import { ProjectRecord } from "../types/curation";
import { convertColor } from "./colorUtils";

function getSystemFonts() {
  const candidates = [
    { regular: "C:/Windows/Fonts/segoeui.ttf", bold: "C:/Windows/Fonts/segoeuib.ttf", italic: "C:/Windows/Fonts/segoeuii.ttf" },
    { regular: "C:/Windows/Fonts/arial.ttf", bold: "C:/Windows/Fonts/arialbd.ttf", italic: "C:/Windows/Fonts/ariali.ttf" },
    { regular: "/System/Library/Fonts/Supplemental/Arial.ttf", bold: "/System/Library/Fonts/Supplemental/Arial Bold.ttf", italic: "/System/Library/Fonts/Supplemental/Arial Italic.ttf" },
    { regular: "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", bold: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", italic: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf" }
  ];

  for (const c of candidates) {
    if (fs.existsSync(c.regular) && fs.existsSync(c.bold)) {
      return c;
    }
  }
  return null;
}

function sanitizeSvgForSharp(svg: string): string {
  return (svg || "")
    .replace(/&bull;/g, "•")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&copy;/g, "©")
    .replace(/&trade;/g, "™")
    .replace(/&reg;/g, "®");
}

export async function generateBrandAssets(project: ProjectRecord): Promise<{
  svg_url: string;
  png_url: string;
  pdf_url: string;
  client_proposal_url: string;
}> {
  const outputDir = path.join(process.cwd(), "public", "downloads", project.project_id);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Xuất file vector logo_master.svg
  const svgPath = path.join(outputDir, "logo_master.svg");
  fs.writeFileSync(svgPath, project.logo_svg, "utf8");

  // Xuất file vector riêng cho cả 3 option nếu có
  if (project.logo_options && Array.isArray(project.logo_options)) {
    project.logo_options.forEach((opt, idx) => {
      const optPath = path.join(outputDir, `logo_option_${idx + 1}.svg`);
      fs.writeFileSync(optPath, opt.svg, "utf8");
    });
  }

  // 2. Xuất file PNG 300 DPI trong suốt: logo_transparent.png
  let transparentSvg = project.logo_svg;
  // Bỏ nền <rect> canvas chính để lấy logo transparent
  transparentSvg = transparentSvg.replace(/<rect\s+[^>]*width=["']500["'][^>]*height=["']500["'][^>]*\/>/i, "");
  transparentSvg = transparentSvg.replace(/<rect\s+[^>]*rx=["']28["'][^>]*\/>/i, "");
  transparentSvg = transparentSvg.replace(/<rect\s+[^>]*rx=["']20["'][^>]*\/>/i, "");

  const pngTransparentPath = path.join(outputDir, "logo_transparent.png");
  const cleanTransparentSvg = sanitizeSvgForSharp(transparentSvg);
  const cleanBaseSvg = sanitizeSvgForSharp(project.logo_svg);

  try {
    await sharp(Buffer.from(cleanTransparentSvg), { density: 300 })
      .resize(2000, 2000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(pngTransparentPath);
  } catch (err) {
    console.warn("sharp transparent png error, fallback with base svg:", err);
    await sharp(Buffer.from(cleanBaseSvg), { density: 300 })
      .resize(2000, 2000, { fit: "contain" })
      .png()
      .toFile(pngTransparentPath);
  }

  // Tạo ảnh preview có nền để nhúng vào PDF
  const pngPreviewPath = path.join(outputDir, "logo_preview.png");
  try {
    await sharp(Buffer.from(cleanBaseSvg), { density: 300 })
      .resize(1000, 1000)
      .png()
      .toFile(pngPreviewPath);
  } catch (err) {
    console.warn("sharp preview png error:", err);
  }

  // 3. Xuất file PDF Pitch Deck Chuẩn Tỷ Lệ 16:9 (960 x 540 pt)
  const pdfPath = path.join(outputDir, "brand_guideline.pdf");
  await new Promise<void>((resolve, reject) => {
    try {
      // 16:9 aspect ratio: 960pt x 540pt
      const PAGE_WIDTH = 960;
      const PAGE_HEIGHT = 540;

      const doc = new PDFDocument({
        size: [PAGE_WIDTH, PAGE_HEIGHT],
        margins: { top: 35, bottom: 35, left: 50, right: 50 },
        autoFirstPage: false
      });

      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      const fonts = getSystemFonts();
      if (fonts) {
        doc.registerFont("AppRegular", fonts.regular);
        doc.registerFont("AppBold", fonts.bold);
        if (fonts.italic && fs.existsSync(fonts.italic)) {
          doc.registerFont("AppItalic", fonts.italic);
        } else {
          doc.registerFont("AppItalic", fonts.regular);
        }
      }

      const fontReg = fonts ? "AppRegular" : "Helvetica";
      const fontBld = fonts ? "AppBold" : "Helvetica-Bold";
      const fontIta = fonts ? "AppItalic" : "Helvetica-Oblique";

      const primaryColor = project.palette.find((c) => c.role.toLowerCase().includes("primary"))?.hex || project.palette[0]?.hex || "#3D2B1F";
      const secondaryColor = project.palette.find((c) => c.role.toLowerCase().includes("secondary"))?.hex || project.palette[1]?.hex || "#9E6B55";
      const neutralColor = project.palette.find((c) => c.role.toLowerCase().includes("neutral"))?.hex || "#F4EFEA";
      const accentColor = project.palette.find((c) => c.role.toLowerCase().includes("accent"))?.hex || "#5B7065";

      const drawSlideHeader = (slideTitle: string, slideNum: number, category = "PITCH DECK PROPOSAL") => {
        // Top luxury accent bar
        doc.rect(0, 0, PAGE_WIDTH, 6).fill(primaryColor);
        doc.rect(0, 6, PAGE_WIDTH, 2).fill(secondaryColor);

        // Header labels
        doc.font(fontBld).fontSize(8.5).fillColor(secondaryColor).text(`LUMINA BRAND LAB • ${category.toUpperCase()}`, 50, 24);
        doc.font(fontBld).fontSize(14).fillColor(primaryColor).text(`TRANG 0${slideNum}: ${slideTitle.toUpperCase()}`, 50, 38);
        doc.moveTo(50, 58).lineTo(PAGE_WIDTH - 50, 58).lineWidth(0.8).strokeColor(secondaryColor).stroke();

        // Footer info
        doc.font(fontReg).fontSize(7.5).fillColor("#777777")
          .text(`${project.brand_name.toUpperCase()} • TÀI LIỆU BÀN GIAO BẢN QUYỀN CHÍNH THỨC • BẢO MẬT`, 50, PAGE_HEIGHT - 26);
        doc.font(fontBld).fontSize(8).fillColor(primaryColor)
          .text(`SLIDE 0${slideNum} / 05`, PAGE_WIDTH - 120, PAGE_HEIGHT - 26, { width: 70, align: "right" });
      }

      // ==========================================
      // TRANG 1: BÌA THƯƠNG HIỆU (BRAND COVER SLIDE 16:9)
      // ==========================================
      doc.addPage();
      // Luxury background
      doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(neutralColor);

      // Outer & Inner Architectural Border
      doc.rect(20, 20, PAGE_WIDTH - 40, PAGE_HEIGHT - 40).lineWidth(1.2).strokeColor(secondaryColor).stroke();
      doc.rect(26, 26, PAGE_WIDTH - 52, PAGE_HEIGHT - 52).lineWidth(0.5).strokeColor(primaryColor).stroke();

      // Corner ornamental dots
      const corners = [
        [32, 32],
        [PAGE_WIDTH - 32, 32],
        [32, PAGE_HEIGHT - 32],
        [PAGE_WIDTH - 32, PAGE_HEIGHT - 32]
      ];
      corners.forEach(([cx, cy]) => {
        doc.circle(cx, cy, 2.5).fill(accentColor);
      });

      // Top Agency Presentation Tag
      doc.font(fontBld).fontSize(8.5).fillColor(secondaryColor)
        .text("LUMINA BRAND LAB • CREATIVE AGENCY PRESENTATION", 0, 48, { align: "center", characterSpacing: 2 });
      doc.font(fontReg).fontSize(7.5).fillColor("#666666")
        .text("BỘ ĐỀ XUẤT NHẬN DIỆN THƯƠNG HIỆU & HƯỚNG DẪN BẢN QUYỀN (16:9 PITCH DECK)", 0, 62, { align: "center", characterSpacing: 1 });

      // Central Emblem & Logo
      const logoBoxSize = 150;
      const logoX = (PAGE_WIDTH - logoBoxSize) / 2;
      const logoY = 90;

      if (fs.existsSync(pngPreviewPath)) {
        doc.image(pngPreviewPath, logoX, logoY, { width: logoBoxSize, height: logoBoxSize });
      }

      // Brand Name
      doc.font(fontBld).fontSize(30).fillColor(primaryColor)
        .text(project.brand_name.toUpperCase(), 0, logoY + logoBoxSize + 20, { align: "center", characterSpacing: 1.5 });

      // Slogan / Tagline
      doc.font(fontIta).fontSize(13).fillColor(secondaryColor)
        .text(`"${project.tagline}"`, 0, logoY + logoBoxSize + 60, { align: "center" });

      // Horizontal separator line
      const divWidth = 260;
      doc.moveTo((PAGE_WIDTH - divWidth) / 2, logoY + logoBoxSize + 85)
        .lineTo((PAGE_WIDTH + divWidth) / 2, logoY + logoBoxSize + 85)
        .lineWidth(0.8).strokeColor(secondaryColor).stroke();

      // Metadata Block
      const metaY = logoY + logoBoxSize + 98;
      doc.font(fontBld).fontSize(8).fillColor(primaryColor)
        .text(`KHÁCH HÀNG: ${project.client_name.toUpperCase()}  |  MÃ DỰ ÁN: ${project.project_id}  |  NGÀNH HÀNG: ${project.industry.toUpperCase()}`, 0, metaY, { align: "center", characterSpacing: 0.8 });
      doc.font(fontReg).fontSize(7.5).fillColor("#888888")
        .text("HOÀN TẤT PHÊ DUYỆT BỞI GIÁM ĐỐC SÁNG TẠO • PHIÊN BẢN 1.0 FINAL PRODUCTION", 0, metaY + 14, { align: "center", characterSpacing: 0.5 });

      // ==========================================
      // TRANG 2: BRAND PERSONA & STORY (16:9)
      // ==========================================
      doc.addPage();
      drawSlideHeader("Brand Persona & Story (Câu Chuyện & Tệp Khách)", 2, "CHIẾN LƯỢC BẢN SẮC");

      const colY = 75;
      const colW = 410;

      // Cột Trái: Câu Chuyện Thương Hiệu & Triết Lý
      doc.rect(50, colY, colW, 415).fillAndStroke("#FAFAFA", "#E7E2DC");
      doc.rect(50, colY, colW, 30).fill(primaryColor);
      doc.font(fontBld).fontSize(10.5).fillColor("#FFFFFF").text("2.1 CÂU CHUYỆN THƯƠNG HIỆU & ĐỊNH VỊ", 65, colY + 9);

      doc.font(fontBld).fontSize(8.5).fillColor(secondaryColor).text("KHẨU HIỆU ĐỊNH VỊ (TAGLINE CỐT LÕI):", 68, colY + 45);
      doc.font(fontIta).fontSize(11).fillColor(primaryColor).text(`“${project.tagline}”`, 68, colY + 60, { width: colW - 36 });

      doc.moveTo(68, colY + 85).lineTo(50 + colW - 18, colY + 85).lineWidth(0.6).strokeColor("#D5CEC5").stroke();

      doc.font(fontBld).fontSize(8.5).fillColor(secondaryColor).text("CÂU CHUYỆN KHỞI NGUỒN CẢM HỨNG:", 68, colY + 98);
      doc.font(fontReg).fontSize(9.5).fillColor("#333333")
        .text(project.brand_story, 68, colY + 115, { width: colW - 36, lineGap: 5, align: "justify" });

      // Giá trị cốt lõi
      const coreY = colY + 285;
      doc.font(fontBld).fontSize(8.5).fillColor(secondaryColor).text("GIÁ TRỊ CỐT LÕI (CORE VALUES):", 68, coreY);
      const values = [
        "1. Nguyên bản & Chân thật (Authenticity & Purity)",
        "2. Thủ công & Tỉ mỉ (Craftsmanship & Detail-oriented)",
        "3. Tĩnh tại & Kết nối sâu (Slow Living & Mindful Space)",
        "4. Bền vững & Giao hòa thiên nhiên (Eco & Nature Harmony)"
      ];
      values.forEach((val, i) => {
        doc.font(fontReg).fontSize(8.5).fillColor("#444444").text(val, 75, coreY + 18 + i * 18);
      });

      // Cột Phải: Chân Dung Khách Hàng Mục Tiêu & Brand Persona
      const rightX = 500;
      doc.rect(rightX, colY, colW, 415).fillAndStroke("#FAFAFA", "#E7E2DC");
      doc.rect(rightX, colY, colW, 30).fill(secondaryColor);
      doc.font(fontBld).fontSize(10.5).fillColor("#FFFFFF").text("2.2 CHÂN DUNG KHÁCH HÀNG & BRAND PERSONA", rightX + 15, colY + 9);

      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("TỆP KHÁCH HÀNG MỤC TIÊU (TARGET AUDIENCE):", rightX + 18, colY + 45);
      doc.font(fontReg).fontSize(9.5).fillColor("#333333")
        .text(project.target_audience, rightX + 18, colY + 62, { width: colW - 36, lineGap: 4 });

      // Persona Profile Matrix Box
      const pBoxY = colY + 130;
      doc.rect(rightX + 18, pBoxY, colW - 36, 120).fillAndStroke("#FFFFFF", "#DDD7CF");
      doc.font(fontBld).fontSize(8).fillColor(accentColor).text("NHÂN KHẨU HỌC & HÀNH VI ĐIỂN HÌNH", rightX + 30, pBoxY + 12);
      doc.font(fontReg).fontSize(8.5).fillColor("#444444")
        .text("• Độ tuổi: 20 – 38 tuổi. Nghề nghiệp: Freelancer, Designer, Quản lý trẻ, Tri thức.", rightX + 30, pBoxY + 28);
      doc.font(fontReg).fontSize(8.5).fillColor("#444444")
        .text("• Phong cách: Chuộng Wabi-sabi, tối giản, đọc sách, nghe nhạc acoustic & làm việc sâu.", rightX + 30, pBoxY + 46);
      doc.font(fontReg).fontSize(8.5).fillColor("#444444")
        .text("• Nỗi đau / Nhu cầu: Cần khoảng lặng tái tạo năng lượng, tránh xa xô bồ thị thành.", rightX + 30, pBoxY + 64);
      doc.font(fontReg).fontSize(8.5).fillColor("#444444")
        .text("• Điểm chạm cảm xúc: Hương vị cà phê mộc đậm đà, ánh sáng ấm, thớ gỗ tự nhiên.", rightX + 30, pBoxY + 82);

      // Archetype & Style Vibes
      const vibeY = colY + 270;
      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("TÍNH CÁCH THƯƠNG HIỆU (BRAND VIBES):", rightX + 18, vibeY);

      project.style_vibes.slice(0, 4).forEach((vibe, idx) => {
        const vx = rightX + 18 + (idx % 2) * 185;
        const vy = vibeY + 20 + Math.floor(idx / 2) * 36;
        doc.rect(vx, vy, 175, 28).fillAndStroke("#F3EFE9", "#D8D2C9");
        doc.circle(vx + 14, vy + 14, 4).fill(accentColor);
        doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text(vibe, vx + 26, vy + 9);
      });

      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("HÌNH MẪU THƯƠNG HIỆU (BRAND ARCHETYPE):", rightX + 18, vibeY + 100);
      doc.font(fontReg).fontSize(8.8).fillColor("#555555")
        .text("The Creator (Người Kiến Tạo Bản Sắc) kết hợp cùng The Sage (Người Kiếm Tìm Sự Thông Tuệ Tĩnh Tại).", rightX + 18, vibeY + 116, { width: colW - 36 });

      // ==========================================
      // TRANG 3: BẢNG MÀU NHẬN DIỆN (HEX / RGB / CMYK) (16:9)
      // ==========================================
      doc.addPage();
      drawSlideHeader("Bảng Màu Nhận Diện Thương Hiệu (HEX, RGB & CMYK)", 3, "HỆ THỐNG MÀU SẮC CHUẨN MỰC");

      // Giới thiệu nguyên tắc 60-30-10
      doc.font(fontReg).fontSize(9).fillColor("#555555")
        .text("Hệ thống màu sắc được thiết lập theo tỷ lệ tương phản chuẩn 60 - 30 - 10, tối ưu cho cả hiển thị kỹ thuật số lẫn in ấn offset vật lý.", 50, 68);

      const palette = project.palette.slice(0, 4);
      const cardW = 200;
      const cardGap = 20;
      const startX = 50;
      const cardTopY = 90;
      const cardH = 400;

      palette.forEach((color, i) => {
        const cx = startX + i * (cardW + cardGap);
        const conv = convertColor(color.hex);

        // Card Container
        doc.rect(cx, cardTopY, cardW, cardH).fillAndStroke("#FFFFFF", "#E2DDD6");

        // Color Swatch Box
        doc.rect(cx, cardTopY, cardW, 140).fill(color.hex);
        doc.rect(cx, cardTopY, cardW, 140).lineWidth(0.5).strokeColor("#CCCCCC").stroke();

        // Round swatch accent
        doc.circle(cx + cardW / 2, cardTopY + 165, 16).fill(color.hex);
        doc.circle(cx + cardW / 2, cardTopY + 165, 16).lineWidth(1.2).strokeColor("#FFFFFF").stroke();

        // Role Badge
        doc.font(fontBld).fontSize(8.5).fillColor(accentColor)
          .text(color.role.toUpperCase(), cx + 10, cardTopY + 192, { width: cardW - 20, align: "center" });

        // Color Name
        doc.font(fontBld).fontSize(10.5).fillColor(primaryColor)
          .text(color.name, cx + 8, cardTopY + 208, { width: cardW - 16, align: "center" });

        // Divider
        doc.moveTo(cx + 20, cardTopY + 248).lineTo(cx + cardW - 20, cardTopY + 248).lineWidth(0.6).strokeColor("#ECE7DF").stroke();

        // Triple Color Codes (HEX, RGB, CMYK)
        const codeY = cardTopY + 260;
        doc.font(fontBld).fontSize(8.5).fillColor("#333333").text("MÃ HEX:", cx + 18, codeY);
        doc.font(fontBld).fontSize(9.5).fillColor(primaryColor).text(conv.hex, cx + 70, codeY);

        doc.font(fontBld).fontSize(8.5).fillColor("#333333").text("MÃ RGB:", cx + 18, codeY + 22);
        doc.font(fontReg).fontSize(8).fillColor(primaryColor).text(conv.rgb, cx + 70, codeY + 22);

        doc.font(fontBld).fontSize(8.5).fillColor("#333333").text("MÃ CMYK:", cx + 18, codeY + 44);
        doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text(conv.cmyk, cx + 70, codeY + 44);

        // Usage Guide
        doc.moveTo(cx + 20, codeY + 68).lineTo(cx + cardW - 20, codeY + 68).lineWidth(0.6).strokeColor("#ECE7DF").stroke();
        doc.font(fontBld).fontSize(7.5).fillColor("#777777").text("HƯỚNG DẪN ỨNG DỤNG:", cx + 15, codeY + 76);
        doc.font(fontReg).fontSize(7.8).fillColor("#444444")
          .text(color.usage || "Ứng dụng linh hoạt trên bao bì, ấn phẩm và không gian.", cx + 15, codeY + 90, { width: cardW - 30, lineGap: 2.5 });
      });

      // ==========================================
      // TRANG 4: TYPOGRAPHY SYSTEM (ALPHABET SPECIMEN) (16:9)
      // ==========================================
      doc.addPage();
      drawSlideHeader("Hệ Thống Phông Chữ (Typography Specimen)", 4, "TYPOGRAPHIC STANDARDS");

      const typoColW = 415;
      const typoColY = 75;

      // Font Tiêu Đề
      doc.rect(50, typoColY, typoColW, 415).fillAndStroke("#FAFAFA", "#E7E2DC");
      doc.rect(50, typoColY, typoColW, 30).fill(primaryColor);
      doc.font(fontBld).fontSize(10.5).fillColor("#FFFFFF").text("4.1 PHÔNG CHỮ TIÊU ĐỀ (HEADING FONT)", 65, typoColY + 9);

      doc.font(fontBld).fontSize(9).fillColor(secondaryColor).text("TÊN PHÔNG CHỮ:", 68, typoColY + 42);
      doc.font(fontBld).fontSize(20).fillColor(primaryColor).text(project.typography.heading.toUpperCase(), 68, typoColY + 56);
      doc.font(fontReg).fontSize(8).fillColor("#888888").text("Phân loại: Variable Display Serif (Google Fonts) • Hỗ trợ tiếng Việt đầy đủ", 68, typoColY + 84);

      doc.moveTo(68, typoColY + 102).lineTo(50 + typoColW - 18, typoColY + 102).lineWidth(0.6).strokeColor("#D5CEC5").stroke();

      // Alphabet Specimen Heading
      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("BẢNG CHỮ CÁI MẪU (SPECIMEN):", 68, typoColY + 115);

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ HOA (UPPERCASE):", 68, typoColY + 132);
      doc.font(fontBld).fontSize(11).fillColor("#222222")
        .text("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", 68, typoColY + 146, { width: typoColW - 36, characterSpacing: 1.5 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ THƯỜNG (LOWERCASE):", 68, typoColY + 172);
      doc.font(fontReg).fontSize(11).fillColor("#333333")
        .text("a b c d e f g h i j k l m n o p q r s t u v w x y z", 68, typoColY + 186, { width: typoColW - 36, characterSpacing: 1.5 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ SỐ & KÝ TỰ ĐẶC BIỆT (NUMERALS & GLYPHS):", 68, typoColY + 212);
      doc.font(fontBld).fontSize(11).fillColor("#222222")
        .text("0 1 2 3 4 5 6 7 8 9   & @ # $ % ! ? / ( ) - + =", 68, typoColY + 226, { width: typoColW - 36 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("KÝ TỰ TIẾNG VIỆT CÓ DẤU (VIETNAMESE DIACRITICS):", 68, typoColY + 252);
      doc.font(fontReg).fontSize(10).fillColor("#222222")
        .text("À Á Â Ã È É Ê Ì Í Ò Ó Ô Ơ Ù Ú Ư Ỳ Đ à á â ã è é ê ì í ò ó ô ơ ù ú ư ỳ đ", 68, typoColY + 266, { width: typoColW - 36 });

      // Trọng lượng font (Weights)
      doc.moveTo(68, typoColY + 295).lineTo(50 + typoColW - 18, typoColY + 295).lineWidth(0.6).strokeColor("#D5CEC5").stroke();
      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("TRỌNG LƯỢNG MẪU (WEIGHT SPECIMENS):", 68, typoColY + 306);
      doc.font(fontReg).fontSize(12).fillColor("#444444").text("Regular 400 — Vẻ đẹp thô mộc Wabi-sabi nguyên bản", 68, typoColY + 324);
      doc.font(fontBld).fontSize(12).fillColor(primaryColor).text("Bold 700 — Tuyên ngôn thị giác mạnh mẽ & tinh tế", 68, typoColY + 348);
      doc.font(fontReg).fontSize(8).fillColor("#777777")
        .text("Ứng dụng: Tiêu đề lớn, bảng hiệu ngoài trời, logo typography và bìa catalog.", 68, typoColY + 378, { width: typoColW - 36 });

      // Font Thân Bài
      const typoRightX = 500;
      doc.rect(typoRightX, typoColY, typoColW, 415).fillAndStroke("#FAFAFA", "#E7E2DC");
      doc.rect(typoRightX, typoColY, typoColW, 30).fill(secondaryColor);
      doc.font(fontBld).fontSize(10.5).fillColor("#FFFFFF").text("4.2 PHÔNG CHỮ THÂN BÀI (BODY TEXT FONT)", typoRightX + 15, typoColY + 9);

      doc.font(fontBld).fontSize(9).fillColor(primaryColor).text("TÊN PHÔNG CHỮ:", typoRightX + 18, typoColY + 42);
      doc.font(fontBld).fontSize(20).fillColor(primaryColor).text(project.typography.body.toUpperCase(), typoRightX + 18, typoColY + 56);
      doc.font(fontReg).fontSize(8).fillColor("#888888").text("Phân loại: Neo-grotesque Sans-Serif • Tối ưu độ đọc trên màn hình & in ấn nhỏ", typoRightX + 18, typoColY + 84);

      doc.moveTo(typoRightX + 18, typoColY + 102).lineTo(typoRightX + typoColW - 18, typoColY + 102).lineWidth(0.6).strokeColor("#D5CEC5").stroke();

      // Alphabet Specimen Body
      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("BẢNG CHỮ CÁI MẪU (SPECIMEN):", typoRightX + 18, typoColY + 115);

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ HOA (UPPERCASE):", typoRightX + 18, typoColY + 132);
      doc.font(fontReg).fontSize(10.5).fillColor("#222222")
        .text("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", typoRightX + 18, typoColY + 146, { width: typoColW - 36, characterSpacing: 1.2 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ THƯỜNG (LOWERCASE):", typoRightX + 18, typoColY + 172);
      doc.font(fontReg).fontSize(10.5).fillColor("#333333")
        .text("a b c d e f g h i j k l m n o p q r s t u v w x y z", typoRightX + 18, typoColY + 186, { width: typoColW - 36, characterSpacing: 1.2 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("CHỮ SỐ & KÝ TỰ ĐẶC BIỆT (NUMERALS & GLYPHS):", typoRightX + 18, typoColY + 212);
      doc.font(fontReg).fontSize(10.5).fillColor("#222222")
        .text("0 1 2 3 4 5 6 7 8 9   & @ # $ % ! ? / ( ) - + =", typoRightX + 18, typoColY + 226, { width: typoColW - 36 });

      doc.font(fontBld).fontSize(8).fillColor(secondaryColor).text("KÝ TỰ TIẾNG VIỆT CÓ DẤU (VIETNAMESE DIACRITICS):", typoRightX + 18, typoColY + 252);
      doc.font(fontReg).fontSize(10).fillColor("#222222")
        .text("À Á Â Ã È É Ê Ì Í Ò Ó Ô Ơ Ù Ú Ư Ỳ Đ à á â ã è é ê ì í ò ó ô ơ ù ú ư ỳ đ", typoRightX + 18, typoColY + 266, { width: typoColW - 36 });

      // Trọng lượng font
      doc.moveTo(typoRightX + 18, typoColY + 295).lineTo(typoRightX + typoColW - 18, typoColY + 295).lineWidth(0.6).strokeColor("#D5CEC5").stroke();
      doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("LÝ DO PHỐI HỢP CẶP FONT (PAIRING RATIONALE):", typoRightX + 18, typoColY + 306);
      doc.font(fontReg).fontSize(8.5).fillColor("#444444")
        .text(project.typography.pairing_rationale || "Sự kết hợp giữa chất mộc nghệ nhân của Heading và hình học hiện đại của Body tạo nên tổng thể cân đối, sang trọng.", typoRightX + 18, typoColY + 324, { width: typoColW - 36, lineGap: 3.5 });
      doc.font(fontReg).fontSize(8).fillColor("#777777")
        .text("Ứng dụng: Nội dung chi tiết, nhãn thành phần, danh thiếp, menu và giao diện số.", typoRightX + 18, typoColY + 382, { width: typoColW - 36 });

      // ==========================================
      // TRANG 5: ỨNG DỤNG THỰC TẾ & MOCKUPS (16:9)
      // ==========================================
      doc.addPage();
      drawSlideHeader("Ứng Dụng Thực Tế & Mockups (Brand Touchpoints)", 5, "MÔ PHỎNG VẬT LÝ & GIA CÔNG");

      const mockupsList = [
        {
          num: "01",
          title: "DANH THIẾP (NAMECARD)",
          color: primaryColor,
          badge: "IN ẤN CAO CẤP",
          spec: "Cotton Washi 380gsm • Dập Nổi Mù (Blind Emboss) • Ép Viền Nâu",
          front: project.mockups?.namecard?.front || "Mặt trước phủ màu Trắng Giấy Dó Mộc (#F4EFEA) trên chất liệu giấy mỹ thuật sợi tự nhiên cotton 380gsm dập nổi mù biểu tượng.",
          back: project.mockups?.namecard?.back || "Mặt sau dùng nền Nâu Vỏ Thông Già (#3D2B1F). Thông tin liên hệ, mã QR và họa tiết mộc in lụa mực sáng thanh nhã."
        },
        {
          num: "02",
          title: "BAO BÌ & LY TÁCH (PACKAGING)",
          color: secondaryColor,
          badge: "BẢN SẮC TRẢI NGHIỆM",
          spec: "Giấy Kraft Nâu Mộc • Tráng PLA Sinh Học • Tem Dán Thủ Công",
          front: project.mockups?.packaging?.type || "Túi đựng cà phê hạt giấy Kraft mộc mạc tráng màng sinh học PLA có van một chiều kết hợp ly giấy 2 lớp cách nhiệt.",
          back: project.mockups?.packaging?.description || "Thân túi kraft dập tem dán thủ công bằng giấy dó in vân gỗ và làn gió xoáy. Tem niêm phong màu Xanh Thông Núi ghi chú ngày rang."
        },
        {
          num: "03",
          title: "BIỂN HIỆU & KHÔNG GIAN (SIGNAGE)",
          color: accentColor,
          badge: "KIẾN TRÚC & ĐIỂM CHẠM",
          spec: "Gỗ Thông Đốt Shou Sugi Ban • Thép Corten Cắt Laser • LED 2700K",
          front: project.mockups?.signage?.type || "Biển hiệu chính bằng gỗ thông lũa nguyên khối khắc chìm âm bản kết hợp biển vẫy tròn bằng thép Corten rỉ sét nghệ thuật.",
          back: project.mockups?.signage?.description || "Xử lý bề mặt gỗ theo kỹ thuật Shou Sugi Ban, tên thương hiệu khắc chìm trực tiếp vào thớ gỗ và hắt sáng gián tiếp bằng dải đèn LED vàng ấm 2700K."
        }
      ];

      const mCardW = 265;
      const mCardGap = 20;
      const mStartY = 80;
      const mCardH = 415;

      mockupsList.forEach((m, idx) => {
        const mx = 50 + idx * (mCardW + mCardGap);

        // Container
        doc.rect(mx, mStartY, mCardW, mCardH).fillAndStroke("#FFFFFF", "#E2DDD6");

        // Top Color Header
        doc.rect(mx, mStartY, mCardW, 40).fill(m.color);
        doc.font(fontBld).fontSize(10.5).fillColor("#FFFFFF")
          .text(`${m.num}. ${m.title}`, mx + 15, mStartY + 14, { width: mCardW - 30, align: "left" });

        // Badge
        doc.rect(mx + 15, mStartY + 52, mCardW - 30, 22).fillAndStroke("#F5F2EC", "#DCD5CA");
        doc.font(fontBld).fontSize(7.5).fillColor(primaryColor)
          .text(`TIÊU CHUẨN: ${m.badge}`, mx + 20, mStartY + 58);

        // Spec tag
        doc.font(fontBld).fontSize(7.8).fillColor(secondaryColor)
          .text(m.spec, mx + 15, mStartY + 84, { width: mCardW - 30 });

        doc.moveTo(mx + 15, mStartY + 110).lineTo(mx + mCardW - 15, mStartY + 110).lineWidth(0.6).strokeColor("#ECE7DF").stroke();

        // Chi tiết 1
        doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("ĐỊNH HƯỚNG MẶT TRƯỚC / THÂN ẤN PHẨM:", mx + 15, mStartY + 122);
        doc.font(fontReg).fontSize(8.2).fillColor("#444444")
          .text(m.front, mx + 15, mStartY + 138, { width: mCardW - 30, lineGap: 3.5 });

        // Chi tiết 2
        doc.font(fontBld).fontSize(8.5).fillColor(primaryColor).text("ĐỊNH HƯỚNG MẶT SAU / CHI TIẾT GIA CÔNG:", mx + 15, mStartY + 258);
        doc.font(fontReg).fontSize(8.2).fillColor("#444444")
          .text(m.back, mx + 15, mStartY + 274, { width: mCardW - 30, lineGap: 3.5 });

        // Production notice box
        doc.rect(mx + 15, mStartY + 365, mCardW - 30, 36).fillAndStroke("#F9F8F6", "#E5E0D8");
        doc.font(fontBld).fontSize(7.5).fillColor(accentColor)
          .text("HỒ SƠ BÀN GIAO GIA CÔNG", mx + 22, mStartY + 372);
        doc.font(fontReg).fontSize(7).fillColor("#666666")
          .text("Kèm file vector tỷ lệ 1:1 trong gói file xuất xưởng.", mx + 22, mStartY + 384);
      });

      doc.end();
      writeStream.on("finish", () => resolve());
      writeStream.on("error", (e) => reject(e));
    } catch (e) {
      reject(e);
    }
  });

  const slug = project.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    svg_url: `/downloads/${project.project_id}/logo_master.svg`,
    png_url: `/downloads/${project.project_id}/logo_transparent.png`,
    pdf_url: `/downloads/${project.project_id}/brand_guideline.pdf`,
    client_proposal_url: `/p/${slug}`
  };
}

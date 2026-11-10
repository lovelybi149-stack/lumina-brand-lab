/**
 * FILE 5: src/logo-backend/brandKitExporter.js
 * Zero-Failure SVG Optimizer, Brand Identity Guideline Generator & Brand Kit Packager
 */

function cleanSvgCode(rawSvg) {
  const str = String(rawSvg || "").trim();
  try {
    const dynamicRequire = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : eval("require");
    const svgo = dynamicRequire("svgo");
    const res = svgo.optimize(str, {
      multipass: true,
      plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }]
    });
    if (res && res.data) return res.data;
  } catch (_e) {
    // Fallback nếu chưa cài svgo: dọn sạch comment và khoảng trắng thừa bằng Regex an toàn
  }
  return str
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function hexToRgbVals(hex) {
  const clean = String(hex || "#000000").replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(full.substring(0, 2), 16) || 0,
    g: parseInt(full.substring(2, 4), 16) || 0,
    b: parseInt(full.substring(4, 6), 16) || 0
  };
}

function hexToCmykStr(hex) {
  const { r, g, b } = hexToRgbVals(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.99) return "C:0 M:0 Y:0 K:100";
  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kP = Math.round(k * 100);
  return `C:${c} M:${m} Y:${y} K:${kP}`;
}

function hexToPantoneStr(hex) {
  const { r, g, b } = hexToRgbVals(hex);
  if (r > 200 && g > 150 && b < 100) return "PANTONE 130 C";
  if (r > 200 && g < 100 && b < 100) return "PANTONE 1795 C";
  if (r < 100 && g > 130 && b > 80) return "PANTONE 340 C";
  if (r < 100 && g < 100 && b > 160) return "PANTONE 286 C";
  if (r > 150 && g < 100 && b > 150) return "PANTONE 2592 C";
  if (r > 180 && g > 140 && b < 60) return "PANTONE 7408 C";
  return "PANTONE Solid Coated";
}

function generateBrandGuidelineHTML(logoCandidate) {
  const { brandName, tagline, variants, palette, typography, audit } = logoCandidate;
  const primaryRgb = hexToRgbVals(palette.primary);
  const secondaryRgb = hexToRgbVals(palette.secondary);
  const textRgb = hexToRgbVals(palette.text);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <title>Brand Identity & Logo Guidelines — ${brandName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 40px; background: #F8F7F4; color: #1E1B18; line-height: 1.6; }
    .container { max-width: 1040px; margin: 0 auto; background: #FFFFFF; padding: 48px; border-radius: 24px; box-shadow: 0 16px 48px rgba(0,0,0,0.06); border: 1px solid #ECE7DE; }
    h1, h2, h3, h4 { font-family: 'Montserrat', sans-serif; margin-top: 0; color: #111827; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F0EDE6; padding-bottom: 24px; margin-bottom: 36px; }
    .badge { background: ${palette.primary}; color: #fff; padding: 6px 14px; border-radius: 99px; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 36px; }
    .card { border: 1px solid #EAE6DF; border-radius: 16px; padding: 24px; text-align: center; background: #FAF9F6; display: flex; flex-direction: column; justify-content: space-between; }
    .card-dark { background: ${palette.darkBackground || "#141210"}; color: #fff; }
    .card-dark h3 { color: #fff; }
    .swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
    .swatch { border-radius: 14px; overflow: hidden; border: 1px solid #E5E0D8; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .swatch-color { height: 80px; }
    .swatch-info { padding: 12px; font-size: 12px; background: #fff; line-height: 1.5; }
    .spec-box { background: #FAF9F5; border: 1px dashed #D6CEBE; border-radius: 16px; padding: 20px; margin-bottom: 36px; }
    .dont-card { border: 1px solid #FCA5A5; background: #FEF2F2; border-radius: 12px; padding: 16px; font-size: 13px; color: #991B1B; }
    .dont-card strong { display: block; margin-bottom: 4px; font-size: 14px; color: #B91C1C; }
    .clearspace-diagram { border: 2px dashed ${palette.primary}; padding: 24px; border-radius: 16px; text-align: center; background: #FFFDF7; position: relative; }
    .tag { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: #E5E7EB; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 style="font-size: 28px; margin-bottom: 6px;">${brandName} — Brand Identity &amp; Logo Guidelines</h1>
        <p style="margin:0; opacity:0.75; font-size: 14px;">Tagline: <strong>${tagline || "—"}</strong> · Optical QA Grade: <strong>${audit.grade} (${audit.overallScore}/100)</strong> · Chuẩn mực Agency quốc tế</p>
      </div>
      <span class="badge">WCAG ${audit.wcagLevel} (${audit.contrastRatio}:1)</span>
    </div>

    <h2>1. Hệ thống 5 Phiên bản Logo Quy chuẩn (Logo Variants)</h2>
    <div class="grid-2">
      <div class="card">
        <h3>Bản Màu Chính (Primary Light)</h3>
        <div style="padding: 10px 0;">${variants.primary}</div>
        <span class="tag">Ứng dụng trên nền sáng, giấy trắng, profile số</span>
      </div>
      <div class="card card-dark">
        <h3>Bản Nền Tối (Dark Mode)</h3>
        <div style="padding: 10px 0;">${variants.dark}</div>
        <span class="tag" style="background:#27272A; color:#E4E4E7;">Ứng dụng trên nền đen, giao diện màn đêm, biển hiệu led</span>
      </div>
      <div class="card">
        <h3>Bản Đơn Sắc Đen (Monochrome Black)</h3>
        <div style="padding: 10px 0;">${variants.monoBlack}</div>
        <span class="tag">Dành cho in hóa đơn, fax, photocopy, khắc laser</span>
      </div>
      <div class="card" style="background:#09090B; color:#fff;">
        <h3 style="color:#fff;">Bản Đơn Sắc Trắng (Monochrome White)</h3>
        <div style="padding: 10px 0;">${variants.monoWhite}</div>
        <span class="tag" style="background:#27272A; color:#E4E4E7;">Dành cho đóng dấu chìm (watermark), thêu dệt áo tối màu</span>
      </div>
    </div>

    <h2>2. Quy chuẩn Tỷ lệ Lưới &amp; Vùng An Toàn (Grid &amp; 1X Clear Space)</h2>
    <div class="spec-box">
      <div class="clearspace-diagram">
        <span style="position: absolute; top: 8px; left: 12px; font-size: 11px; font-weight: 700; color: ${palette.primary}; font-family: monospace;">VÙNG AN TOÀN 1X (QUIET ZONE)</span>
        <div style="max-width: 480px; margin: 0 auto; padding: 20px 0;">
          ${variants.primary}
        </div>
      </div>
      <div style="margin-top: 16px; font-size: 13px; color: #4B5563;">
        <p><strong>• Đơn vị cơ sở (X):</strong> Được tính bằng chiều cao của biểu tượng chính (Icon/Emblem).<br/>
        <strong>• Quy tắc Vùng an toàn 1X:</strong> Khoảng đệm bao quanh logo 4 hướng tối thiểu bằng <strong>1X</strong>. Tuyệt đối không để bất kỳ chữ, viền hay họa tiết nào lấn vào khu vực này.<br/>
        <strong>• Kích thước in ấn tối thiểu:</strong> Chiều ngang logo $\ge 20\\text{mm}$. Kích thước hiển thị màn hình số $\ge 60\\text{px}$ (Favicon $16\\times 16\\text{px}$).</p>
      </div>
    </div>

    <h2>3. Hệ thống 4 Bảng Màu Chuẩn Quốc Tế (Color Standardization)</h2>
    <div class="swatches">
      <div class="swatch">
        <div class="swatch-color" style="background:${palette.primary}"></div>
        <div class="swatch-info">
          <strong>Primary Brand</strong><br/>
          HEX: <code>${palette.primary}</code><br/>
          RGB: <code>${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}</code><br/>
          CMYK: <code>${hexToCmykStr(palette.primary)}</code><br/>
          PMS: <code>${hexToPantoneStr(palette.primary)}</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-color" style="background:${palette.secondary}"></div>
        <div class="swatch-info">
          <strong>Secondary Brand</strong><br/>
          HEX: <code>${palette.secondary}</code><br/>
          RGB: <code>${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}</code><br/>
          CMYK: <code>${hexToCmykStr(palette.secondary)}</code><br/>
          PMS: <code>${hexToPantoneStr(palette.secondary)}</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-color" style="background:${palette.text}"></div>
        <div class="swatch-info">
          <strong>Typography Text</strong><br/>
          HEX: <code>${palette.text}</code><br/>
          RGB: <code>${textRgb.r}, ${textRgb.g}, ${textRgb.b}</code><br/>
          CMYK: <code>${hexToCmykStr(palette.text)}</code><br/>
          PMS: <code>PANTONE Black C</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-color" style="background:${palette.background}; border-bottom: 1px solid #E5E7EB;"></div>
        <div class="swatch-info">
          <strong>Canvas Surface</strong><br/>
          HEX: <code>${palette.background}</code><br/>
          RGB: <code>${hexToRgbVals(palette.background).r}, ${hexToRgbVals(palette.background).g}, ${hexToRgbVals(palette.background).b}</code><br/>
          CMYK: <code>${hexToCmykStr(palette.background)}</code><br/>
          Nền giấy mỹ thuật cao cấp
        </div>
      </div>
    </div>

    <h2>4. Quy chuẩn Kiểu Chữ (Typography) &amp; Kỹ thuật Vector</h2>
    <div class="spec-box">
      <p style="margin: 0; font-size: 13.5px;">
        <strong>• Font Tiêu đề Chính (Heading Font):</strong> ${typography.headingFont} (Weight: 700 - 900)<br/>
        <strong>• Font Thông điệp Phụ (Tagline Font):</strong> ${typography.taglineFont} (Tracking: 0.16em - 0.25em)<br/>
        <strong>• Độ tinh khiết Vector:</strong> 100% SVG thuần (${audit.nodeCount} nodes, dung lượng ${audit.byteSize} bytes)<br/>
        <strong>• Khả năng hiển thị Favicon 16x16px:</strong> ${audit.favicon16pxPass ? "✓ ĐẠT CHUẨN SẮC NÉT" : "CẦN LƯU Ý"}
      </p>
    </div>

    <h2>5. 6 Điều Cấm Kỵ Khi Sử Dụng Logo (Logo Don&apos;ts)</h2>
    <div class="grid-3">
      <div class="dont-card">
        <strong>1. Không bóp méo tỷ lệ</strong>
        Tuyệt đối giữ đúng tỷ lệ 1:1 khi phóng to hoặc thu nhỏ, không kéo giãn ngang/dọc.
      </div>
      <div class="dont-card">
        <strong>2. Không tự ý đổi màu</strong>
        Chỉ sử dụng các mã màu đã quy chuẩn trong bảng màu chính thức ở Mục 3.
      </div>
      <div class="dont-card">
        <strong>3. Không xoay nghiêng</strong>
        Logo phải luôn đặt trên trục nằm ngang thẳng đứng, không xoay góc tùy tiện.
      </div>
      <div class="dont-card">
        <strong>4. Không thêm hiệu ứng 3D</strong>
        Không áp dụng bóng đổ, viền nét hay phát sáng làm mất đi tính tối giản thuần khiết.
      </div>
      <div class="dont-card">
        <strong>5. Không vi phạm vùng an toàn</strong>
        Không đặt text, hình ảnh hay họa tiết lấn vào khoảng trống 1X bao quanh logo.
      </div>
      <div class="dont-card">
        <strong>6. Không đặt trên nền rối</strong>
        Không đặt logo trên nền ảnh phức tạp hoặc có độ tương phản kém gây khó đọc.
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildBrandKitBundle(logoCandidate) {
  const slug = String(logoCandidate.brandName || "brand")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "brand";

  const files = {
    [`${slug}-brand-kit/01-svg/${slug}-primary.svg`]: cleanSvgCode(logoCandidate.variants.primary),
    [`${slug}-brand-kit/01-svg/${slug}-dark.svg`]: cleanSvgCode(logoCandidate.variants.dark),
    [`${slug}-brand-kit/01-svg/${slug}-mono-black.svg`]: cleanSvgCode(logoCandidate.variants.monoBlack),
    [`${slug}-brand-kit/01-svg/${slug}-mono-white.svg`]: cleanSvgCode(logoCandidate.variants.monoWhite),
    [`${slug}-brand-kit/01-svg/${slug}-icon-only.svg`]: cleanSvgCode(logoCandidate.variants.iconOnly),
    [`${slug}-brand-kit/02-guideline/${slug}-brand-guideline.html`]: generateBrandGuidelineHTML(logoCandidate)
  };

  return {
    slug,
    fileCount: Object.keys(files).length,
    files,
    guidelineHtml: files[`${slug}-brand-kit/02-guideline/${slug}-brand-guideline.html`]
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { cleanSvgCode, generateBrandGuidelineHTML, buildBrandKitBundle };
}

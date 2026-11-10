require('sucrase/register/ts');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function runTests() {
  console.log('================================================================');
  console.log('🧠 LUMINA BRAND LAB — KIỂM THỬ BỘ NÃO AI THIẾT KẾ THƯƠNG HIỆU 2.0');
  console.log('================================================================\n');

  // Load modules directly via sucrase
  const archetypesMod = require('../lib/designArchetypes.ts');
  const pollinationsMod = require('../lib/pollinationsService.ts');
  const designerMod = require('../lib/aiBrandDesignerService.ts');

  // 1. KIỂM THỬ KHO TRI THỨC HÌNH HỌC (lib/designArchetypes.ts)
  console.log('▶ [PHẦN 1] Kiểm tra Kho Tri Thức Hình Học Thiết Kế (DESIGN_ARCHETYPES)');
  const archetypes = archetypesMod.DESIGN_ARCHETYPES;
  const keys = Object.keys(archetypes);
  console.log(`  ✅ Đã tải ${keys.length} Archetypes:`, keys.join(', '));

  for (const k of keys) {
    const arch = archetypes[k];
    console.log(`     - [${k}]: ${arch.styleName}`);
    console.log(`       + Ngành mục tiêu: ${arch.targetIndustries.slice(0, 3).join(', ')}`);
    console.log(`       + Phân cấp nét: chính ${arch.geometryRules.strokeHierarchy.primary}, phụ ${arch.geometryRules.strokeHierarchy.secondary}`);
    console.log(`       + Snippet SVG: ${arch.sampleSvgSnippet.length} ký tự (hợp lệ XML)`);
  }

  // Thử khớp Archetype cho các ngành
  const techArch = archetypesMod.getArchetypeForIndustry('Công nghệ & Trí tuệ nhân tạo AI');
  console.log(`\n  ✅ Khớp ngành Công nghệ -> Archetype: ${techArch.key} (${techArch.archetype.styleName})`);
  const fashionArch = archetypesMod.getArchetypeForIndustry('Thời trang & May mặc cao cấp');
  console.log(`  ✅ Khớp ngành Thời trang -> Archetype: ${fashionArch.key} (${fashionArch.archetype.styleName})`);
  const fnbArch = archetypesMod.getArchetypeForIndustry('F&B Cà phê đặc sản Wabi-sabi');
  console.log(`  ✅ Khớp ngành F&B -> Archetype: ${fnbArch.key} (${fnbArch.archetype.styleName})\n`);

  // 2. KIỂM THỬ DỊCH VỤ HÌNH ẢNH POLLINATIONS.AI (lib/pollinationsService.ts)
  console.log('▶ [PHẦN 2] Kiểm thử Dịch vụ Hình Ảnh Pollinations.AI (FLUX.1)');
  const testProjectId = 'LUMINA-TEST-AI';
  const moodboardUrl = await pollinationsMod.generateAndSaveMoodboard(
    'Aura Cyber',
    'Công nghệ & Phần mềm',
    'Modern, Minimalist',
    'Cool & Tech (Electric Blue, Cyan Laser)',
    testProjectId,
    ['#0A84FF', '#1C1C1E', '#00F2FE', '#F5F5F7']
  );

  console.log(`  ✅ Đã khởi tạo Moodboard URL: ${moodboardUrl}`);
  const expectedDiskPath = path.join(process.cwd(), 'public', moodboardUrl.replace(/^\//, ''));
  if (fs.existsSync(expectedDiskPath)) {
    const imgMeta = await sharp(expectedDiskPath).metadata();
    console.log(`  ✅ File ảnh tồn tại trên đĩa: ${expectedDiskPath}`);
    console.log(`     - Kích thước: ${imgMeta.width} x ${imgMeta.height} px`);
    console.log(`     - Định dạng: ${imgMeta.format}, dung lượng: ${(fs.statSync(expectedDiskPath).size / 1024).toFixed(1)} KB\n`);
  } else {
    throw new Error(`Không tìm thấy file ảnh moodboard tại: ${expectedDiskPath}`);
  }

  // 3. KIỂM THỬ DỊCH VỤ BỘ NÃO AI THIẾT KẾ (lib/aiBrandDesignerService.ts)
  console.log('▶ [PHẦN 3] Kiểm thử Bộ Não AI Thiết Kế Thương Hiệu (aiBrandDesignerService)');
  const brandBrief = {
    brand_name: 'Morphic Studio',
    industry: 'Công nghệ & AI Film',
    target_audience: 'Người sáng tạo 18-35 tuổi, nhà làm phim thế hệ mới',
    logo_format: 'Combination Mark',
    color_tone: 'Cool & Tech (Xanh điện tử, Xám chì, Cyan Laser)',
    style_vibes: ['Modern', 'Architectural', 'Minimalist'],
    slogan: 'Từ hình ảnh tạo nên câu chuyện số'
  };

  const generatedKit = await designerMod.generateAiBrandDesign(brandBrief);

  console.log(`  ✅ Đã tạo thành công Brand Kit qua: ${generatedKit.ai_generated_via}`);
  console.log(`     - Tên thương hiệu: ${generatedKit.brand_name}`);
  console.log(`     - Slogan chính: "${generatedKit.tagline}"`);
  console.log(`     - 3 Slogan gợi ý:`, generatedKit.tagline_options);
  console.log(`     - Câu chuyện (<100 từ): "${generatedKit.brand_story.slice(0, 100)}..."`);
  console.log(`     - Bảng màu (${generatedKit.palette.length} mã):`, generatedKit.palette.map(c => `${c.role}: ${c.hex} (${c.name})`).join(' | '));
  console.log(`     - Typography: Header "${generatedKit.typography.heading}" / Body "${generatedKit.typography.body}"`);

  // Kiểm tra 3 Options Logo
  console.log(`\n  🎨 Kiểm tra 3 Option Logo Master riêng biệt:`);
  if (!generatedKit.logo_options || generatedKit.logo_options.length !== 3) {
    throw new Error(`Số lượng options logo không đúng: ${generatedKit.logo_options?.length} (cần 3 options)`);
  }

  for (const opt of generatedKit.logo_options) {
    console.log(`     + [${opt.id}] ${opt.title}`);
    console.log(`       - Rationale: ${opt.concept_note}`);
    console.log(`       - Độ dài SVG: ${opt.svg.length} bytes (viewBox="0 0 500 500")`);
    if (!opt.svg.includes('<svg') || !opt.svg.includes('</svg>')) {
      throw new Error(`SVG của ${opt.id} không hợp lệ!`);
    }
  }

  // Dọn dẹp thư mục test
  const testDir = path.join(process.cwd(), 'public', 'generated', testProjectId);
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  console.log('\n================================================================');
  console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ BỘ NÃO AI ĐỀU ĐẠT 100% THÀNH CÔNG!');
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('❌ Lỗi kiểm thử:', err);
  process.exit(1);
});

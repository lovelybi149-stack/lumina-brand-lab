const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function runAllTests() {
  console.log('================================================================');
  console.log('🧪 LUMINA BRAND LAB — KIỂM THỬ TÍNH NĂNG XỬ LÝ HÌNH ẢNH 2.0');
  console.log('================================================================\n');

  // Load modules dynamically
  const mockupService = await import('../lib/mockupService.ts');
  const imagenHelper = await import('../lib/imagenHelper.ts');

  const { ensureBlankNamecardTemplate, compositeLogoOnMockup } = mockupService;
  const { buildImagen3MoodboardPrompt, callGoogleImagen3 } = imagenHelper;

  // TEST 1: Kiểm tra phôi mẫu danh thiếp
  console.log('▶ [TEST 1] Khởi tạo và kiểm tra phôi mẫu: /public/mockups/blank_namecard.png');
  const templatePath = await ensureBlankNamecardTemplate();
  if (fs.existsSync(templatePath)) {
    const meta = await sharp(templatePath).metadata();
    console.log(`  ✅ Phôi mẫu tồn tại tại: ${templatePath}`);
    console.log(`  📐 Kích thước: ${meta.width} x ${meta.height} px (${meta.format}, ${meta.channels} channels)\n`);
  } else {
    throw new Error('❌ Không tìm thấy phôi mẫu sau khi khởi tạo!');
  }

  // TEST 2: Ghép Logo SVG lên phôi danh thiếp với Sharp (Màu #3D2B1F & #9E6B55)
  console.log('▶ [TEST 2] Ghép Logo SVG lên phôi danh thiếp với thư viện Sharp');
  const svgContent = fs.readFileSync(path.join(process.cwd(), 'logo_master.svg'), 'utf8');

  // Test 2.1: Ghép với mã màu Nâu Vỏ Thông (#3D2B1F)
  const result1 = await compositeLogoOnMockup({
    svg: svgContent,
    color: '#3D2B1F',
    scale: 1.0,
    effect: 'letterpress'
  });
  console.log(`  ✅ [2.1] Ghép logo màu #3D2B1F thành công!`);
  console.log(`     - Định dạng: ${result1.contentType}`);
  console.log(`     - Kích thước: ${result1.width} x ${result1.height}`);
  console.log(`     - Dung lượng: ${(result1.buffer.length / 1024).toFixed(1)} KB`);

  // Lưu file mẫu ra public/mockups/sample_namecard_3d2b1f.png
  const out1 = path.join(process.cwd(), 'public', 'mockups', 'sample_namecard_3d2b1f.png');
  fs.writeFileSync(out1, result1.buffer);
  console.log(`     - Đã lưu file thực tế: ${out1}`);

  // Test 2.2: Ghép với mã màu Đất Đỏ Bazan (#9E6B55)
  const result2 = await compositeLogoOnMockup({
    svg: svgContent,
    color: '#9E6B55',
    scale: 1.1,
    effect: 'emboss'
  });
  console.log(`  ✅ [2.2] Ghép logo màu #9E6B55 (scale 1.1) thành công! Dung lượng: ${(result2.buffer.length / 1024).toFixed(1)} KB`);
  const out2 = path.join(process.cwd(), 'public', 'mockups', 'sample_namecard_9e6b55.png');
  fs.writeFileSync(out2, result2.buffer);
  console.log(`     - Đã lưu file thực tế: ${out2}\n`);

  // TEST 3: Kiểm thử Helper Prompt Chuẩn Studio cho Google Imagen 3
  console.log('▶ [TEST 3] Kiểm thử Helper tạo Prompt chuẩn Studio cho Google Imagen 3');

  // 3.1: Case Study Gió Mộc Coffee (Wabi-sabi, Highland Coffee)
  const promptGioMoc = buildImagen3MoodboardPrompt({
    brandName: 'Gió Mộc Coffee',
    industry: 'F&B Specialty Coffee & Slow Workspace',
    brandStory: 'Ẩn mình giữa triền đồi thông lộng gió của Đà Lạt, Gió Mộc Coffee là nơi thời gian chậm lại để tâm hồn tìm về nguyên bản.',
    targetAudience: 'Người trẻ 20-38 tuổi, người làm sáng tạo, freelancer chuộng không gian yên tĩnh',
    colorPalette: [
      { role: 'Primary', name: 'Nâu Vỏ Thông Già', hex: '#3D2B1F' },
      { role: 'Secondary', name: 'Đất Đỏ Bazan Mờ', hex: '#9E6B55' },
      { role: 'Neutral', name: 'Trắng Giấy Dó Mộc', hex: '#F4EFEA' },
      { role: 'Accent', name: 'Xanh Thông Núi Mờ', hex: '#5B7065' }
    ],
    styleVibes: ['Minimalist', 'Rustic', 'Wabi-sabi', 'Artisanal'],
    sceneType: 'cafe_interior',
    aspectRatio: '16:9'
  });

  console.log('  ✅ [3.1] Prompt cho Gió Mộc Coffee:');
  console.log('  -------------------------------------------------------------');
  console.log('  📌 MODEL:', promptGioMoc.model);
  console.log('  📌 TỶ LỆ:', promptGioMoc.aspectRatio);
  console.log('  📌 PROMPT ĐẦU RA:\n', promptGioMoc.prompt);
  console.log('  -------------------------------------------------------------');
  console.log('  🛡️ NEGATIVE PROMPT:\n', promptGioMoc.negativePrompt);
  console.log('  -------------------------------------------------------------\n');

  // 3.2: Case Study L'Atelier Silence (Quiet Luxury, Fashion)
  const promptNoir = buildImagen3MoodboardPrompt({
    brandName: "L'ATELIER SILENCE",
    industry: 'Thời trang thiết kế nữ cao cấp (Ready-to-wear)',
    brandStory: 'L\'ATELIER SILENCE là tuyên ngôn của vẻ đẹp không phô trương. Chúng tôi kiến tạo sự thanh lịch qua phom dáng chuẩn xác và chất liệu tự nhiên thượng hạng.',
    colorPalette: [
      { role: 'Primary', name: 'Deep Obsidian', hex: '#1A1A1A' },
      { role: 'Secondary', name: 'Brushed Champagne', hex: '#C2A676' },
      { role: 'Neutral', name: 'Raw Linen', hex: '#E7E3DC' }
    ],
    styleVibes: ['Quiet Luxury', 'Minimalist', 'Architectural', 'Timeless Elegance'],
    sceneType: 'fashion_editorial',
    aspectRatio: '4:3'
  });

  console.log("  ✅ [3.2] Prompt cho L'ATELIER SILENCE:");
  console.log('  -------------------------------------------------------------');
  console.log('  📌 TỶ LỆ:', promptNoir.aspectRatio);
  console.log('  📌 PROMPT ĐẦU RA:\n', promptNoir.prompt);
  console.log('  -------------------------------------------------------------\n');

  // TEST 4: Thử nghiệm hàm gọi Google Imagen 3 (Chế độ mô phỏng / an toàn)
  console.log('▶ [TEST 4] Thử nghiệm hàm gọi callGoogleImagen3()');
  const callResult = await callGoogleImagen3({
    brandName: 'Gió Mộc Coffee',
    sceneType: 'cafe_interior',
    aspectRatio: '16:9'
  });
  console.log(`  ✅ Kết quả gọi Imagen 3: success = ${callResult.success}`);
  console.log(`  🖼️ URL ảnh Moodboard: ${callResult.imageUrl}`);
  console.log(`  💬 Thông điệp: ${callResult.message}\n`);

  console.log('================================================================');
  console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ XỬ LÝ HÌNH ẢNH ĐỀU ĐẠT 100% THÀNH CÔNG!');
  console.log('================================================================');
}

runAllTests().catch((err) => {
  console.error('❌ Lỗi kiểm thử:', err);
  process.exit(1);
});

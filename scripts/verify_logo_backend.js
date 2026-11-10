#!/usr/bin/env node
/**
 * scripts/verify_logo_backend.js
 * Self-Grading Verification Script for the 5 Quantitative Popper Gates (G1-G5)
 */
const assert = require("assert");
const { generateLogoBatch, buildBrandKitBundle } = require("../src/logo-backend");

(async () => {
  console.log("=== RUNNING 5 POPPER VERIFICATION GATES ===");

  // Chạy thử tạo 12 mẫu logo cho thương hiệu GOBITA.AI
  const res = await generateLogoBatch({
    brandName: "GOBITA.AI",
    tagline: "Go Big, Take Action",
    industry: "ai-tech",
    count: 12,
    offlineOnly: true
  });

  // GATE 1: Vector Purity (100% vector thuần, 0 thẻ <image>, có viewBox)
  assert.strictEqual(res.logos.length, 12, "G1 Failed: Phải sinh đủ 12 mẫu logo");
  for (const logo of res.logos) {
    assert.ok(logo.svg.includes("viewBox="), `G1 Failed: Thiếu viewBox ở ${logo.id}`);
    assert.ok(!/<image\b/i.test(logo.svg), `G1 Failed: Có thẻ raster <image> ở ${logo.id}`);
    assert.strictEqual(logo.audit.isPureVector, true, `G1 Failed: isPureVector=false ở ${logo.id}`);
  }
  console.log("PASS [G1]: Vector Purity (12/12 logos are 100% pure SVG with viewBox, 0 raster images)");

  // GATE 2: Đủ 5 Biến thể Màu & Xuất được Cẩm nang Thương hiệu (Brand Kit Bundle)
  const firstLogo = res.logos[0];
  for (const mode of ["primary", "dark", "monoBlack", "monoWhite", "iconOnly"]) {
    assert.ok(firstLogo.variants[mode] && firstLogo.variants[mode].startsWith("<svg"), `G2 Failed: Thiếu biến thể ${mode}`);
  }
  const bundle = buildBrandKitBundle(firstLogo);
  assert.strictEqual(bundle.fileCount, 6, "G2 Failed: Brand Kit phải có đủ 6 file chuẩn");
  console.log("PASS [G2]: Multi-Variant & Brand Kit Bundle (5 SVG variants + Brand-Guideline.html generated)");

  // GATE 3: Độ gọn nhẹ của Vector (Node count <= 150 & Dung lượng < 15 KB)
  for (const logo of res.logos) {
    assert.ok(logo.audit.nodeCount <= 150, `G3 Failed: Quá 150 nodes (${logo.audit.nodeCount})`);
    assert.ok(logo.audit.byteSize < 15360, `G3 Failed: Quá 15KB (${logo.audit.byteSize} bytes)`);
  }
  console.log(`PASS [G3]: Path Simplicity & Size (Max nodes: ${Math.max(...res.logos.map(l => l.audit.nodeCount))}/150, Max size: ${Math.max(...res.logos.map(l => l.audit.byteSize))} bytes < 15KB)`);

  // GATE 4: Kiểm định Quang học Favicon 16x16px & Độ tương phản WCAG
  for (const logo of res.logos) {
    assert.strictEqual(logo.audit.favicon16pxPass, true, `G4 Failed: Không đạt 16px test ở ${logo.id}`);
    assert.ok(logo.audit.overallScore >= 85, `G4 Failed: Điểm quang học thấp (${logo.audit.overallScore})`);
  }
  console.log(`PASS [G4]: 16x16px Favicon & Optical QA (Average score: ${Math.round(res.logos.reduce((s, l) => s + l.audit.overallScore, 0) / res.logos.length)}/100)`);

  // GATE 5: Tốc độ Phản hồi & Đa ngành nghề (< 500ms cho 12 mẫu)
  assert.ok(res.generationTimeMs < 500, `G5 Failed: Quá chậm (${res.generationTimeMs}ms)`);
  console.log(`PASS [G5]: Performance Benchmark (${res.generationTimeMs}ms < 500ms for 12 complete logo kits)`);

  console.log("\n✅ ALL 5 POPPER GATES PASSED (5/5)!");
  process.exit(0);
})().catch((err) => {
  console.error("\n❌ VERIFICATION FAILED:", err.message);
  process.exit(1);
});


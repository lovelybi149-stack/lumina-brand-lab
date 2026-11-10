const fs = require('fs');

['LUMINA-08', 'LUMINA-09', 'LUMINA-10', 'LUMINA-11'].forEach(id => {
  const file = 'curated_records/' + id + '.json';
  if (!fs.existsSync(file)) return;
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(`\n=== ${id} [${d.brand_name}] ===`);
  d.logo_options.forEach((opt, idx) => {
    const emblemCount = (opt.svg.match(/id=['"]logo-emblem['"]/g) || []).length;
    const hasDevString = opt.svg.includes('ARCHETYPE') || opt.svg.includes('WABI-SABI');
    const isPureVector = !opt.svg.includes('<image') && !opt.svg.includes('data:image');
    console.log(`  Opt ${idx+1}: ${opt.title}`);
    console.log(`    - Emblem tags count: ${emblemCount} (ideal: 1)`);
    console.log(`    - Contains dev strings: ${hasDevString} (ideal: false)`);
    console.log(`    - Pure vector: ${isPureVector}`);
    console.log(`    - SVG Size: ${opt.svg.length} bytes`);
  });
});

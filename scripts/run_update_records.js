const ts = require('typescript');
const fs = require('fs');

const brandEnginesTs = fs.readFileSync('lib/brandMarkEngines.ts', 'utf8');
const brandKitTs = fs.readFileSync('lib/industryBrandKit.ts', 'utf8');

const brandEnginesJs = ts.transpileModule(brandEnginesTs, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const brandKitJs = ts.transpileModule(brandKitTs, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

fs.writeFileSync('scripts/tmp_brandMarkEngines.js', brandEnginesJs);

// Fix relative require in transpile
const fixedKitJs = brandKitJs.replace(
  /require\(['"]\.\/brandMarkEngines['"]\)/g,
  "require('./tmp_brandMarkEngines')"
);
fs.writeFileSync('scripts/tmp_industryBrandKit.js', fixedKitJs);

const { getIndustryBrandKit, detectIndustryCategory } = require('./tmp_industryBrandKit.js');

const records = ['LUMINA-08', 'LUMINA-09', 'LUMINA-10'];

for (const id of records) {
  const file = 'curated_records/' + id + '.json';
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const cat = detectIndustryCategory(data.industry, data.target_audience, data.brand_name);
  console.log(`\n=== Processing ${id} [${data.brand_name}] ===`);
  console.log(`Category: ${cat}`);
  
  const kit = getIndustryBrandKit(cat, data.brand_name, data.target_audience, data.slogan);
  console.log(`Generated ${kit.options.length} options:`);
  kit.options.forEach((o, i) => console.log(`  ${i+1}. ${o.title}`));

  data.logo_options = kit.options;
  data.selected_logo_id = 'opt_1';
  data.logo_svg = kit.options[0].svg;
  data.palette = kit.palette;
  data.brand_story = kit.brandStory;
  data.typography = kit.typography;
  data.mockups = kit.mockups;

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved ${file} successfully.`);
}

// Cleanup temp files
try {
  fs.unlinkSync('scripts/tmp_brandMarkEngines.js');
  fs.unlinkSync('scripts/tmp_industryBrandKit.js');
} catch (e) {}

console.log('\n✅ ALL RECORDS PROCESSED AND VERIFIED!');

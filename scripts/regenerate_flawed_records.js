const fs = require('fs');
const { getIndustryBrandKit, detectIndustryCategory } = require('../lib/industryBrandKit');

const recordsToFix = [
  { id: 'LUMINA-08', file: 'curated_records/LUMINA-08.json' },
  { id: 'LUMINA-09', file: 'curated_records/LUMINA-09.json' },
  { id: 'LUMINA-10', file: 'curated_records/LUMINA-10.json' }
];

for (const rec of recordsToFix) {
  if (!fs.existsSync(rec.file)) continue;
  const data = JSON.parse(fs.readFileSync(rec.file, 'utf8'));
  const cat = detectIndustryCategory(data.industry, data.target_audience, data.brand_name);
  console.log(`Processing ${rec.id}: Brand=${data.brand_name}, Detected Category=${cat}`);

  const kit = getIndustryBrandKit(cat, data.brand_name, data.target_audience, data.slogan || (data.logo_options?.[0]?.title ? undefined : undefined));
  
  if (kit.options && kit.options.length >= 3) {
    data.logo_options = kit.options;
    data.selected_logo_id = "opt_1";
    data.logo_svg = kit.options[0].svg;
    data.palette = kit.palette;
    data.brand_story = kit.brandStory;
    data.typography = kit.typography;
    fs.writeFileSync(rec.file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Successfully updated ${rec.id} with ${kit.options.length} world-class options!`);
  } else {
    console.warn(`⚠️ Kit did not return 3 options for ${rec.id}`);
  }
}

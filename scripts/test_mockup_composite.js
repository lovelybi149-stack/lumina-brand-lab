const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load sample SVG from brand_identity.json or logo_master.svg
const logoSvg = fs.readFileSync(path.join(process.cwd(), 'logo_master.svg'), 'utf8');
const templatePath = path.join(process.cwd(), 'public', 'mockups', 'blank_namecard.png');

async function testComposite() {
  console.log('Testing composite on template:', templatePath);

  // 1. Process SVG: remove opaque canvas background rect
  let cleanSvg = logoSvg.replace(/<rect\s+[^>]*width=["']500["'][^>]*height=["']500["'][^>]*\/>/i, '');
  cleanSvg = cleanSvg.replace(/<rect\s+[^>]*rx=["']28["'][^>]*\/>/i, '');
  cleanSvg = cleanSvg.replace(/<rect\s+[^>]*rx=["']20["'][^>]*\/>/i, '');

  // 2. Apply color code: let's test with a rich color like #9E6B55 or #3D2B1F or #1E3A8A
  const testColor = '#3D2B1F';
  // replace title fill
  cleanSvg = cleanSvg.replace(/(\.brand-title\s*\{[^}]*fill:\s*)([^;]+)(;)/gi, `$1${testColor}$3`);

  // 3. Render logo to transparent PNG with Sharp
  const targetW = 460;
  const targetH = 300;

  const logoRendered = await sharp(Buffer.from(cleanSvg), { density: 300 })
    .resize({
      width: targetW,
      height: targetH,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  const logoMeta = await sharp(logoRendered).metadata();
  console.log('Resized logo dimensions:', logoMeta.width, 'x', logoMeta.height);

  // Card center in template: (800, 500)
  const left = Math.round(800 - (logoMeta.width || targetW) / 2);
  const top = Math.round(500 - (logoMeta.height || targetH) / 2);

  // 4. Composite onto template
  const outputBuffer = await sharp(templatePath)
    .composite([
      {
        input: logoRendered,
        top: top,
        left: left,
        blend: 'over'
      }
    ])
    .png({ quality: 95 })
    .toBuffer();

  const testOut = path.join(process.cwd(), 'public', 'mockups', 'test_namecard_result.png');
  fs.writeFileSync(testOut, outputBuffer);
  console.log('✅ Composite test succeeded! Written to:', testOut, 'size:', outputBuffer.length);
}

testComposite().catch(console.error);

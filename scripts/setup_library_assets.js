const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');

async function main() {
  console.log('=== KHỞI TẠO CẤU TRÚC KHO THƯ VIỆN DIGITAL ASSET MANAGEMENT ===');

  const publicDir = path.join(process.cwd(), 'public');
  const libraryDir = path.join(publicDir, 'library');
  const mockupsDir = path.join(libraryDir, 'mockups');
  const texturesDir = path.join(libraryDir, 'textures');
  const moodboardsDir = path.join(libraryDir, 'moodboards');
  const fbCoffeeDir = path.join(moodboardsDir, 'fb_coffee');
  const fashionMinimalDir = path.join(moodboardsDir, 'fashion_minimal');
  const techModernDir = path.join(moodboardsDir, 'tech_modern');
  const generatedDir = path.join(publicDir, 'generated');
  const dataDir = path.join(process.cwd(), 'data');

  [
    mockupsDir,
    texturesDir,
    fbCoffeeDir,
    fashionMinimalDir,
    techModernDir,
    generatedDir,
    dataDir
  ].forEach(d => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  });

  // ==========================================
  // 1. GENERATE MOCKUPS (PHÔI SẢN PHẨM SẠCH)
  // ==========================================
  console.log('1. Khởi tạo phôi sản phẩm mockups...');

  // 1.1 blank_namecard_modern.png (1600 x 1000)
  const namecardSvg = `
  <svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E8E3DC" />
        <stop offset="50%" stop-color="#DDD6CC" />
        <stop offset="100%" stop-color="#CCC2B4" />
      </linearGradient>
      <radialGradient id="spot" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.5" />
        <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0" />
        <stop offset="100%" stop-color="#1A1510" stop-opacity="0.2" />
      </radialGradient>
      <filter id="shadowMain" x="-20%" y="-20%" width="150%" height="160%">
        <feDropShadow dx="0" dy="35" stdDeviation="30" flood-color="#140E0A" flood-opacity="0.22" />
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#140E0A" flood-opacity="0.12" />
      </filter>
      <linearGradient id="paperG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAF8F5" />
        <stop offset="70%" stop-color="#F4EFEA" />
        <stop offset="100%" stop-color="#ECE5DC" />
      </linearGradient>
    </defs>
    <rect width="1600" height="1000" fill="url(#bgG)" />
    <rect width="1600" height="1000" fill="url(#spot)" />
    <!-- Botanical shadow blur -->
    <path d="M 1200 -100 Q 1350 200 1550 400 Q 1400 300 1200 500 Q 1100 250 1200 -100 Z" fill="#1A1510" opacity="0.06" filter="blur(25px)" />
    
    <!-- Blank Business Card Center -->
    <g transform="translate(370, 250)" filter="url(#shadowMain)">
      <!-- Main Card Surface (860 x 500) -->
      <rect width="860" height="500" rx="14" fill="url(#paperG)" />
      <!-- Subtle edge highlight -->
      <rect x="0.5" y="0.5" width="859" height="499" rx="13.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="1.5" />
      <!-- Paper grain grid hint -->
      <rect x="40" y="40" width="780" height="420" rx="8" fill="none" stroke="#DDD6CC" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="4 6" />
      <text x="430" y="255" text-anchor="middle" font-family="'Times New Roman', serif" font-style="italic" font-size="20" fill="#9E6B55" opacity="0.35" letter-spacing="0.1em">MOCKUP AREA • 860 × 500 PX</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(namecardSvg)).png({ quality: 95 }).toFile(path.join(mockupsDir, 'blank_namecard_modern.png'));

  // Also ensure blank_namecard.png in mockups
  await sharp(Buffer.from(namecardSvg)).png({ quality: 95 }).toFile(path.join(mockupsDir, 'blank_namecard.png'));

  // 1.2 blank_coffee_cup_ceramic.png (1600 x 1200)
  const cupSvg = `
  <svg width="1600" height="1200" viewBox="0 0 1600 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cupBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EBE7E1" />
        <stop offset="60%" stop-color="#DDD6CC" />
        <stop offset="100%" stop-color="#C5BDB0" />
      </linearGradient>
      <radialGradient id="cupSpot" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#261E18" stop-opacity="0.25" />
      </radialGradient>
      <filter id="saucerShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="45" stdDeviation="35" flood-color="#1A1410" flood-opacity="0.26" />
      </filter>
      <linearGradient id="ceramicG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FAF8F5" />
        <stop offset="25%" stop-color="#FFFFFF" />
        <stop offset="70%" stop-color="#F2ECE4" />
        <stop offset="100%" stop-color="#DDD5CA" />
      </linearGradient>
      <linearGradient id="saucerG" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#E2DBD1" />
      </linearGradient>
      <radialGradient id="coffeeSurface" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#C6894A" />
        <stop offset="40%" stop-color="#4A2F1D" />
        <stop offset="100%" stop-color="#28170D" />
      </radialGradient>
    </defs>
    <rect width="1600" height="1200" fill="url(#cupBg)" />
    <rect width="1600" height="1200" fill="url(#cupSpot)" />

    <!-- Saucer / Đĩa sứ -->
    <ellipse cx="800" cy="850" rx="420" ry="90" fill="url(#saucerG)" filter="url(#saucerShadow)" />
    <ellipse cx="800" cy="845" rx="360" ry="70" fill="#ECE5DA" />
    <ellipse cx="800" cy="840" rx="260" ry="50" fill="#E0D7CB" />

    <!-- Ceramic Coffee Cup Body -->
    <g id="cup">
      <!-- Shadow under cup on saucer -->
      <ellipse cx="800" cy="780" rx="220" ry="40" fill="#201712" opacity="0.3" filter="blur(10px)" />
      
      <!-- Cup Handle (Quai ly) -->
      <path d="M 980 500 C 1140 500 1140 700 970 710" fill="none" stroke="url(#ceramicG)" stroke-width="44" stroke-linecap="round" />
      <path d="M 980 500 C 1130 500 1130 700 970 710" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.6" stroke-linecap="round" />

      <!-- Cup Tapered Body -->
      <path d="M 600 460 Q 615 760 670 770 Q 800 790 930 770 Q 985 760 1000 460 Z" fill="url(#ceramicG)" />
      
      <!-- Inside Rim & Coffee liquid -->
      <ellipse cx="800" cy="460" rx="200" ry="60" fill="#FFFFFF" />
      <ellipse cx="800" cy="462" rx="180" ry="52" fill="url(#coffeeSurface)" />
      <!-- Crema foam swirl -->
      <path d="M 770 455 Q 810 445 840 465 Q 810 475 770 455 Z" fill="#D8A56E" opacity="0.75" />

      <!-- Branding Mockup Area Label -->
      <text x="800" y="630" text-anchor="middle" font-family="'Times New Roman', serif" font-style="italic" font-size="22" fill="#9E6B55" opacity="0.35" letter-spacing="0.12em">CERAMIC CUP • BLANK PRINT AREA</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(cupSvg)).png({ quality: 95 }).toFile(path.join(mockupsDir, 'blank_coffee_cup_ceramic.png'));

  // 1.3 blank_kraft_bag.png (1400 x 1200)
  const bagSvg = `
  <svg width="1400" height="1200" viewBox="0 0 1400 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bagBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E3DDD3" />
        <stop offset="50%" stop-color="#D7CFBF" />
        <stop offset="100%" stop-color="#C2B7A3" />
      </linearGradient>
      <filter id="bagShadow" x="-20%" y="-10%" width="150%" height="140%">
        <feDropShadow dx="0" dy="50" stdDeviation="40" flood-color="#1C140E" flood-opacity="0.28" />
      </filter>
      <linearGradient id="kraftG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#B38A65" />
        <stop offset="25%" stop-color="#C9A17C" />
        <stop offset="70%" stop-color="#BC936E" />
        <stop offset="100%" stop-color="#9C734E" />
      </linearGradient>
      <linearGradient id="kraftFold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8C6543" />
        <stop offset="100%" stop-color="#C9A17C" />
      </linearGradient>
    </defs>
    <rect width="1400" height="1200" fill="url(#bagBg)" />

    <!-- Bag Group -->
    <g id="kraftBag" transform="translate(430, 200)" filter="url(#bagShadow)">
      <!-- Top folded sealed strip -->
      <path d="M 20 0 L 520 0 L 540 60 L 0 60 Z" fill="#8E6746" />
      <line x1="10" y1="30" x2="530" y2="30" stroke="#684A31" stroke-width="3" stroke-dasharray="6 4" />

      <!-- Main Bag Front Panel -->
      <path d="M 0 60 L 540 60 L 520 820 L 20 820 Z" fill="url(#kraftG)" />
      
      <!-- Side Creases (Gấp hông túi) -->
      <path d="M 0 60 L 50 140 L 50 780 L 20 820 Z" fill="#9C734E" opacity="0.3" />
      <path d="M 540 60 L 490 140 L 490 780 L 520 820 Z" fill="#755234" opacity="0.4" />

      <!-- 1-Way Valve (Van 1 chiều thở hạt cà phê) -->
      <circle cx="270" cy="190" r="18" fill="#5A3E26" opacity="0.8" />
      <circle cx="270" cy="190" r="14" fill="#C9A17C" opacity="0.5" />
      <circle cx="270" cy="190" r="4" fill="#3D2919" />

      <!-- Blank Label Area Frame -->
      <rect x="90" y="270" width="360" height="420" rx="10" fill="#FAF6F0" opacity="0.92" stroke="#B89370" stroke-width="1.5" />
      <rect x="105" y="285" width="330" height="390" rx="6" fill="none" stroke="#D5BFAB" stroke-width="1" stroke-dasharray="4 4" />
      
      <text x="270" y="470" text-anchor="middle" font-family="'Times New Roman', serif" font-style="italic" font-size="18" fill="#8C6543" opacity="0.6" letter-spacing="0.1em">LABEL PRINT AREA</text>
      <text x="270" y="500" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#A88260" letter-spacing="0.2em">KRAFT BAG 250G - 500G</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(bagSvg)).png({ quality: 95 }).toFile(path.join(mockupsDir, 'blank_kraft_bag.png'));

  // 1.4 blank_acrylic_signage.png (1600 x 1100)
  const signSvg = `
  <svg width="1600" height="1100" viewBox="0 0 1600 1100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wallG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4A4540" />
        <stop offset="50%" stop-color="#36322E" />
        <stop offset="100%" stop-color="#24211D" />
      </linearGradient>
      <filter id="glassShadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="45" stdDeviation="30" flood-color="#000000" flood-opacity="0.6" />
      </filter>
      <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18" />
        <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.04" />
        <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.0" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.12" />
      </linearGradient>
      <linearGradient id="brassG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F2DFAB" />
        <stop offset="50%" stop-color="#C5A059" />
        <stop offset="100%" stop-color="#8C6E33" />
      </linearGradient>
    </defs>
    <!-- Dark Architectural Concrete Wall -->
    <rect width="1600" height="1100" fill="url(#wallG)" />

    <!-- Acrylic Signboard Floating (880 x 540) -->
    <g transform="translate(360, 280)" filter="url(#glassShadow)">
      <!-- Frosted / Smoked Glass Body -->
      <rect width="880" height="540" rx="16" fill="#1C1A18" fill-opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2" />
      <rect width="880" height="540" rx="16" fill="url(#glassReflection)" />

      <!-- 4 Brass Standoff Bolts (Ốc chân kính inox mạ đồng) -->
      <circle cx="45" cy="45" r="16" fill="url(#brassG)" filter="drop-shadow(0 4px 6px #000)" />
      <circle cx="45" cy="45" r="7" fill="#695123" />

      <circle cx="835" cy="45" r="16" fill="url(#brassG)" filter="drop-shadow(0 4px 6px #000)" />
      <circle cx="835" cy="45" r="7" fill="#695123" />

      <circle cx="45" cy="495" r="16" fill="url(#brassG)" filter="drop-shadow(0 4px 6px #000)" />
      <circle cx="45" cy="495" r="7" fill="#695123" />

      <circle cx="835" cy="495" r="16" fill="url(#brassG)" filter="drop-shadow(0 4px 6px #000)" />
      <circle cx="835" cy="495" r="7" fill="#695123" />

      <!-- Subtle Guide Center -->
      <rect x="140" y="100" width="600" height="340" rx="10" fill="none" stroke="#D4AF37" stroke-opacity="0.25" stroke-dasharray="6 6" />
      <text x="440" y="275" text-anchor="middle" font-family="'Times New Roman', serif" font-size="24" fill="#D4AF37" opacity="0.45" letter-spacing="0.16em">LUXURY ACRYLIC SIGNAGE</text>
      <text x="440" y="310" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#D4AF37" opacity="0.3" letter-spacing="0.25em">BRASS STANDOFF • INDOOR / OUTDOOR</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(signSvg)).png({ quality: 95 }).toFile(path.join(mockupsDir, 'blank_acrylic_signage.png'));

  // ==========================================
  // 2. GENERATE TEXTURES (CHẤT LIỆU NỀN)
  // ==========================================
  console.log('2. Khởi tạo textures chất liệu nền...');

  // 2.1 paper_kraft.jpg (1200 x 1200)
  const kraftSvg = `
  <svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="kraftBg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#C7A37E" />
        <stop offset="70%" stop-color="#B8936E" />
        <stop offset="100%" stop-color="#9C7752" />
      </radialGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.22 0" />
      </filter>
    </defs>
    <rect width="1200" height="1200" fill="url(#kraftBg)" />
    <rect width="1200" height="1200" filter="url(#noise)" />
  </svg>`;
  await sharp(Buffer.from(kraftSvg)).jpeg({ quality: 90 }).toFile(path.join(texturesDir, 'paper_kraft.jpg'));

  // 2.2 linen_fabric.jpg (1200 x 1200)
  const linenSvg = `
  <svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="linenBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F2EDE4" />
        <stop offset="50%" stop-color="#E8E0D2" />
        <stop offset="100%" stop-color="#DCD2C0" />
      </linearGradient>
      <filter id="linenWeave">
        <feTurbulence type="fractalNoise" baseFrequency="0.85 0.25" numOctaves="3" result="turb" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.16 0" />
      </filter>
    </defs>
    <rect width="1200" height="1200" fill="url(#linenBg)" />
    <rect width="1200" height="1200" filter="url(#linenWeave)" />
  </svg>`;
  await sharp(Buffer.from(linenSvg)).jpeg({ quality: 90 }).toFile(path.join(texturesDir, 'linen_fabric.jpg'));

  // 2.3 dark_wood.jpg (1200 x 1200)
  const woodSvg = `
  <svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woodG" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2D1F17" />
        <stop offset="30%" stop-color="#3D2B1F" />
        <stop offset="70%" stop-color="#231710" />
        <stop offset="100%" stop-color="#19110B" />
      </linearGradient>
      <filter id="woodGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="4" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.35 0" />
      </filter>
    </defs>
    <rect width="1200" height="1200" fill="url(#woodG)" />
    <rect width="1200" height="1200" filter="url(#woodGrain)" />
  </svg>`;
  await sharp(Buffer.from(woodSvg)).jpeg({ quality: 90 }).toFile(path.join(texturesDir, 'dark_wood.jpg'));

  // ==========================================
  // 3. GENERATE MOODBOARDS (CẢM HỨNG THEO NGÀNH)
  // ==========================================
  console.log('3. Khởi tạo moodboards theo ngành hàng...');

  const escapeXml = (unsafe) => {
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const createMoodboardImage = async (destPath, title, sub, colors, themeType) => {
    const c1 = colors[0];
    const c2 = colors[1];
    const c3 = colors[2] || colors[0];

    const safeTitle = escapeXml(title);
    const safeSub = escapeXml(sub);

    const svg = `
    <svg width="1000" height="800" viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
        </radialGradient>
      </defs>
      <rect width="1000" height="800" fill="url(#g)" />
      <rect width="1000" height="800" fill="url(#vignette)" />

      <!-- Minimal geometric accents -->
      <circle cx="820" cy="180" r="140" fill="#FFFFFF" fill-opacity="0.05" />
      <line x1="80" y1="700" x2="920" y2="700" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.5" />
      
      <!-- Typography tags -->
      <g transform="translate(80, 580)">
        <text x="0" y="0" font-family="'Times New Roman', serif" font-style="italic" font-size="44" font-weight="700" fill="#FFFFFF" letter-spacing="0.05em">${safeTitle}</text>
        <text x="0" y="45" font-family="sans-serif" font-size="14" font-weight="500" fill="#FFFFFF" fill-opacity="0.8" letter-spacing="0.25em">${safeSub.toUpperCase()}</text>
        <text x="0" y="80" font-family="monospace" font-size="12" fill="#D4AF37" letter-spacing="0.15em">LUMINA BRAND LAB • CURATED MOODBOARD</text>
      </g>
    </svg>`;
    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(destPath);
  };

  // 3.1 fb_coffee (4 ảnh)
  await createMoodboardImage(path.join(fbCoffeeDir, 'coffee_wood.jpg'), 'Cà Phê Mộc & Gỗ Trầm', 'Specialty Coffee • Wabi-Sabi • Rustic Warmth', ['#3D2B1F', '#24160E', '#5C4033'], 'coffee');
  await createMoodboardImage(path.join(fbCoffeeDir, 'espresso_craft.jpg'), 'Nghệ Thuật Espresso', 'Golden Crema • Artisanal Barista', ['#2B1B14', '#6F4E37', '#9E6B55'], 'coffee');
  await createMoodboardImage(path.join(fbCoffeeDir, 'ceramic_morning.jpg'), 'Gốm Thô Sáng Ban Mai', 'Organic Ceramics • Highland Mist', ['#5B7065', '#3D2B1F', '#F4EFEA'], 'coffee');
  await createMoodboardImage(path.join(fbCoffeeDir, 'highland_pine.jpg'), 'Thông Núi & Đất Đỏ', 'Arabica Terroir • Dalat Pine Bark', ['#1F2E26', '#3D2B1F', '#9E6B55'], 'coffee');

  // 3.2 fashion_minimal (4 ảnh)
  await createMoodboardImage(path.join(fashionMinimalDir, 'silk_drape.jpg'), 'Nếp Lụa Đơn Sắc', 'Quiet Luxury • Fluid Silk • Raw Linen', ['#141415', '#242426', '#3A3A3D'], 'fashion');
  await createMoodboardImage(path.join(fashionMinimalDir, 'minimal_silhouette.jpg'), 'Đường Cắt Kiến Trúc', 'Tailored Geometry • Timeless Elegance', ['#1E1E1E', '#3F3F46', '#71717A'], 'fashion');
  await createMoodboardImage(path.join(fashionMinimalDir, 'architectural_space.jpg'), 'Không Gian Tĩnh Lặng', 'Gallery Monolith • Negative Space', ['#27272A', '#52525B', '#E4E4E7'], 'fashion');
  await createMoodboardImage(path.join(fashionMinimalDir, 'neutral_palette.jpg'), 'Bảng Màu Khoáng Thạch', 'Mineral Slate • Brushed Champagne', ['#18181B', '#38322B', '#C2A676'], 'fashion');

  // 3.3 tech_modern (4 ảnh)
  await createMoodboardImage(path.join(techModernDir, 'sleek_hardware.jpg'), 'Anodized Minimalist', 'Sleek Hardware • Aluminum Craft', ['#090D16', '#1E293B', '#334155'], 'tech');
  await createMoodboardImage(path.join(techModernDir, 'abstract_glass.jpg'), 'Khúc Xạ Thủy Tinh', 'Frosted Glass Prism • Digital Optics', ['#0A192F', '#1E3A8A', '#38BDF8'], 'tech');
  await createMoodboardImage(path.join(techModernDir, 'modern_workspace.jpg'), 'Bàn Làm Việc Studio Số', 'Clean Desk • Ergonomic Workspace', ['#0B132B', '#1C2541', '#475569'], 'tech');
  await createMoodboardImage(path.join(techModernDir, 'neon_cyber.jpg'), 'Tọa Độ Dữ Liệu Tương Lai', 'Cyber Vector • Precision Data Matrix', ['#050811', '#0F172A', '#06B6D4'], 'tech');

  // ==========================================
  // 4. GENERATE PROJECT ASSETS IN public/generated/
  // ==========================================
  console.log('4. Khởi tạo kho thành phẩm dự án tại /public/generated/ ...');

  const projectsToSetup = [
    {
      id: 'LUMINA-01',
      brand: 'AURA ROASTERS',
      tagline: 'Awaken Your Pure Frequency',
      color: '#2E1E1A',
      accent: '#9C6644',
      bg: '#EDE0D4',
      client: 'Lê Tuấn Hưng',
      industry: 'F&B / Specialty Coffee',
      desc: 'Khoảng lặng thiền định giữa nhịp sống đô thị với Arabica nguyên bản.'
    },
    {
      id: 'LUMINA-02',
      brand: "L'ATELIER SILENCE",
      tagline: 'The Power of Pure Form',
      color: '#141415',
      accent: '#C2A676',
      bg: '#FAF9F6',
      client: 'Nguyễn Mai Chi',
      industry: 'Thời trang & May mặc cao cấp',
      desc: 'Tuyên ngôn của vẻ đẹp không phô trương và phom dáng kiến trúc.'
    },
    {
      id: 'LUMINA-03',
      brand: 'Gió Mộc Coffee',
      tagline: 'Chạm chất mộc, lắng tiếng gió reo',
      color: '#3D2B1F',
      accent: '#9E6B55',
      bg: '#F4EFEA',
      client: 'Trần Hoàng Nguyên',
      industry: 'F&B / Specialty Coffee & Trải nghiệm',
      desc: 'Triết lý Wabi-sabi và hồn gỗ thông Tây Nguyên trầm ấm giữa Đà Lạt.'
    }
  ];

  for (const p of projectsToSetup) {
    const pDir = path.join(generatedDir, p.id);
    if (!fs.existsSync(pDir)) {
      fs.mkdirSync(pDir, { recursive: true });
    }

    const safeBrand = escapeXml(p.brand.toUpperCase());
    const safeTagline = escapeXml(p.tagline.toUpperCase());
    const safeClient = escapeXml(p.client.toUpperCase());

    // 4.1 logo_master.svg
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <style>
      .brand-title { font-family: 'Times New Roman', serif; font-weight: 700; font-size: 30px; letter-spacing: 0.16em; fill: ${p.color}; }
      .brand-sub { font-family: sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.32em; fill: ${p.accent}; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${p.bg}" rx="28"/>
  <rect x="24" y="24" width="452" height="452" fill="none" stroke="${p.accent}" stroke-width="0.8" stroke-opacity="0.3" rx="20"/>
  <circle cx="250" cy="180" r="65" fill="none" stroke="${p.color}" stroke-width="3.5" stroke-dasharray="240 16" />
  <circle cx="250" cy="180" r="45" fill="none" stroke="${p.accent}" stroke-width="2" />
  <circle cx="250" cy="180" r="10" fill="${p.color}" />
  <text x="250" y="325" text-anchor="middle" class="brand-title">${safeBrand}</text>
  <text x="250" y="360" text-anchor="middle" class="brand-sub">${safeTagline}</text>
  <text x="250" y="420" text-anchor="middle" font-family="monospace" font-size="8" fill="${p.color}" opacity="0.6">LUMINA MASTER ASSET • 2026</text>
</svg>`;
    fs.writeFileSync(path.join(pDir, 'logo_master.svg'), logoSvg, 'utf8');

    // 4.2 logo_transparent.png
    const transparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <circle cx="250" cy="180" r="65" fill="none" stroke="${p.color}" stroke-width="3.5" stroke-dasharray="240 16" />
  <circle cx="250" cy="180" r="45" fill="none" stroke="${p.accent}" stroke-width="2" />
  <circle cx="250" cy="180" r="10" fill="${p.color}" />
  <text x="250" y="325" text-anchor="middle" font-family="'Times New Roman', serif" font-weight="700" font-size="30" letter-spacing="0.16em" fill="${p.color}">${safeBrand}</text>
  <text x="250" y="360" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="10" letter-spacing="0.32em" fill="${p.accent}">${safeTagline}</text>
</svg>`;
    await sharp(Buffer.from(transparentSvg), { density: 300 }).png().toFile(path.join(pDir, 'logo_transparent.png'));

    // 4.3 mockup_namecard.png
    const cardMockupSvg = `
    <svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E8E3DC" />
          <stop offset="100%" stop-color="#CCC2B4" />
        </linearGradient>
        <filter id="cShadow_${p.id}" x="-20%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="35" stdDeviation="30" flood-color="#140E0A" flood-opacity="0.22" />
        </filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#bg_${p.id})" />
      <g transform="translate(370, 250)" filter="url(#cShadow_${p.id})">
        <rect width="860" height="500" rx="14" fill="${p.bg}" />
        <rect x="0.5" y="0.5" width="859" height="499" rx="13.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1.5" />
        
        <!-- Logo Debossed Effect -->
        <g transform="translate(430, 220)">
          <circle cx="0" cy="-45" r="45" fill="none" stroke="${p.color}" stroke-width="3" stroke-dasharray="160 12" />
          <circle cx="0" cy="-45" r="7" fill="${p.color}" />
          <text x="0" y="45" text-anchor="middle" font-family="'Times New Roman', serif" font-weight="700" font-size="28" letter-spacing="0.16em" fill="${p.color}">${safeBrand}</text>
          <text x="0" y="80" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="10" letter-spacing="0.32em" fill="${p.accent}">${safeTagline}</text>
          <text x="0" y="140" text-anchor="middle" font-family="monospace" font-size="9" fill="${p.color}" opacity="0.5">FOUNDER: ${safeClient} • 2026 ARCHIVE</text>
        </g>
      </g>
    </svg>`;
    await sharp(Buffer.from(cardMockupSvg)).png({ quality: 95 }).toFile(path.join(pDir, 'mockup_namecard.png'));

    // 4.4 brand_guideline.pdf
    const pdfPath = path.join(pDir, 'brand_guideline.pdf');
    if (!fs.existsSync(pdfPath)) {
      // Create minimal PDF
      const doc = new PDFDocument({ size: [960, 540], margin: 40 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);
      doc.rect(0, 0, 960, 540).fill('#1A1816');
      doc.fillColor('#D4AF37').fontSize(28).text(`LUMINA BRAND GUIDELINE`, 50, 80);
      doc.fillColor('#FFFFFF').fontSize(40).text(p.brand.toUpperCase(), 50, 130);
      doc.fillColor('#DCD6CC').fontSize(16).text(p.tagline, 50, 185);
      doc.fillColor('#8C827A').fontSize(12).text(`Project ID: ${p.id} | Client: ${p.client} | Industry: ${p.industry}`, 50, 240);
      doc.text(p.desc, 50, 270, { width: 500 });
      doc.end();
      await new Promise((resolve) => stream.on('finish', resolve));
    }
  }

  // ==========================================
  // 5. METADATA: /data/libraryAssets.json
  // ==========================================
  console.log('5. Tạo file siêu dữ liệu /data/libraryAssets.json...');

  const libraryAssets = [
    // --- MOCKUPS ---
    {
      id: "mockup-01",
      type: "mockup",
      title: "Phôi Danh Thiếp Cao Cấp Góc Nghiêng",
      category: "Stationery",
      industry: ["All", "Thời trang & May mặc", "Doanh nghiệp", "F&B / Ẩm thực"],
      preview_url: "/library/mockups/blank_namecard_modern.png",
      dimensions: "1600 × 1000 px",
      file_format: "PNG (300 DPI)",
      overlay_coordinates: { x: 370, y: 250, width: 860, height: 500 }
    },
    {
      id: "mockup-02",
      type: "mockup",
      title: "Phôi Ly Sứ Cà Phê Studio Minimalist",
      category: "Packaging",
      industry: ["All", "F&B / Ẩm thực", "Phong cách sống"],
      preview_url: "/library/mockups/blank_coffee_cup_ceramic.png",
      dimensions: "1600 × 1200 px",
      file_format: "PNG (300 DPI)",
      overlay_coordinates: { x: 670, y: 550, width: 260, height: 160 }
    },
    {
      id: "mockup-03",
      type: "mockup",
      title: "Phôi Túi Giấy Kraft Thô Có Van Thở",
      category: "Packaging",
      industry: ["All", "F&B / Ẩm thực", "Nông sản sạch", "Hữu cơ"],
      preview_url: "/library/mockups/blank_kraft_bag.png",
      dimensions: "1400 × 1200 px",
      file_format: "PNG (300 DPI)",
      overlay_coordinates: { x: 520, y: 470, width: 360, height: 420 }
    },
    {
      id: "mockup-04",
      type: "mockup",
      title: "Phôi Biển Hiệu Acrylic Treo Tường Khung Đồng",
      category: "Signage",
      industry: ["All", "Thời trang & May mặc", "Công nghệ & Số hóa", "Doanh nghiệp"],
      preview_url: "/library/mockups/blank_acrylic_signage.png",
      dimensions: "1600 × 1100 px",
      file_format: "PNG (300 DPI)",
      overlay_coordinates: { x: 500, y: 380, width: 600, height: 340 }
    },

    // --- TEXTURES ---
    {
      id: "tex-01",
      type: "texture",
      title: "Chất Liệu Giấy Kraft Nâu Thô Mộc",
      category: "Texture",
      industry: ["All", "F&B / Ẩm thực", "Bao bì thân thiện"],
      preview_url: "/library/textures/paper_kraft.jpg",
      dimensions: "1200 × 1200 px",
      file_format: "JPG",
      style_tags: ["Organic", "Earthy", "Recycled", "Eco"]
    },
    {
      id: "tex-02",
      type: "texture",
      title: "Chất Liệu Vải Linen Dệt Tự Nhiên",
      category: "Texture",
      industry: ["All", "Thời trang & May mặc", "Nội thất"],
      preview_url: "/library/textures/linen_fabric.jpg",
      dimensions: "1200 × 1200 px",
      file_format: "JPG",
      style_tags: ["Quiet Luxury", "Woven", "Beige", "Minimalist"]
    },
    {
      id: "tex-03",
      type: "texture",
      title: "Chất Liệu Gỗ Sồi Trầm Tây Nguyên",
      category: "Texture",
      industry: ["All", "F&B / Ẩm thực", "Kiến trúc & Nội thất"],
      preview_url: "/library/textures/dark_wood.jpg",
      dimensions: "1200 × 1200 px",
      file_format: "JPG",
      style_tags: ["Rustic", "Wabi-sabi", "Warm Timber", "Dark Walnut"]
    },

    // --- MOODBOARDS: F&B COFFEE ---
    {
      id: "mood-01",
      type: "moodboard",
      title: "Cảm hứng Cà phê Mộc Mạc & Gỗ Trầm",
      category: "Inspiration",
      industry: ["F&B / Ẩm thực"],
      style_tags: ["Rustic", "Wabi-sabi", "Warm Wood"],
      preview_url: "/library/moodboards/fb_coffee/coffee_wood.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-02",
      type: "moodboard",
      title: "Cảm hứng Nghệ Thuật Rang Mộc Espresso",
      category: "Inspiration",
      industry: ["F&B / Ẩm thực"],
      style_tags: ["Artisanal", "Barista", "Slow Bar", "Crema"],
      preview_url: "/library/moodboards/fb_coffee/espresso_craft.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-03",
      type: "moodboard",
      title: "Cảm hứng Gốm Mộc Sáng Ban Mai",
      category: "Inspiration",
      industry: ["F&B / Ẩm thực"],
      style_tags: ["Organic", "Ceramics", "Zen", "Morning Light"],
      preview_url: "/library/moodboards/fb_coffee/ceramic_morning.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-04",
      type: "moodboard",
      title: "Cảm hứng Đồi Thông Cao Nguyên & Khí Lành",
      category: "Inspiration",
      industry: ["F&B / Ẩm thực"],
      style_tags: ["Pine Forest", "Terroir", "Dalat Mist", "Earthy"],
      preview_url: "/library/moodboards/fb_coffee/highland_pine.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },

    // --- MOODBOARDS: FASHION MINIMAL ---
    {
      id: "mood-05",
      type: "moodboard",
      title: "Cảm hứng Lụa Đơn Sắc & Tĩnh Lặng",
      category: "Inspiration",
      industry: ["Thời trang & May mặc"],
      style_tags: ["Quiet Luxury", "Monochrome", "Silk", "Drape"],
      preview_url: "/library/moodboards/fashion_minimal/silk_drape.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-06",
      type: "moodboard",
      title: "Cảm hứng Phom Dáng Cắt May Kiến Trúc",
      category: "Inspiration",
      industry: ["Thời trang & May mặc"],
      style_tags: ["Architectural", "Tailored", "Timeless", "Clean Cut"],
      preview_url: "/library/moodboards/fashion_minimal/minimal_silhouette.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-07",
      type: "moodboard",
      title: "Cảm hứng Không Gian Triển Lãm Tối Giản",
      category: "Inspiration",
      industry: ["Thời trang & May mặc"],
      style_tags: ["Negative Space", "Gallery", "Monolith", "Concrete"],
      preview_url: "/library/moodboards/fashion_minimal/architectural_space.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-08",
      type: "moodboard",
      title: "Cảm hứng Bảng Màu Khoáng Thạch Tự Nhiên",
      category: "Inspiration",
      industry: ["Thời trang & May mặc"],
      style_tags: ["Champagne", "Slate", "Mineral", "Neutral Swatch"],
      preview_url: "/library/moodboards/fashion_minimal/neutral_palette.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },

    // --- MOODBOARDS: TECH MODERN ---
    {
      id: "mood-09",
      type: "moodboard",
      title: "Cảm hứng Thiết Kế Phần Cứng Tinh Xảo",
      category: "Inspiration",
      industry: ["Công nghệ & Số hóa"],
      style_tags: ["Hardware", "Anodized Aluminum", "Chamfer", "Sleek"],
      preview_url: "/library/moodboards/tech_modern/sleek_hardware.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-010",
      type: "moodboard",
      title: "Cảm hứng Khúc Xạ Thủy Tinh Kỹ Thuật Số",
      category: "Inspiration",
      industry: ["Công nghệ & Số hóa"],
      style_tags: ["Frosted Glass", "Prism", "Optics", "Futuristic"],
      preview_url: "/library/moodboards/tech_modern/abstract_glass.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-011",
      type: "moodboard",
      title: "Cảm hứng Bàn Làm Việc Studio Công Nghệ",
      category: "Inspiration",
      industry: ["Công nghệ & Số hóa"],
      style_tags: ["Workspace", "Clean Desk", "Minimalist Tech", "Dark Theme"],
      preview_url: "/library/moodboards/tech_modern/modern_workspace.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    },
    {
      id: "mood-012",
      type: "moodboard",
      title: "Cảm hứng Tọa Độ Vector & Ma Trận Dữ Liệu",
      category: "Inspiration",
      industry: ["Công nghệ & Số hóa"],
      style_tags: ["Cyber", "Matrix", "Precision", "Cyan Glow"],
      preview_url: "/library/moodboards/tech_modern/neon_cyber.jpg",
      dimensions: "1000 × 800 px",
      file_format: "JPG"
    }
  ];

  fs.writeFileSync(path.join(dataDir, 'libraryAssets.json'), JSON.stringify(libraryAssets, null, 2), 'utf8');
  console.log(`✓ Đã lưu ${libraryAssets.length} assets vào /data/libraryAssets.json`);
  console.log('✓ HOÀN TẤT THIẾT LẬP CẤU TRÚC KHO ASSETS!');
}

main().catch(err => {
  console.error('Lỗi khởi tạo library assets:', err);
  process.exit(1);
});

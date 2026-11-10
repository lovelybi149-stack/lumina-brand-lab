const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const width = 1600;
const height = 1000;

// Card dimensions: 860 x 500, centered at (370, 250)
const cardW = 860;
const cardH = 500;
const cardX = (width - cardW) / 2; // 370
const cardY = (height - cardH) / 2; // 250

const mockupSvg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Studio Concrete / Warm Stone Surface -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EAE5DE" />
      <stop offset="45%" stop-color="#E0D9D0" />
      <stop offset="100%" stop-color="#D2C9BD" />
    </linearGradient>

    <!-- Studio Directional Spotlight from Top-Left -->
    <radialGradient id="studioLighting" cx="30%" cy="25%" r="85%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4" />
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.0" />
      <stop offset="100%" stop-color="#14110E" stop-opacity="0.18" />
    </radialGradient>

    <!-- Deep Ambient Drop Shadow for Card -->
    <filter id="ambientShadow" x="-20%" y="-20%" width="150%" height="160%">
      <feDropShadow dx="0" dy="36" stdDeviation="30" flood-color="#1E1712" flood-opacity="0.18" />
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#1E1712" flood-opacity="0.12" />
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1E1712" flood-opacity="0.22" />
    </filter>

    <!-- Card Cotton Paper Gradient -->
    <linearGradient id="cardPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF7" />
      <stop offset="65%" stop-color="#F8F4EE" />
      <stop offset="100%" stop-color="#F0E9DF" />
    </linearGradient>

    <!-- Card Top Edge Highlight (3D Bevel) -->
    <linearGradient id="topBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
    </linearGradient>

    <!-- Card Left Edge Highlight -->
    <linearGradient id="leftBevel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
    </linearGradient>

    <!-- Botanical Shadow Pattern in the Background -->
    <filter id="leafBlur">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>

  <!-- Surface Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#studioLighting)" />

  <!-- Studio Prop Shadow: Soft Botanical Palm/Pine Frond in Top Left Corner -->
  <g opacity="0.07" fill="#18130E" filter="url(#leafBlur)" transform="translate(-100, -80) scale(1.6)">
    <path d="M 120 40 Q 280 140 420 110 C 350 180 320 250 480 300 C 320 280 260 360 210 500 C 180 340 100 300 40 240 C 140 180 120 100 120 40 Z" />
    <path d="M 280 20 Q 380 90 490 70 C 440 120 410 180 540 220" stroke="#18130E" stroke-width="24" stroke-linecap="round" fill="none" />
  </g>

  <!-- Business Card Cast Shadow (Shadow Layer) -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" ry="10" fill="#E2DBD1" filter="url(#ambientShadow)" />

  <!-- Business Card Base Body (Cotton Fiber Paper) -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" ry="10" fill="url(#cardPaperGrad)" />

  <!-- Bevel Highlights (Top and Left Edges) -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="3" rx="1.5" fill="url(#topBevel)" />
  <rect x="${cardX}" y="${cardY}" width="3" height="${cardH}" rx="1.5" fill="url(#leftBevel)" />

  <!-- Bottom Edge Subtle Contact Shadow -->
  <rect x="${cardX + 2}" y="${cardY + cardH - 2}" width="${cardW - 4}" height="2" rx="1" fill="#000000" opacity="0.08" />

  <!-- Elegant Inner Emboss Border (Blind Deboss Frame) -->
  <rect x="${cardX + 32}" y="${cardY + 32}" width="${cardW - 64}" height="${cardH - 64}" rx="6" fill="none" stroke="#D3C9BD" stroke-width="0.8" stroke-opacity="0.6" stroke-dasharray="6 3" />

  <!-- Minimalist Corner Marks & Studio Notes on Blank Template -->
  <text x="${cardX + 48}" y="${cardY + cardH - 42}" font-family="system-ui, -apple-system, sans-serif" font-size="10" letter-spacing="0.22em" fill="#AFA598" font-weight="600">LUMINA BRAND LAB • BLANK TEMPLATE</text>
  <text x="${cardX + cardW - 48}" y="${cardY + cardH - 42}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="10" letter-spacing="0.22em" fill="#AFA598" font-weight="600">380 GSM ARCHIVAL COTTON</text>
</svg>
`;

const mockupsDir = path.join(process.cwd(), 'public', 'mockups');
if (!fs.existsSync(mockupsDir)) {
  fs.mkdirSync(mockupsDir, { recursive: true });
}

const outputPath = path.join(mockupsDir, 'blank_namecard.png');

sharp(Buffer.from(mockupSvg))
  .png({ quality: 100, compressionLevel: 8 })
  .toFile(outputPath)
  .then((info) => {
    console.log('✅ Generated blank_namecard.png successfully:', outputPath, info);
  })
  .catch((err) => {
    console.error('❌ Error generating blank_namecard.png:', err);
    process.exit(1);
  });

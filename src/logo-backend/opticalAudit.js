/**
 * FILE 2: src/logo-backend/opticalAudit.js
 * Automated Optical QA & 16px Favicon Legibility Auditor
 */

function hexToLuminance(hex) {
  const clean = String(hex || "#000000").replace("#", "").trim();
  const fullHex = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean.padEnd(6, "0").slice(0, 6);
  const r = parseInt(fullHex.substring(0, 2), 16) / 255;
  const g = parseInt(fullHex.substring(2, 4), 16) / 255;
  const b = parseInt(fullHex.substring(4, 6), 16) / 255;
  const [R, G, B] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrastRatio(hex1, hex2) {
  const l1 = hexToLuminance(hex1);
  const l2 = hexToLuminance(hex2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

function auditLogoSVG(svgString, palette = {}) {
  const svg = String(svgString || "");
  const hasViewBox = /viewBox=["'][^"']+["']/i.test(svg);
  const hasRasterImage = /<image\b/i.test(svg);
  const hasVectorPrimitives = /<(path|circle|rect|polygon|polyline|ellipse|g)\b/i.test(svg);
  const isPureVector = hasViewBox && !hasRasterImage && hasVectorPrimitives;

  const nodeMatches = svg.match(/<(path|circle|rect|polygon|line|polyline|ellipse)\b/gi) || [];
  const nodeCount = nodeMatches.length;
  const byteSize = typeof Buffer !== "undefined"
    ? Buffer.byteLength(svg, "utf8")
    : new Blob([svg]).size;

  const textHex = palette.text || palette.textDark || "#6B4C3B";
  const bgHex = palette.bg || palette.background || "#FFFDF7";
  const primaryHex = palette.primary || "#F97300";

  const textContrast = getContrastRatio(textHex, bgHex);
  const primaryContrast = getContrastRatio(primaryHex, bgHex);

  const favicon16pxPass =
    isPureVector &&
    nodeCount >= 1 &&
    nodeCount <= 150 &&
    byteSize < 15360 &&
    primaryContrast >= 1.8;

  let score = 100;
  if (!isPureVector) score -= 50;
  if (nodeCount > 150) score -= 20;
  if (byteSize > 15360) score -= 15;
  if (textContrast < 4.5) score -= 10;
  if (primaryContrast < 2.0) score -= 10;

  const finalScore = Math.max(0, score);
  return {
    overallScore: finalScore,
    grade: finalScore >= 90 ? "A+" : finalScore >= 80 ? "A" : finalScore >= 70 ? "B" : "C",
    contrastRatio: textContrast,
    primaryContrastRatio: primaryContrast,
    wcagLevel: textContrast >= 7 ? "AAA" : textContrast >= 4.5 ? "AA" : "AA-Large",
    isPureVector,
    hasViewBox,
    nodeCount,
    byteSize,
    favicon16pxPass,
    monochromeReady: isPureVector && nodeCount <= 150
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { hexToLuminance, getContrastRatio, auditLogoSVG };
}


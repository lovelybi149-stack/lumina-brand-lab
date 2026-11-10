/**
 * FILE 3: src/logo-backend/iconifyService.js
 * Searches 60,000+ commercial-free MIT/ISC SVG icons via Iconify API
 * with instant offline fallback to BRAND_PRESETS.builtInIcons.
 */

const { BRAND_PRESETS } = require("./presets");

function renderBuiltInIconInnerSvg(iconObj) {
  const pathTags = (iconObj.paths || []).map(
    (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  );
  const circleTags = (iconObj.circles || []).map(
    (c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="currentColor"/>`
  );
  return [...pathTags, ...circleTags].join("");
}

function getFallbackIconsByKeywords(keywords = [], limit = 6) {
  const kwList = (Array.isArray(keywords) ? keywords : [keywords])
    .map((k) => String(k || "").toLowerCase().trim())
    .filter(Boolean);

  const scored = BRAND_PRESETS.builtInIcons.map((icon) => {
    let matchScore = 0;
    for (const kw of kwList) {
      if (icon.keywords.some((ik) => ik.includes(kw) || kw.includes(ik))) {
        matchScore += 2;
      }
      if (icon.name.toLowerCase().includes(kw)) {
        matchScore += 1;
      }
    }
    return { icon, matchScore };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit).map(({ icon }) => ({
    id: icon.id,
    name: icon.name,
    source: "builtin-geometric",
    innerSvg: renderBuiltInIconInnerSvg(icon)
  }));
}

async function searchVectorIcons(queryOrKeywords = ["ai", "hexagon"], limit = 6, options = {}) {
  const keywords = Array.isArray(queryOrKeywords) ? queryOrKeywords : [queryOrKeywords];
  const fallbackList = getFallbackIconsByKeywords(keywords, limit);

  if (options.offlineOnly || typeof fetch !== "function") {
    return fallbackList;
  }

  const queryStr = keywords.slice(0, 2).join(" ").trim() || "hexagon";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || 2200);

  try {
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(queryStr)}&prefixes=lucide,tabler,ph&limit=${limit}`;
    const res = await fetch(searchUrl, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const iconNames = (data && data.icons) ? data.icons.slice(0, limit) : [];
    if (iconNames.length === 0) return fallbackList;

    const fetched = await Promise.all(
      iconNames.map(async (fullIconName) => {
        const [prefix, name] = fullIconName.split(":");
        const svgRes = await fetch(`https://api.iconify.design/${prefix}/${name}.svg?height=24`, {
          signal: controller.signal
        });
        if (!svgRes.ok) return null;
        const svgText = await svgRes.text();
        const match = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        if (!match || !match[1]) return null;
        return {
          id: fullIconName,
          name: name.replace(/-/g, " "),
          source: "iconify-api",
          innerSvg: match[1].trim()
        };
      })
    );

    clearTimeout(timer);
    const valid = fetched.filter(Boolean);
    return valid.length > 0 ? [...valid, ...fallbackList].slice(0, limit) : fallbackList;
  } catch (_err) {
    clearTimeout(timer);
    return fallbackList;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { searchVectorIcons, getFallbackIconsByKeywords, renderBuiltInIconInnerSvg };
}


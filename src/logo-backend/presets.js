/**
 * FILE 1: src/logo-backend/presets.js
 * Industry Presets, Gobita AI Official Brand Guidelines, Color Palettes,
 * Font Pairings & 12 Built-in Geometric Vector Icons (24x24 viewBox).
 */

const BRAND_PRESETS = {
  gobitaOfficial: {
    brandName: "GOBITA.AI",
    tagline: "Go Big, Take Action",
    palette: {
      primary: "#F97300",     // Cam AI (Innovation, friendliness)
      secondary: "#FAD45C",   // Vàng nhạt (Creativity, intuition)
      accentRed: "#D72638",   // Đỏ năng lượng (Attention, CTA)
      textDark: "#6B4C3B",    // Nâu đất (Trust, stability)
      background: "#FFFDF7",  // Trắng kem ấm
      darkBackground: "#18120E"
    },
    fonts: ["Montserrat", "Poppins", "Raleway"]
  },

  palettes: [
    { id: "gobita-official", name: "Gobita AI Official", primary: "#F97300", secondary: "#FAD45C", text: "#6B4C3B", bg: "#FFFDF7", darkBg: "#18120E" },
    { id: "gobita-energy", name: "Gobita Energy Red", primary: "#D72638", secondary: "#F97300", text: "#231815", bg: "#FAFAFA", darkBg: "#140D0E" },
    { id: "linear-indigo", name: "Linear Tech Indigo", primary: "#5E6AD2", secondary: "#38BDF8", text: "#0F172A", bg: "#F8FAFC", darkBg: "#090B10" },
    { id: "fintech-royal", name: "Fintech Royal Blue", primary: "#4F46E5", secondary: "#06B6D4", text: "#0A2540", bg: "#F8FAFC", darkBg: "#071324" },
    { id: "emerald-venture", name: "Emerald Growth", primary: "#059669", secondary: "#34D399", text: "#064E3B", bg: "#F6FEF9", darkBg: "#051B14" },
    { id: "sovereign-gold", name: "Atelier Luxury Gold", primary: "#C59B27", secondary: "#FAD45C", text: "#18181B", bg: "#FAF8F5", darkBg: "#0D0D0F" },
    { id: "solaris-amber", name: "Solaris Terracotta", primary: "#EA580C", secondary: "#FACC15", text: "#292524", bg: "#FFFBEB", darkBg: "#17120E" },
    { id: "oceanic-cyan", name: "Oceanic Global", primary: "#0284C7", secondary: "#2DD4BF", text: "#0C4A6E", bg: "#F5FBFF", darkBg: "#061A26" },
    { id: "cyber-magenta", name: "Cyber Creator Pulse", primary: "#DB2777", secondary: "#8B5CF6", text: "#1E1B4B", bg: "#FDF8FC", darkBg: "#11081F" },
    { id: "swiss-mono", name: "Swiss Minimalist", primary: "#171717", secondary: "#525252", text: "#111111", bg: "#FFFFFF", darkBg: "#0A0A0A" }
  ],

  fonts: [
    { id: "montserrat", name: "Montserrat", family: "'Montserrat', 'Helvetica Neue', sans-serif", weight: 800, tracking: "0.03em", taglineFont: "'Poppins', sans-serif" },
    { id: "poppins", name: "Poppins", family: "'Poppins', 'Segoe UI', sans-serif", weight: 700, tracking: "0.01em", taglineFont: "'Montserrat', sans-serif" },
    { id: "raleway", name: "Raleway", family: "'Raleway', 'Helvetica Neue', sans-serif", weight: 800, tracking: "0.05em", taglineFont: "'Montserrat', sans-serif" },
    { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif", weight: 700, tracking: "0.02em", taglineFont: "'Outfit', sans-serif" },
    { id: "syne", name: "Syne", family: "'Syne', sans-serif", weight: 800, tracking: "0.04em", taglineFont: "'Plus Jakarta Sans', sans-serif" },
    { id: "playfair", name: "Playfair Display", family: "'Playfair Display', Georgia, serif", weight: 700, tracking: "0.02em", taglineFont: "'Montserrat', sans-serif" },
    { id: "jetbrains", name: "JetBrains Mono", family: "'JetBrains Mono', monospace", weight: 700, tracking: "-0.01em", taglineFont: "'JetBrains Mono', monospace" }
  ],

  industries: {
    "ai-tech": {
      name: "AI, SaaS & Công nghệ",
      keywords: ["cpu", "brain", "network", "sparkles", "hexagon", "rocket", "code", "bot"],
      defaultPaletteIds: ["gobita-official", "linear-indigo", "oceanic-cyan"],
      defaultFonts: ["montserrat", "outfit", "jetbrains"],
      defaultContainers: ["hexagon", "squircle", "octagon", "circle"]
    },
    "finance-corp": {
      name: "Tài chính, Đầu tư & B2B",
      keywords: ["shield", "trending-up", "compass", "diamond", "crown", "globe", "landmark"],
      defaultPaletteIds: ["fintech-royal", "emerald-venture", "sovereign-gold"],
      defaultFonts: ["raleway", "montserrat", "playfair"],
      defaultContainers: ["shield", "diamond", "hexagon", "squircle"]
    },
    "education-coaching": {
      name: "Giáo dục, Đào tạo & Coaching",
      keywords: ["book-open", "lightbulb", "target", "award", "brain", "graduation-cap", "rocket"],
      defaultPaletteIds: ["gobita-official", "gobita-energy", "oceanic-cyan"],
      defaultFonts: ["poppins", "montserrat", "raleway"],
      defaultContainers: ["hexagon", "squircle", "circle", "shield"]
    },
    "commerce-retail": {
      name: "Bán lẻ, Điện máy & E-Commerce",
      keywords: ["zap", "shopping-bag", "store", "star", "layers", "home", "flame"],
      defaultPaletteIds: ["gobita-energy", "solaris-amber", "gobita-official"],
      defaultFonts: ["montserrat", "poppins", "outfit"],
      defaultContainers: ["squircle", "circle", "hexagon", "diamond"]
    },
    "food-lifestyle": {
      name: "F&B, Sinh thái & Sức khỏe",
      keywords: ["leaf", "coffee", "flame", "sun", "heart", "sparkles", "droplet"],
      defaultPaletteIds: ["emerald-venture", "solaris-amber", "gobita-official"],
      defaultFonts: ["poppins", "outfit", "playfair"],
      defaultContainers: ["circle", "squircle", "hexagon", "shield"]
    },
    "creative-media": {
      name: "Agency, Thiết kế & Sáng tạo",
      keywords: ["aperture", "feather", "sparkles", "layers", "wand", "hexagon", "compass"],
      defaultPaletteIds: ["sovereign-gold", "cyber-magenta", "swiss-mono"],
      defaultFonts: ["syne", "raleway", "montserrat"],
      defaultContainers: ["diamond", "hexagon", "circle", "none"]
    }
  },

  // 12 Built-in Pure Vector Icons (24x24 viewBox) — 100% Offline Fallback
  builtInIcons: [
    {
      id: "builtin:neural-hex",
      name: "Neural Hexagon (Gobita Core)",
      keywords: ["ai", "tech", "hexagon", "network", "cpu", "gobita", "node"],
      paths: [
        "M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z",
        "M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z",
        "M12 2V8M20.66 7L16 10.5M20.66 17L16 15.5M12 22V18M3.34 17L8 15.5M3.34 7L8 10.5"
      ],
      circles: [{ cx: 12, cy: 13, r: 1.7 }]
    },
    {
      id: "builtin:brain-intelligence",
      name: "Brain Intelligence",
      keywords: ["brain", "ai", "mind", "smart", "education", "coaching", "think"],
      paths: [
        "M9.5 3A4.5 4.5 0 0 0 5 7.5c0 .88.25 1.7.69 2.4A4.5 4.5 0 0 0 4 13.5 4.5 4.5 0 0 0 8.5 18H9v3h6v-3h.5a4.5 4.5 0 0 0 4.5-4.5c0-1.47-.7-2.77-1.79-3.6.44-.7.69-1.52.69-2.4A4.5 4.5 0 0 0 14.5 3c-1.15 0-2.2.43-3 1.14A4.48 4.48 0 0 0 9.5 3Z",
        "M12 4.2V18",
        "M8.5 9.5h2v3h-2",
        "M15.5 9.5h-2v3h2"
      ],
      circles: [{ cx: 8.5, cy: 9.5, r: 1 }, { cx: 15.5, cy: 9.5, r: 1 }]
    },
    {
      id: "builtin:rocket-action",
      name: "Rocket Take Action",
      keywords: ["rocket", "action", "startup", "growth", "speed", "launch", "gobita"],
      paths: [
        "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z",
        "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z",
        "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
        "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      ],
      circles: [{ cx: 15, cy: 9, r: 1.5 }]
    },
    {
      id: "builtin:sparkle-core",
      name: "AI Sparkle Star",
      keywords: ["sparkles", "star", "ai", "magic", "creative", "gen", "future"],
      paths: [
        "M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z",
        "M19 3L19.7 5.3L22 6L19.7 6.7L19 9L18.3 6.7L16 6L18.3 5.3L19 3Z"
      ],
      circles: []
    },
    {
      id: "builtin:shield-trust",
      name: "Executive Shield",
      keywords: ["shield", "finance", "security", "trust", "safe", "bank", "corp"],
      paths: [
        "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        "M9 12l2 2 4-4"
      ],
      circles: []
    },
    {
      id: "builtin:trending-growth",
      name: "Growth Arrow Peak",
      keywords: ["trending-up", "arrow", "growth", "finance", "sales", "gtm", "chart"],
      paths: [
        "M22 7L13.5 15.5L8.5 10.5L2 17",
        "M16 7H22V13"
      ],
      circles: []
    },
    {
      id: "builtin:bolt-energy",
      name: "Hyper Lightning Bolt",
      keywords: ["zap", "bolt", "energy", "power", "commerce", "retail", "fast"],
      paths: [
        "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      ],
      circles: []
    },
    {
      id: "builtin:book-academy",
      name: "Open Book Academy",
      keywords: ["book-open", "education", "study", "academy", "school", "learn"],
      paths: [
        "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
        "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      ],
      circles: []
    },
    {
      id: "builtin:target-mastery",
      name: "Target Bullseye",
      keywords: ["target", "goal", "focus", "kpi", "strategy", "compass"],
      paths: [
        "M22 2L12 12",
        "M16 2h6v6"
      ],
      circles: [{ cx: 12, cy: 12, r: 9 }, { cx: 12, cy: 12, r: 5 }, { cx: 12, cy: 12, r: 1.8 }]
    },
    {
      id: "builtin:leaf-organic",
      name: "Botanical Eco Leaf",
      keywords: ["leaf", "eco", "nature", "food", "organic", "health", "green"],
      paths: [
        "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
        "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
      ],
      circles: []
    },
    {
      id: "builtin:diamond-luxury",
      name: "Diamond Precision",
      keywords: ["diamond", "gem", "luxury", "crown", "value", "prestige"],
      paths: [
        "M6 3h12l4 6-10 12L2 9z",
        "M11 3L8 9l4 12 4-12-3-6",
        "M2 9h20"
      ],
      circles: []
    },
    {
      id: "builtin:layers-platform",
      name: "Isometric Platform Layers",
      keywords: ["layers", "platform", "system", "stack", "cloud", "store"],
      paths: [
        "M12 2L2 7l10 5 10-5-10-5z",
        "M2 17l10 5 10-5",
        "M2 12l10 5 10-5"
      ],
      circles: []
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { BRAND_PRESETS };
}


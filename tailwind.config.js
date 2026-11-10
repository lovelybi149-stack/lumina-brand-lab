/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          850: "#201c1a",
          950: "#0c0a09",
        },
        gold: {
          100: "#FDF7E7",
          200: "#F9EBC5",
          300: "#F4DC9A",
          400: "#E6C665",
          500: "#D4AF37",
          600: "#B38F24",
          700: "#8C6E15",
          800: "#69510C",
          900: "#4D3B07",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Be Vietnam Pro", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F4DC9A 0%, #D4AF37 50%, #B38F24 100%)",
        "dark-radial": "radial-gradient(ellipse at top, #1c1917 0%, #0c0a09 100%)",
      },
    },
  },
  plugins: [],
};

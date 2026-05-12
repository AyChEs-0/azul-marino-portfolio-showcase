/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Islamic palette — deep forest + emerald + gold + parchment
        // Primary background: deep mosque-garden green (not pure black per design principles)
        forest: {
          950: "#0a2a1a",
          900: "#0f3d2e",
          800: "#155e40",
          700: "#1a7a52",
        },
        // Accent: single emerald accent (design-taste: max 1 accent, no purple AI gradient)
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        // Gold: secondary accent for correct answers, stars, UI highlights
        gold: {
          300: "#e8c96b",
          400: "#d4af37",
          500: "#c8a84b",
        },
        // Surface: warm parchment (editorial luxury archetype from high-end skill)
        parchment: {
          50: "#fdf6e3",
          100: "#f5edce",
          200: "#e8d9a0",
        },
        // Semantic
        correct: "#16a34a",
        incorrect: "#dc2626",
        timer: "#f59e0b",
      },
      fontFamily: {
        arabic: ["Amiri_400Regular", "serif"],
        "arabic-bold": ["Amiri_700Bold", "serif"],
        sans: ["System", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

// Palette fedele al materiale FitFor (PDF consulenza): sfondo bianco,
// bande teal/salvia/malva/rosa antico in testa, testo quasi-nero,
// accento primario teal.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#1A1A1A",
        slate: "#6B6B6B",
        line: "#E4E4E4",
        moss: "#0E93A3", // accento primario: teal FitFor
        clay: "#B5495A", // stati di attenzione/eliminazione
        blush: "#AD8CA0", // tocco secondario: malva
      },
      fontFamily: {
        display: ["'Bodoni Moda'", "Georgia", "serif"],
        heading: ["'Poppins'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

// Palette ispirata a FitFor Italia (salone di parrucchieri, Latina):
// eleganza, femminilità, cura del dettaglio — avorio caldo, prugna
// profondo, bordeaux come accento, rosa antico come tono secondario.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF4EE", // avorio caldo, sfondo
        ink: "#2A1E1B", // prugna profondo, quasi nero ma caldo
        slate: "#8A776E", // testo secondario, tortora caldo
        line: "#E2D5C8", // bordi, tortora chiaro
        moss: "#7A2E3A", // accento primario: bordeaux/vinaccia
        clay: "#B5495A", // stati di attenzione/eliminazione: rosa scuro
        blush: "#D9A6A0", // tocco secondario: rosa antico
      },
      fontFamily: {
        display: ["'Bodoni Moda'", "Georgia", "serif"],
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

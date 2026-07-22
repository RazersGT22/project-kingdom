import type { Config } from "tailwindcss";

// Tech Bible Bab 1 & 7: palet warna kustom mengikuti Creative Bible (belum final).
// Nama token placeholder disiapkan agar struktur config sudah ada — nilai TODO.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // TODO: ganti dengan palet final dari Creative Bible (Bab 4.2)
        "ember-gold": "#C9A227",
        "obsidian-night": "#0B0B0F",
        "parchment-white": "#F4EDE0",
      },
      fontFamily: {
        // Font heraldik final: Cinzel (Google Fonts) — dipilih dari sesi review tipografi
        heading: ["Cinzel", "Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

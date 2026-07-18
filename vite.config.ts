import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Tech Bible Bab 1: React + Vite. Tidak ada plugin lain di luar yang dibutuhkan V1.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },

  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "home-manager",
        short_name: "home-manager",
        theme_color: "#ffffff",
        start_url: "/",
        display: "standalone",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm,data,webmanifest}"],
        maximumFileSizeToCacheInBytes: 15_000_000,
      },
    }),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});

import babel from "@rolldown/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  plugins: [
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm,data,webmanifest}"],
        maximumFileSizeToCacheInBytes: 15_000_000,
      },
    }),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({
      presets: [
        reactCompilerPreset({
          compilationMode: "annotation",
          // biome-ignore lint/suspicious/noExplicitAny: <some bug with the library>
        } as any),
      ],
    }),
  ],
});

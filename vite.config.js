import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Root directory (where index.html is located)
  build: {
    outDir: "dist", // Output directory for build files
    emptyOutDir: true, // Clean the output directory before building
    cssMinify: false, // Skip CSS minification
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
    assetsDir: "assets", // Directory for assets within outDir
  },
  server: {
    port: 4242, // Match your existing dev server port
    open: true, // Automatically open browser
  },
  preview: {
    port: 4244, // Port for preview server
  },
  publicDir: "public", // Public assets directory (if needed)
});

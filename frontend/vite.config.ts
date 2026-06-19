import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "mui-vendor": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "data-vendor": ["@tanstack/react-query", "axios", "zustand"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    watch: {
      ignored: ["**/chrome-smoke*/**", "**/dist/**"],
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
});

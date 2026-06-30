import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "UtilsFlow — Free Online Tools",
        short_name: "UtilsFlow",
        description: "141+ free online tools. No login, no signup.",
        theme_color: "#7c3aed",
        background_color: "#0a0a0f",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcuts: [
          {
            name: "Password Generator",
            url: "/tools/password-generator",
            description: "Generate secure passwords",
          },
          { name: "QR Generator", url: "/tools/qr-generator", description: "Generate QR codes" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.qrserver\.com\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "qr-api-cache", expiration: { maxAgeSeconds: 60 * 60 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-helmet-async")) {
              return "helmet";
            }
            if (id.includes("marked")) {
              return "markdown";
            }
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            }
            return "vendor-others";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});

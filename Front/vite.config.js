import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "prompt",

      manifest: {
        name: "Zesteo",
        short_name: "Zesteo",

        description:
          "Application de gestion des livraisons Zesteo",

        start_url: "/",

        display: "standalone",

        background_color: "#081222",
        theme_color: "#081222",

        icons: [
          {
            src: "/zesteo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/zesteo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
});
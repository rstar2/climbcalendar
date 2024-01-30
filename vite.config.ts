import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // for PWA - https://vite-pwa-org.netlify.app/guide/
    VitePWA({
      // with "autoUpdate" it will auto update
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "maskable-icon-512x512.png",
      ],

      // dynamic manifest generation
      // NOTE - the images are generated with the npm script `generate-pwa-assets`,
      // which uses the `pwa-assets-generator` node lib
      manifest: {
        name: "Climbing Calendar",
        short_name: "Climb Calendar",
        description: "Climbing competitions calendar",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#444466",
        background_color: "#113344",
        display: "standalone",
        // orientation: "any", "portrait"
        orientation: "natural",
        scope: "/",
        start_url: "/",
      },

    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //   },

    //   injectRegister: "script",
    //   strategies: "injectManifest",
    //   srcDir: "src",
    //   filename: "sw.ts",

      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],

  server: {
    // this will make it listen to all addresses like 0.0.0.0 not just the default "localhost"
    // https://vitejs.dev/config/server-options
    host: true
  }
});

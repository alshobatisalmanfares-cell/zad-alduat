import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    mcpPlugin(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: {
        enabled: false,
      },
      filename: "sw.js",
      manifest: false,
      outDir: "dist/client",
      includeAssets: ["*.png", "fonts/*.woff", "manifest*.json", "manifest.webmanifest"],

      workbox: {
        globDirectory: "dist/client",
        navigateFallbackDenylist: [
          /^\/~oauth/,
          /^\/api\//,
          /^\/mcp/,
          /^\/\.mcp/,
        ],

        globPatterns: [
          "**/*.{js,css,html,ico,png,jpg,jpeg,webp,avif,gif,svg,woff,woff2,json,webmanifest}",
        ],

        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: Request }) =>
              request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "zad-pages",
              networkTimeoutSeconds: 5,
            },
          },

          {
            urlPattern: ({ url, request }: { url: URL; request: Request }) =>
              url.origin === self.location.origin &&
              /^\/assets\/.*-[\w-]+\./.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "zad-assets",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },

          {
            urlPattern: ({ url, request }: { url: URL; request: Request }) =>
              url.origin === self.location.origin &&
              (request.destination === "image" || request.destination === "font"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "zad-media",
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "zad-quran-api",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 90,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
    build: {
      outDir: "dist",
    },
    appType: "spa",
  },
});

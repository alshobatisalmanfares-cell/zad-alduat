import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import surahs from "@/data/surahs.json";

const BASE_URL = "https://zad-alduat.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0", lastmod: today },
          { path: "/quran", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/hadith", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/azkar", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/khutbah", changefreq: "daily", priority: "0.9", lastmod: today },
          { path: "/favorites", changefreq: "monthly", priority: "0.3" },
        ];

        // Dynamic: one entry per surah
        for (const s of surahs as { number: number }[]) {
          entries.push({
            path: `/quran/${s.number}`,
            changefreq: "yearly",
            priority: "0.7",
            lastmod: today,
          });
        }

        // TODO(cloud): once Lovable Cloud is enabled, fetch published khutab
        // from the `khutab` table via the server publishable Supabase client
        // and push one entry per row here.

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});

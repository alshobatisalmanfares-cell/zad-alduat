import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
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

        for (const s of surahs as { number: number }[]) {
          entries.push({
            path: `/quran/${s.number}`,
            changefreq: "yearly",
            priority: "0.7",
            lastmod: today,
          });
        }

        // Live khutab from Supabase
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient(url, key, {
              auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
            });
            const { data } = await sb
              .from("khutab")
              .select("id, updated_at")
              .order("updated_at", { ascending: false });
            for (const k of (data ?? []) as { id: string; updated_at: string }[]) {
              entries.push({
                path: `/khutbah/${k.id}`,
                lastmod: k.updated_at.slice(0, 10),
                changefreq: "monthly",
                priority: "0.8",
              });
            }
          }
        } catch {}


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

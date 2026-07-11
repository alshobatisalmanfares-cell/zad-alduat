import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react";
import surahs from "@/data/surahs.json";

export const Route = createFileRoute("/quran/")({
  component: QuranIndex,
  head: () => ({
    meta: [
      { title: "المصحف الشريف — 114 سورة | زاد الدعاة" },
      { name: "description", content: "فهرس المصحف الشريف كاملاً، 114 سورة من الفاتحة إلى الناس بخط عثماني مضبوط بالتشكيل." },
    ],
  }),
});

type Surah = { number: number; nameAr: string; nameEn: string; revelation: string; ayahs: number };

function QuranIndex() {
  const [q, setQ] = useState("");
  const list = (surahs as Surah[]).filter(
    (s) => !q || s.nameAr.includes(q) || s.nameEn.toLowerCase().includes(q.toLowerCase()) || String(s.number).includes(q),
  );

  return (
    <div>
      <PageHeader title="المصحف الشريف" subtitle="114 سورة — من الفاتحة إلى الناس" />
      <div className="px-5 -mt-4 relative z-10">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن سورة..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {list.map((s) => (
          <Link
            key={s.number}
            to="/quran/$id"
            params={{ id: String(s.number) }}
            className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-card hover:border-primary transition"
          >
            <span className="relative h-11 w-11 grid place-items-center text-primary shrink-0">
              <svg viewBox="0 0 44 44" className="absolute inset-0 h-11 w-11">
                <path
                  d="M22 3l4.8 3.5 5.9-0.4 1.8 5.6 5 3.2-1.9 5.6 1.9 5.6-5 3.2-1.8 5.6-5.9-0.4L22 41l-4.8-3.5-5.9 0.4-1.8-5.6-5-3.2 1.9-5.6-1.9-5.6 5-3.2 1.8-5.6 5.9 0.4L22 3z"
                  fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5"
                />
              </svg>
              <span className="relative text-sm font-black">{s.number}</span>
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-black text-base truncate" style={{ fontFamily: "Amiri, serif" }}>سورة {s.nameAr}</h3>
                <span className="text-[10px] text-muted-foreground">{s.nameEn}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {s.revelation === "Meccan" ? "مكية" : "مدنية"}
                </span>
                <span>{s.ayahs} آية</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="h-8" />
    </div>
  );
}

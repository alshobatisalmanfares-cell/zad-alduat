import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Search, Heart, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/khutbah")({
  component: KhutbahIndex,
});

function KhutbahIndex() {
  const { khutab, categories, isFavorite } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      khutab.filter(
        (k) =>
          (!cat || k.category === cat) &&
          (!q || k.title.includes(q) || k.content.includes(q)),
      ),
    [khutab, q, cat],
  );

  const cats = ["الكل", ...categories.map((c) => c.name)];

  return (
    <div>
      <PageHeader title="خطب الجمعة" subtitle={`${khutab.length} خطبة متاحة`} />

      <div className="px-5 -mt-4 relative z-10">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الخطب..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {cats.map((c) => {
            const active = (c === "الكل" && !cat) || c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c === "الكل" ? null : c)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="px-5 mt-4 space-y-3">
        {filtered.map((k) => (
          <li key={k.id}>
            <Link
              to="/khutbah/$id"
              params={{ id: k.id }}
              className="block rounded-2xl bg-card border border-border shadow-card p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {k.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{k.date}</span>
                  </div>
                  <h3 className="font-black text-[15px] leading-snug truncate">{k.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{k.content}</p>
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  {isFavorite(k.id) && <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />}
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-10">لا توجد نتائج</li>
        )}
      </ul>
    </div>
  );
}

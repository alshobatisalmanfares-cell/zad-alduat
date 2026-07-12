import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { useStore } from "@/lib/store";
import { Heart, Search, BookOpen } from "lucide-react";
import hadithData from "@/data/hadith.json";
import { Highlight } from "@/lib/highlight";

export const Route = createFileRoute("/hadith")({
  component: HadithPage,
  head: () => ({
    meta: [
      { title: "الحديث الشريف — الصحيحين والأربعون النووية | زاد الدعاة" },
      { name: "description", content: "مجموعة كبيرة من الأحاديث الصحيحة من صحيح البخاري ومسلم والأربعين النووية، مصنّفة حسب الأبواب مع خط واضح وبحث سريع." },
    ],
  }),
});

type Hadith = { id: string; book: string; number: string; category: string; grade: string; text: string };

function HadithPage() {
  const items = hadithData as Hadith[];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("الكل");
  const { fontScale, toggleFavorite, isFavorite } = useStore();

  const categories = useMemo(() => ["الكل", ...Array.from(new Set(items.map((h) => h.category)))], [items]);

  // Search scoped strictly to hadith text/title/category/book.
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return items.filter(
      (h) =>
        (cat === "الكل" || h.category === cat) &&
        (!ql ||
          h.text.toLowerCase().includes(ql) ||
          h.book.toLowerCase().includes(ql) ||
          h.category.toLowerCase().includes(ql)),
    );
  }, [items, cat, q]);

  return (
    <div>
      <PageHeader title="الحديث الشريف" subtitle={`${items.length} حديثًا صحيحًا`} />

      <div className="px-5 -mt-4 relative z-10 space-y-3">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الأحاديث فقط..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-4 mt-4 space-y-3">
        {filtered.map((h) => {
          const fav = isFavorite(h.id);
          return (
            <article key={h.id} className="rounded-2xl bg-card border border-border shadow-card p-4">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <BookOpen className="h-3 w-3" /> <Highlight text={h.book} query={q} />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                    {h.grade}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    <Highlight text={h.category} query={q} />
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorite({ id: h.id, type: "hadith", title: `${h.book} #${h.number}`, content: h.text })}
                  aria-label="حفظ في المفضلة"
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                </button>
              </div>
              <p
                className="leading-loose text-foreground"
                style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 17}px`, direction: "rtl" }}
              >
                <Highlight text={h.text} query={q} />
              </p>
            </article>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">لا نتائج مطابقة في الأحاديث.</p>}
      </div>

      <div className="h-8" />
    </div>
  );
}

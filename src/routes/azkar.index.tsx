import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { useStore } from "@/lib/store";
import { Heart, RotateCcw, Infinity as InfIcon, BookHeart, ChevronLeft, Search } from "lucide-react";
import { Highlight } from "@/lib/highlight";

export const Route = createFileRoute("/azkar/")({
  component: AzkarPage,
});

function AzkarPage() {
  const [tab, setTab] = useState<"azkar" | "tasbih">("azkar");
  const { azkar, isFavorite, fontScale } = useStore();
  const categories = useMemo(() => Array.from(new Set(azkar.map((z) => z.category))), [azkar]);
  const [cat, setCat] = useState<string>(categories[0] ?? "");
  const [q, setQ] = useState("");

  // Search scoped strictly to azkar (title + text only).
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return azkar
      .filter((z) => z.category === cat)
      .filter((z) => !ql || z.title.toLowerCase().includes(ql) || z.text.toLowerCase().includes(ql));
  }, [azkar, cat, q]);

  return (
    <div>
      <PageHeader title="الأذكار والأدعية" subtitle={`حصن المسلم — ${azkar.length} ذكرًا ودعاء`} />

      <div className="px-5 -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-2 bg-card rounded-2xl p-1 border border-border shadow-card">
          <button
            onClick={() => setTab("azkar")}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
              tab === "azkar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <BookHeart className="h-4 w-4" /> الأذكار
          </button>
          <button
            onClick={() => setTab("tasbih")}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
              tab === "tasbih" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <InfIcon className="h-4 w-4" /> المسبحة
          </button>
        </div>
      </div>

      {tab === "azkar" ? (
        <>
          <div className="px-5 mt-3">
            <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border shadow-card">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث في الأذكار فقط..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="px-5 mt-3">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border ${
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 mt-2 flex justify-center">
            <ReaderControls />
          </div>

          <div className="px-5 mt-4 space-y-3">
            {filtered.map((z) => {
              const fav = isFavorite(z.id);
              return (
                <Link
                  key={z.id}
                  to="/azkar/$id"
                  params={{ id: z.id }}
                  className="block rounded-2xl bg-card border border-border shadow-card p-4 hover:border-[color:var(--gold)] transition"
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="font-black text-sm text-primary truncate">
                      <Highlight text={z.title} query={q} />
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                        × {z.count}
                      </span>
                      {fav && <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />}
                      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p
                    className="leading-loose text-foreground line-clamp-3"
                    style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 15}px`, direction: "rtl" }}
                  >
                    <Highlight text={z.text} query={q} />
                  </p>
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-10">لا نتائج في هذا القسم</p>
            )}
          </div>
        </>
      ) : (
        <Tasbih />
      )}

      <div className="h-6" />
    </div>
  );
}

function Tasbih() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const phrases = ["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "أستغفر الله"];
  const [phraseIdx, setPhraseIdx] = useState(0);

  const inc = () => {
    setCount((c) => {
      const n = c + 1;
      if (n >= target && navigator.vibrate) navigator.vibrate(80);
      return n;
    });
  };

  const pct = Math.min(100, (count / target) * 100);

  return (
    <div className="px-5 mt-6">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-6 shadow-soft text-center">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 -mx-2 px-2">
          {phrases.map((p, i) => (
            <button
              key={p}
              onClick={() => {
                setPhraseIdx(i);
                setCount(0);
              }}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                phraseIdx === i ? "bg-white text-primary" : "bg-white/15"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-2xl font-black mb-1" style={{ fontFamily: "Amiri, serif" }}>
          {phrases[phraseIdx]}
        </p>
        <p className="text-xs opacity-80 mb-5">اضغط الدائرة لبدء التسبيح</p>

        <button
          onClick={inc}
          className="mx-auto relative h-52 w-52 rounded-full bg-white/15 backdrop-blur-lg active:scale-95 transition-transform grid place-items-center border-4 border-white/30"
        >
          <div
            className="absolute inset-1 rounded-full border-4 border-white/60"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((pct / 100) * 2 * Math.PI)}% ${50 - 50 * Math.cos((pct / 100) * 2 * Math.PI)}%, 50% 50%)`,
            }}
          />
          <div className="text-center relative">
            <div className="text-6xl font-black tabular-nums">{count}</div>
            <div className="text-xs opacity-85 mt-1">من {target}</div>
          </div>
        </button>

        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setCount(0)}
            className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-2 text-xs font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> تصفير
          </button>
          <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1.5">
            <span className="text-xs font-bold opacity-80">الهدف:</span>
            {[33, 99, 100].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                }}
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  target === t ? "bg-white text-primary" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

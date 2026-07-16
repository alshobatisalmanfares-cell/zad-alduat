import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import {
  ChevronLeft,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  BookHeart,
  Infinity as InfIcon,
  RotateCcw,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/azkar/")({
  component: AzkarPage,
});

const CATEGORY_META: Record<string, { icon: any; gradient: string }> = {
  "أذكار الصباح": { icon: Sunrise, gradient: "from-amber-500/25 to-orange-600/10" },
  "أذكار المساء": { icon: Sunset, gradient: "from-purple-500/25 to-indigo-600/10" },
  "أذكار النوم": { icon: Moon, gradient: "from-indigo-500/25 to-slate-700/10" },
  "أذكار الاستيقاظ": { icon: Sun, gradient: "from-yellow-500/25 to-amber-600/10" },
  "أذكار الصلاة": { icon: BookOpen, gradient: "from-emerald-500/25 to-teal-600/10" },
  "أدعية مأثورة": { icon: Sparkles, gradient: "from-rose-500/25 to-pink-600/10" },
};

function AzkarPage() {
  const [tab, setTab] = useState<"azkar" | "tasbih">("azkar");
  const { azkar } = useStore();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const z of azkar) map.set(z.category, (map.get(z.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [azkar]);

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
        <div className="px-5 mt-5 space-y-3">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-[color:var(--gold)] mb-3" />
              <p className="text-sm">جاري تحميل الذكر...</p>
            </div>
          ) : (
            categories.map((c) => {
              const meta = CATEGORY_META[c.name] ?? { icon: BookHeart, gradient: "from-[color:var(--gold)]/20 to-transparent" };
              const Icon = meta.icon;
              return (
                <Link
                  key={c.name}
                  to="/azkar/read/$category"
                  params={{ category: c.name }}
                  className="flex items-center gap-4 rounded-2xl bg-card border border-border shadow-card p-4 hover:border-[color:var(--gold)] transition-colors group"
                >
                  <div className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${meta.gradient} border border-[color:var(--gold)]/30 grid place-items-center text-[color:var(--gold)]`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-foreground truncate">{c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.count} ذكرًا ودعاء</p>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-[color:var(--gold)] transition-colors" />
                </Link>
              );
            })
          )}
        </div>
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

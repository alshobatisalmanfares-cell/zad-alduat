import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowRight, ChevronLeft, ChevronRight, Share2, Heart, RotateCcw, CheckCircle2, Sparkles, List } from "lucide-react";
import { ReaderControls } from "@/components/ReaderControls";

export const Route = createFileRoute("/azkar/read/$category")({
  component: AzkarReader,
});

function AzkarReader() {
  const { category } = Route.useParams();
  const navigate = useNavigate();
  const { azkar, fontScale, toggleFavorite, isFavorite } = useStore();

  const list = useMemo(() => azkar.filter((z) => z.category === category), [azkar, category]);
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [finished, setFinished] = useState(false);

  const z = list[idx];

  const go = (n: number) => {
    if (n < 0) return;
    if (n >= list.length) {
      setFinished(true);
      return;
    }
    setIdx(n);
    setCount(0);
    setCopied(false);
  };

  const restart = () => {
    setFinished(false);
    setIdx(0);
    setCount(0);
    setCopied(false);
  };


  const share = async () => {
    if (!z) return;
    const text = `${z.title}\n\n${z.text}\n\n— من تطبيق زاد الدعاة`;
    try {
      if (navigator.share) {
        await navigator.share({ title: z.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* dismissed */
    }
  };

  if (list.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">لا توجد أذكار في هذا القسم</p>
        <Link to="/azkar" className="text-primary font-bold text-sm">
          العودة إلى الأذكار
        </Link>
      </div>
    );
  }

  const fav = z ? isFavorite(z.id) : false;
  const done = count >= (z?.count ?? 1);
  const pct = Math.min(100, (count / (z?.count ?? 1)) * 100);

  return (
    <div>
      <header className="gradient-header text-primary-foreground rounded-b-3xl px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate({ to: "/azkar" })}
            className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"
            aria-label="العودة"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => z && toggleFavorite({ id: z.id, type: "dhikr", title: z.title, content: z.text })}
            className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"
            aria-label="حفظ في المفضلة"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-rose-400 text-rose-400" : ""}`} />
          </button>
        </div>
        <h1 className="text-lg font-black">{category}</h1>
        <p className="text-xs opacity-85 mt-1">
          {idx + 1} من {list.length}
        </p>
      </header>

      <div className="px-5 -mt-4 relative z-10 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-5 mt-5">
        <article
          key={z.id}
          className="rounded-3xl p-6 border border-[color:var(--gold)]/40 bg-gradient-to-br from-[oklch(0.15_0.01_80)] to-[oklch(0.08_0.005_80)] text-[color:var(--gold)] shadow-soft animate-in fade-in slide-in-from-right-4 duration-300"
          style={{ direction: "rtl" }}
        >
          <h2 className="text-center text-sm font-black mb-4 text-[color:var(--gold)]/80">{z.title}</h2>
          <p
            className="leading-loose text-center"
            style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 20}px` }}
          >
            {z.text}
          </p>
        </article>

        {/* counter — compact */}
        <div className="mt-3 rounded-2xl px-3 py-2 border border-[color:var(--gold)]/40 bg-gradient-to-br from-[oklch(0.18_0.02_80)] to-[oklch(0.10_0.02_80)] text-[color:var(--gold)] flex items-center justify-between gap-2" dir="rtl">
          <span className="text-[10px] font-bold opacity-75 shrink-0">× {z.count}</span>

          <button
            onClick={() => !done && setCount((c) => c + 1)}
            className={`relative flex-1 h-11 rounded-2xl overflow-hidden grid place-items-center border active:scale-[0.98] transition-transform ${
              done
                ? "bg-[color:var(--gold)] text-black border-[color:var(--gold)]"
                : "bg-[color:var(--gold)]/10 border-[color:var(--gold)]/40"
            }`}
            aria-label="زيادة العدّاد"
          >
            <div
              className="absolute inset-y-0 right-0 bg-[color:var(--gold)]/25 transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
            <div className="relative flex items-center gap-1.5 leading-none">
              {done && <CheckCircle2 className="h-4 w-4" />}
              <span className="text-base font-black tabular-nums" dir="ltr">
                {count} / {z.count}
              </span>
            </div>
          </button>


          <button
            onClick={() => setCount(0)}
            className="inline-flex items-center gap-1 bg-[color:var(--gold)]/15 border border-[color:var(--gold)]/30 rounded-full px-2.5 py-1 text-[10px] font-bold shrink-0"
          >
            <RotateCcw className="h-3 w-3" /> تصفير
          </button>
        </div>
      </div>

      {/* Nav controls — strict RTL: next on the right, prev on the left */}
      <div className="px-5 mt-4">
        <div dir="rtl" className="flex items-center justify-between gap-2 rounded-2xl bg-card border border-border shadow-card p-2">
          <button
            onClick={() => go(idx + 1)}
            disabled={idx === list.length - 1}
            className="h-11 w-11 rounded-xl bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 text-[color:var(--gold)] grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="التالي"
          >
            <ChevronRight className="h-5 w-5" style={{ transform: "none" }} />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-sm font-black tabular-nums text-[color:var(--gold)]">
              {idx + 1} / {list.length}
            </span>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--gold)] text-black px-3 py-1.5 text-xs font-black"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? "تم النسخ" : "مشاركة"}
            </button>
          </div>

          <button
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            className="h-11 w-11 rounded-xl bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 text-[color:var(--gold)] grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="السابق"
          >
            <ChevronLeft className="h-5 w-5" style={{ transform: "none" }} />
          </button>

        </div>
      </div>


      <div className="h-8" />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tasbih")({
  head: () => ({
    meta: [
      { title: "المسبحة الإلكترونية — زاد الدعاة" },
      { name: "description", content: "مسبحة إلكترونية للتسبيح والذكر مع عدّاد تفاعلي وأهداف 33 و99 و100 واهتزاز عند اكتمال العدد." },
      { property: "og:title", content: "المسبحة الإلكترونية — زاد الدعاة" },
      { property: "og:description", content: "مسبحة إلكترونية للتسبيح والذكر مع عدّاد تفاعلي وأهداف 33 و99 و100." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasbihPage,
});

const STORAGE_KEY = "zad.tasbih.state";

type TasbihState = { count: number; target: number; phraseIdx: number };

function loadState(): TasbihState {
  if (typeof window === "undefined") return { count: 0, target: 33, phraseIdx: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<TasbihState>;
      return {
        count: Number(s.count) || 0,
        target: Number(s.target) || 33,
        phraseIdx: Number(s.phraseIdx) || 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { count: 0, target: 33, phraseIdx: 0 };
}

function TasbihPage() {
  // Fully offline: state lives on the device only, restored on every launch.
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const phrases = ["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "أستغفر الله"];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const s = loadState();
    setCount(s.count);
    setTarget(s.target);
    setPhraseIdx(Math.min(s.phraseIdx, phrases.length - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, target, phraseIdx }));
    } catch {
      /* ignore */
    }
  }, [count, target, phraseIdx]);

  const inc = () => {
    setCount((c) => {
      const n = c + 1;
      if (n >= target && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(80);
      return n;
    });
  };

  const pct = Math.min(100, (count / target) * 100);


  return (
    <div>
      <PageHeader title="المسبحة الإلكترونية" subtitle="سبّح واذكر الله بعدّاد تفاعلي" />

      <div className="px-5 mt-2">
        <div className="rounded-3xl bg-gradient-to-br from-[oklch(0.18_0.02_80)] via-[oklch(0.13_0.02_80)] to-[oklch(0.10_0.02_80)] border border-[color:var(--gold)]/40 text-[color:var(--gold)] p-6 shadow-soft text-center">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 -mx-2 px-2">
            {phrases.map((p, i) => (
              <button
                key={p}
                onClick={() => {
                  setPhraseIdx(i);
                  setCount(0);
                }}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  phraseIdx === i
                    ? "bg-[color:var(--gold)] text-black border-transparent"
                    : "bg-[color:var(--gold)]/10 border-[color:var(--gold)]/30"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <p className="text-2xl font-black mb-1" style={{ fontFamily: "Amiri, serif" }}>
            {phrases[phraseIdx]}
          </p>
          <p className="text-xs opacity-70 mb-5">اضغط الدائرة لبدء التسبيح</p>

          <button
            onClick={inc}
            className="mx-auto relative h-52 w-52 rounded-full bg-[color:var(--gold)]/10 backdrop-blur-lg active:scale-95 transition-transform grid place-items-center border-4 border-[color:var(--gold)]/30"
          >
            <div
              className="absolute inset-1 rounded-full border-4 border-[color:var(--gold)]/70"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((pct / 100) * 2 * Math.PI)}% ${50 - 50 * Math.cos((pct / 100) * 2 * Math.PI)}%, 50% 50%)`,
              }}
            />
            <div className="text-center relative">
              <div className="text-6xl font-black tabular-nums">{count}</div>
              <div className="text-xs opacity-75 mt-1">من {target}</div>
            </div>
          </button>

          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setCount(0)}
              className="inline-flex items-center gap-1.5 bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 rounded-full px-4 py-2 text-xs font-bold"
            >
              <RotateCcw className="h-3.5 w-3.5" /> تصفير
            </button>
            <div className="flex items-center gap-1 bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 rounded-full px-3 py-1.5">
              <span className="text-xs font-bold opacity-75">الهدف:</span>
              {[33, 99, 100].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    setCount(0);
                  }}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    target === t ? "bg-[color:var(--gold)] text-black" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

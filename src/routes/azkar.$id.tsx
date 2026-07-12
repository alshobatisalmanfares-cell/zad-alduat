import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { useStore } from "@/lib/store";
import { Heart, RotateCcw, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/azkar/$id")({
  component: DhikrDetail,
});

function DhikrDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { azkar, fontScale, toggleFavorite, isFavorite } = useStore();
  const z = azkar.find((x) => x.id === id);
  const [count, setCount] = useState(0);

  if (!z) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">الذكر غير موجود</p>
        <button onClick={() => navigate({ to: "/azkar" })} className="text-primary font-bold text-sm">
          العودة إلى الأذكار
        </button>
      </div>
    );
  }

  const fav = isFavorite(z.id);
  const done = count >= z.count;
  const pct = Math.min(100, (count / z.count) * 100);

  const tap = () => {
    if (done) return;
    setCount((c) => {
      const n = c + 1;
      if (n >= z.count && navigator.vibrate) navigator.vibrate([60, 40, 120]);
      return n;
    });
  };

  return (
    <div>
      <PageHeader
        title={z.title}
        subtitle={z.category}
        right={
          <button
            onClick={() => toggleFavorite({ id: z.id, type: "dhikr", title: z.title, content: z.text })}
            className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"
            aria-label="حفظ في المفضلة"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-rose-400 text-rose-400" : ""}`} />
          </button>
        }
      />

      <div className="px-5 -mt-4 relative z-10 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-5 mt-5">
        <article
          className="rounded-3xl bg-card border border-border shadow-card p-6 leading-loose text-foreground text-center"
          style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 20}px`, direction: "rtl" }}
        >
          {z.text}
        </article>

        <div className="mt-6 rounded-3xl p-5 border border-[color:var(--gold)]/40 bg-gradient-to-br from-[oklch(0.18_0.02_80)] to-[oklch(0.10_0.02_80)] text-[color:var(--gold)] text-center relative overflow-hidden">
          <div className="text-xs font-bold mb-3 opacity-80">التكرار المستحب: × {z.count}</div>

          <button
            onClick={tap}
            className={`mx-auto relative h-44 w-44 rounded-full grid place-items-center border-4 active:scale-95 transition-transform ${
              done
                ? "bg-[color:var(--gold)] text-black border-[color:var(--gold)]"
                : "bg-[color:var(--gold)]/10 border-[color:var(--gold)]/40"
            }`}
            aria-label="زيادة العدّاد"
          >
            <div
              className="absolute inset-1 rounded-full border-4 border-[color:var(--gold)]/70"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  50 + 50 * Math.sin((pct / 100) * 2 * Math.PI)
                }% ${50 - 50 * Math.cos((pct / 100) * 2 * Math.PI)}%, 50% 50%)`,
              }}
            />
            <div className="relative text-center">
              {done ? (
                <>
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-1" />
                  <div className="text-sm font-black">تم بحمد الله</div>
                </>
              ) : (
                <>
                  <div className="text-5xl font-black tabular-nums">{count}</div>
                  <div className="text-[11px] opacity-85 mt-1">من {z.count}</div>
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => setCount(0)}
            className="mt-5 inline-flex items-center gap-1.5 bg-[color:var(--gold)]/15 border border-[color:var(--gold)]/30 rounded-full px-4 py-2 text-xs font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> تصفير
          </button>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { Heart, Calendar, Tag, Copy, Check } from "lucide-react";


export const Route = createFileRoute("/khutbah/$id")({
  component: KhutbahDetail,
});

function KhutbahDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { khutab, toggleFavorite, isFavorite, fontScale } = useStore();
  const [copied, setCopied] = useState(false);
  const k = khutab.find((x) => x.id === id);


  if (!k) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">الخطبة غير موجودة</p>
        <button onClick={() => navigate({ to: "/khutbah" })} className="text-primary font-bold text-sm">
          العودة إلى قائمة الخطب
        </button>
      </div>
    );
  }

  const fav = isFavorite(k.id);

  return (
    <div>
      <PageHeader
        title={k.title}
        right={
          <button
            onClick={() => toggleFavorite({ id: k.id, type: "khutbah", title: k.title, content: k.content })}
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
        <article className="rounded-2xl bg-card border border-border shadow-card p-5 text-foreground">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {k.category}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {k.date}</span>
            </div>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${k.title}\n\n${k.content}`);
                  setCopied(true);
                  toast.success("تم نسخ النص بنجاح");
                  setTimeout(() => setCopied(false), 1800);
                } catch {
                  toast.error("تعذّر النسخ");
                }
              }}
              aria-label="نسخ الخطبة"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] font-bold hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] active:scale-95 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "تم النسخ" : "نسخ"}
            </button>
          </div>

          <div className="leading-loose" style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 17}px` }}>
            {k.content.split("\n").map((p, i) => (
              <p key={i} className="mb-4 last:mb-0">{p}</p>
            ))}
          </div>
        </article>
      </div>


      <div className="h-6" />
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { Button } from "@/components/ui/button";
import { copyText, shareText } from "@/lib/text-actions";
import { khutbahCategories } from "@/lib/khutbah-search.mjs";
import { Heart, Calendar, Tag, Copy, Check, Share2 } from "lucide-react";


export const Route = createFileRoute("/khutbah/$id")({
  component: KhutbahDetail,
  head: () => ({ meta: [
    { title: "قراءة خطبة الجمعة | زاد الدعاة" },
    { name: "description", content: "قراءة نص خطبة الجمعة ونسخه وحفظه في المفضلة." },
    { property: "og:title", content: "قراءة خطبة الجمعة | زاد الدعاة" },
    { property: "og:description", content: "قراءة نص خطبة الجمعة ونسخه وحفظه في المفضلة." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});

function KhutbahDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { khutab, toggleFavorite, isFavorite, fontScale, khutabLoading, hydrated } = useStore();
  const [copied, setCopied] = useState(false);
  const k = khutab.find((x) => x.id === id);


  if (!k && (!hydrated || khutabLoading)) return <p className="p-6 text-center text-muted-foreground">جاري تحميل الخطبة...</p>;
  if (!k) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">الخطبة غير موجودة</p>
        <Button variant="ghost" onClick={() => navigate({ to: "/khutbah" })} className="text-primary font-bold text-sm">
          العودة إلى قائمة الخطب
        </Button>
      </div>
    );
  }

  const fav = isFavorite(k.id);

  return (
    <div>
      <PageHeader
        title={k.title}
        right={
          <Button variant="ghost"
            onClick={() => toggleFavorite({ id: k.id, type: "khutbah", title: k.title, content: k.content })}
            className="h-9 w-9 rounded-full bg-white/15 grid place-items-center"
            aria-label="حفظ في المفضلة"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-rose-400 text-rose-400" : ""}`} />
          </Button>
        }
      />

      <div className="px-5 -mt-4 relative z-10 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-5 mt-5">
        <article className="rounded-2xl bg-card border border-border shadow-card p-5 text-foreground">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {khutbahCategories(k).join("، ")}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {k.date}</span>
            </div>
            <Button variant="ghost"
              onClick={async () => {
                try {
                  await copyText(`${k.title}\n\n${k.content}`);
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
            </Button>
            <Button variant="outline" size="icon" aria-label="مشاركة الخطبة" onClick={() => shareText(k.title, `${k.title}\n\n${k.content}`)}><Share2 /></Button>
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

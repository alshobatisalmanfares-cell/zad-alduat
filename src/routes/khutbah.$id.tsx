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
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {k.category}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {k.date}</span>
        </div>

        <article
          className="rounded-2xl bg-card border border-border shadow-card p-5 leading-loose text-foreground"
          style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 17}px` }}
        >
          {k.content.split("\n").map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">{p}</p>
          ))}
        </article>
      </div>

      <div className="h-6" />
    </div>
  );
}

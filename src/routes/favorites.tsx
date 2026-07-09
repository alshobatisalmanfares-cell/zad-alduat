import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { useStore } from "@/lib/store";
import { Heart, Trash2, BookmarkX } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, toggleFavorite, fontScale } = useStore();

  const typeLabel = (t: string) =>
    t === "khutbah" ? "خطبة" : t === "dhikr" ? "ذكر" : "نص شرعي";

  return (
    <div>
      <PageHeader title="المفضلة" subtitle={`${favorites.length} عنصر محفوظ`} />

      {favorites.length > 0 && (
        <div className="px-5 -mt-4 relative z-10 flex justify-center">
          <ReaderControls />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="px-8 py-20 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 grid place-items-center mb-4">
            <BookmarkX className="h-9 w-9 text-primary" />
          </div>
          <h3 className="font-black text-lg mb-1">لا توجد نصوص محفوظة</h3>
          <p className="text-sm text-muted-foreground">اضغط ♡ على أي محتوى لحفظه للقراءة لاحقًا حتى بدون إنترنت.</p>
        </div>
      ) : (
        <ul className="px-5 mt-5 space-y-3">
          {favorites.map((f) => (
            <li key={f.id} className="rounded-2xl bg-card border border-border shadow-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {typeLabel(f.type)}
                  </span>
                  <h3 className="font-black text-sm truncate">{f.title}</h3>
                </div>
                <button onClick={() => toggleFavorite(f)} className="text-rose-500" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p
                className="leading-loose text-foreground line-clamp-6"
                style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 15}px` }}
              >
                {f.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="h-6" />
    </div>
  );
}

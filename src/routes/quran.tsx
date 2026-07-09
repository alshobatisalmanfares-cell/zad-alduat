import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ReaderControls } from "@/components/ReaderControls";
import { useStore } from "@/lib/store";
import { Search, Heart, BookOpen, Radio } from "lucide-react";

export const Route = createFileRoute("/quran")({
  component: QuranHadith,
});

type Verse = { id: string; surah: string; ayah: number; text: string };
type HadithItem = { id: string; source: string; text: string };

const VERSES: Verse[] = [
  { id: "v1", surah: "الفاتحة", ayah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
  { id: "v2", surah: "الفاتحة", ayah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
  { id: "v3", surah: "البقرة", ayah: 255, text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ..." },
  { id: "v4", surah: "الإخلاص", ayah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ" },
  { id: "v5", surah: "الإخلاص", ayah: 2, text: "اللَّهُ الصَّمَدُ" },
  { id: "v6", surah: "العصر", ayah: 1, text: "وَالْعَصْرِ * إِنَّ الْإِنسَانَ لَفِي خُسْرٍ" },
];

const HADITHS: HadithItem[] = [
  { id: "h1", source: "متفق عليه", text: "قال رسول الله ﷺ: «إنما الأعمالُ بالنياتِ، وإنما لكل امرئٍ ما نوى»." },
  { id: "h2", source: "رواه مسلم", text: "«الدينُ النصيحةُ، قلنا: لمن؟ قال: للهِ ولكتابهِ ولرسولهِ ولأئمةِ المسلمين وعامتهم»." },
  { id: "h3", source: "رواه البخاري", text: "«من كان يؤمنُ باللهِ واليومِ الآخرِ فليقلْ خيرًا أو ليصمتْ»." },
  { id: "h4", source: "رواه الترمذي", text: "«اتقِ اللهَ حيثما كنتَ، وأتبعِ السيئةَ الحسنةَ تمحُها، وخالقِ الناسَ بخلقٍ حسنٍ»." },
];

function QuranHadith() {
  const [tab, setTab] = useState<"quran" | "hadith">("quran");
  const [q, setQ] = useState("");
  const { fontScale, toggleFavorite, isFavorite } = useStore();

  const verses = VERSES.filter((v) => !q || v.text.includes(q) || v.surah.includes(q));
  const hadiths = HADITHS.filter((h) => !q || h.text.includes(q));

  return (
    <div>
      <PageHeader title="القرآن والحديث" subtitle="اقرأ وتدبّر" />

      <div className="px-5 -mt-4 relative z-10 space-y-3">
        <div className="grid grid-cols-2 gap-2 bg-card rounded-2xl p-1 border border-border shadow-card">
          <button
            onClick={() => setTab("quran")}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
              tab === "quran" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" /> القرآن
          </button>
          <button
            onClick={() => setTab("hadith")}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
              tab === "hadith" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Radio className="h-4 w-4" /> الحديث
          </button>
        </div>

        <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tab === "quran" ? "ابحث في الآيات..." : "ابحث في الأحاديث..."}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-5 mt-4 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-5 mt-4 space-y-3">
        {tab === "quran"
          ? verses.map((v) => {
              const fav = isFavorite(v.id);
              return (
                <div key={v.id} className="rounded-2xl bg-card border border-border shadow-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {v.surah} — آية {v.ayah}
                    </span>
                    <button
                      onClick={() =>
                        toggleFavorite({ id: v.id, type: "hadith", title: `${v.surah} ${v.ayah}`, content: v.text })
                      }
                    >
                      <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <p
                    className="leading-loose text-foreground text-right"
                    style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 18}px` }}
                  >
                    {v.text}
                  </p>
                </div>
              );
            })
          : hadiths.map((h) => {
              const fav = isFavorite(h.id);
              return (
                <div key={h.id} className="rounded-2xl bg-card border border-border shadow-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {h.source}
                    </span>
                    <button
                      onClick={() =>
                        toggleFavorite({ id: h.id, type: "hadith", title: h.source, content: h.text })
                      }
                    >
                      <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <p
                    className="leading-loose"
                    style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 16}px` }}
                  >
                    {h.text}
                  </p>
                </div>
              );
            })}
      </div>

      <div className="h-6" />
    </div>
  );
}

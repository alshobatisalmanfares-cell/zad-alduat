import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ReaderControls } from "@/components/ReaderControls";
import surahs from "@/data/surahs.json";

export const Route = createFileRoute("/quran/$id")({
  component: SurahReader,
});

type Ayah = { number: number; numberInSurah: number; text: string };
type Meta = { number: number; nameAr: string; nameEn: string; revelation: string; ayahs: number };

const CACHE_PREFIX = "zad.quran.surah.";

async function fetchSurah(id: number): Promise<Ayah[]> {
  const cached = typeof window !== "undefined" ? localStorage.getItem(CACHE_PREFIX + id) : null;
  if (cached) {
    try { return JSON.parse(cached); } catch { /* ignore */ }
  }
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
  if (!res.ok) throw new Error("Failed to fetch surah");
  const json = await res.json();
  const ayahs: Ayah[] = json.data.ayahs.map((a: { number: number; numberInSurah: number; text: string }) => ({
    number: a.number, numberInSurah: a.numberInSurah, text: a.text,
  }));
  try { localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(ayahs)); } catch { /* ignore */ }
  return ayahs;
}

function SurahReader() {
  const { id } = Route.useParams();
  const surahId = Number(id);
  const meta = (surahs as Meta[]).find((s) => s.number === surahId);
  if (!meta) throw notFound();

  const { fontScale, toggleFavorite, isFavorite } = useStore();
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setAyahs(null);
    setErr(null);
    fetchSurah(surahId)
      .then((a) => { if (alive) setAyahs(a); })
      .catch(() => { if (alive) setErr("تعذر تحميل السورة. تحقق من الاتصال بالإنترنت."); });
    return () => { alive = false; };
  }, [surahId]);

  const showBasmala = surahId !== 1 && surahId !== 9;

  return (
    <div>
      <header className="gradient-header text-primary-foreground rounded-b-3xl px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-3">
          <Link to="/quran" className="h-9 w-9 rounded-full bg-white/15 grid place-items-center">
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-xs bg-white/15 rounded-full px-2.5 py-1 font-bold">
            {meta.revelation === "Meccan" ? "مكية" : "مدنية"} · {meta.ayahs} آية
          </span>
        </div>
        <h1 className="text-2xl font-black" style={{ fontFamily: "Amiri, serif" }}>سورة {meta.nameAr}</h1>
        <p className="text-xs opacity-80 mt-1">السورة {meta.number} — {meta.nameEn}</p>
      </header>

      <div className="px-5 mt-4 flex justify-center">
        <ReaderControls />
      </div>

      <div className="px-4 mt-4">
        {showBasmala && (
          <div className="text-center py-4 text-primary" style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 22}px` }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {!ayahs && !err && (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> جاري تحميل السورة...
          </div>
        )}
        {err && <p className="text-center text-destructive py-10">{err}</p>}

        {ayahs && (
          <div className="rounded-2xl bg-card border border-border shadow-card p-5">
            <p
              className="text-justify leading-[2.4] text-foreground"
              style={{ fontFamily: "Amiri, serif", fontSize: `${fontScale * 22}px`, direction: "rtl" }}
            >
              {ayahs.map((a) => {
                const favId = `q:${surahId}:${a.numberInSurah}`;
                const fav = isFavorite(favId);
                return (
                  <span key={a.number}>
                    {surahId === 1 || a.numberInSurah > 1 || !showBasmala
                      ? a.text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, "")
                      : a.text}
                    {" "}
                    <button
                      onClick={() => toggleFavorite({ id: favId, type: "hadith", title: `${meta.nameAr} ${a.numberInSurah}`, content: a.text })}
                      className="inline-flex align-middle mx-1 items-center justify-center h-8 w-8 rounded-full border border-primary/40 text-primary text-xs font-bold hover:bg-primary/10"
                      aria-label={`آية ${a.numberInSurah}`}
                    >
                      {fav ? <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> : <span className="tabular-nums">{a.numberInSurah}</span>}
                    </button>
                    {" "}
                  </span>
                );
              })}
            </p>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}

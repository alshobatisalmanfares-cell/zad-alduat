import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { Compass, Mail } from "lucide-react";
import {
  MushafIcon, MinbarIcon, MisbahaIcon, HadithIcon, HeartStarIcon,
  CrescentIcon, SunIcon,
} from "@/components/icons/IslamicIcons";
import hadithData from "@/data/hadith.json";

export const Route = createFileRoute("/")({
  component: Home,
});

type Hadith = { id: string; book: string; number: string; category: string; grade: string; text: string };

function useHadithOfDay(fallback: string) {
  return useMemo(() => {
    const items = hadithData as Hadith[];
    if (!items.length) return fallback;
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const pick = items[dayIndex % items.length];
    return pick?.text || fallback;
  }, [fallback]);
}

function Home() {
  const { hadithOfDay, nightMode, toggleNight } = useStore();
  const daily = useHadithOfDay(hadithOfDay);

  const sections = [
    { to: "/quran", label: "القرآن الكريم", Icon: MushafIcon },
    { to: "/hadith", label: "الحديث الشريف", Icon: HadithIcon },
    { to: "/azkar", label: "أذكار وأدعية", Icon: MisbahaIcon },
    { to: "/favorites", label: "المفضلة", Icon: HeartStarIcon },
    { to: "/contact", label: "تواصل معنا", Icon: Mail },
  ] as const;

  return (
    <div>
      {/* Header banner */}
      <header className="gradient-header text-primary-foreground rounded-b-[2rem] px-5 pt-10 pb-4 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[color:var(--gold)]/15 blur-2xl" />
        <div className="absolute -bottom-16 -right-8 w-52 h-52 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
        <div className="relative flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={toggleNight}
            aria-label={nightMode ? "الوضع النهاري" : "الوضع الليلي"}
            className="absolute top-0 left-0 h-9 w-9 rounded-full bg-[color:var(--gold)]/15 grid place-items-center backdrop-blur hover:bg-[color:var(--gold)]/25 transition text-[color:var(--gold)] border border-[color:var(--gold)]/30"
          >
            {nightMode ? <SunIcon className="h-4 w-4" /> : <CrescentIcon className="h-4 w-4" />}
          </button>

          <div className="h-14 w-14 rounded-2xl bg-[color:var(--gold)]/15 backdrop-blur grid place-items-center overflow-hidden border border-[color:var(--gold)]/30">
            <img src="/icon-192.png" alt="زاد الدعاة" className="h-12 w-12 rounded-xl object-cover" />
          </div>

          <h1 className="mt-2 text-2xl font-black leading-tight text-[color:var(--gold)]">زاد الدعاة</h1>
          <p className="text-[11px] leading-snug opacity-85 mt-0.5">
            منصة الخطب والموارد الدعوية الشاملة
          </p>
          <p
            className="text-[13px] leading-[1.9] text-[color:var(--gold)]/80 mt-2 px-1"
            style={{ fontFamily: '"Amiri Quran", "Amiri", serif' }}
          >
            ﴿ وَلْتَكُنْ مِنْكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ وَيَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنْكَرِ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴾
          </p>
        </div>

      </header>


      {/* Sections grid */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black">أقسام التطبيق</h2>
          <span className="text-xs text-muted-foreground">استكشف</span>
        </div>

        {/* Featured — الخطبة (main focus) */}
        <Link to="/khutbah" className="block mb-3">
          <div className="relative overflow-hidden rounded-3xl p-5 border border-[color:var(--gold)]/40 shadow-soft bg-gradient-to-br from-[oklch(0.18_0.02_80)] via-[oklch(0.14_0.02_80)] to-[oklch(0.10_0.02_80)]">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[color:var(--gold)]/15 blur-2xl" />
            <div className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <span className="h-20 w-20 rounded-3xl grid place-items-center bg-gradient-to-br from-[color:var(--gold)] to-[oklch(0.62_0.13_75)] text-black shadow-lg shrink-0">
                <MinbarIcon className="h-11 w-11" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--gold)]/80 mb-1">
                  القسم الرئيسي
                </div>
                <h3 className="text-2xl font-black leading-tight text-[color:var(--gold)]">
                  خطب الجمعة
                </h3>
                <p className="text-xs mt-1 text-[color:var(--gold)]/70">
                  خطب مكتوبة ومصنّفة، جاهزة للخطباء
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Other sections — flex-wrap so the last row (2 items) auto-centers */}
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map(({ to, label, Icon }) => (
            <Link
              key={label}
              to={to}
              className="basis-[calc(33.333%-0.5rem)] max-w-[calc(33.333%-0.5rem)]"
            >
              <div className="aspect-square rounded-2xl bg-card border border-border shadow-card flex flex-col items-center justify-center gap-2 hover:border-[color:var(--gold)] transition-all hover:-translate-y-0.5">
                <span className="h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[color:var(--gold)] to-[oklch(0.60_0.13_75)] text-black shadow-md">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="text-xs font-bold text-center px-1">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hadith of the day */}
      <section className="px-5 mt-6">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[oklch(0.16_0.02_80)] to-[oklch(0.10_0.02_80)] text-[color:var(--gold)] shadow-soft relative overflow-hidden border border-[color:var(--gold)]/30">
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[color:var(--gold)]/10" />
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[color:var(--gold)]/15 border border-[color:var(--gold)]/30 px-2.5 py-1 rounded-full">
              <HadithIcon className="h-3.5 w-3.5" /> حديث اليوم
            </span>
          </div>
          <p className="text-[15px] leading-loose font-medium" style={{ fontFamily: "Amiri, serif" }}>
            {daily}
          </p>
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

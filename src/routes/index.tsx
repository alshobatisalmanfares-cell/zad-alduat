import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Heart, ScrollText, Sparkles, Infinity as InfIcon, BookOpen, Compass, Moon, Radio, Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { hadithOfDay } = useStore();

  const quick = [
    { to: "/favorites", label: "المفضلة", icon: Heart, tint: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
    { to: "/khutbah", label: "خطب الجمعة", icon: ScrollText, tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
    { to: "/azkar", label: "الأذكار", icon: Sparkles, tint: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
    { to: "/azkar", label: "التسبيح", icon: InfIcon, tint: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300" },
  ] as const;

  const sections = [
    { to: "/quran", label: "القرآن الكريم", icon: BookOpen },
    { to: "/quran", label: "الحديث الشريف", icon: Radio },
    { to: "/khutbah", label: "خطب الجمعة", icon: ScrollText },
    { to: "/azkar", label: "أذكار وأدعية", icon: Sparkles },
    { to: "/favorites", label: "المفضلة", icon: Heart },
    { to: "/admin", label: "لوحة التحكم", icon: Settings },
  ] as const;

  return (
    <div>
      {/* Header banner */}
      <header className="gradient-header text-primary-foreground rounded-b-[2.5rem] px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -right-8 w-52 h-52 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] opacity-80 leading-none">تطبيق</div>
                <div className="font-black text-lg leading-tight">زاد الدعاة</div>
              </div>
            </div>
            <Link to="/admin" className="h-9 w-9 rounded-full bg-white/15 grid place-items-center backdrop-blur">
              <Settings className="h-4 w-4" />
            </Link>
          </div>
          <h1 className="text-2xl font-black leading-snug mb-1">زادك العلمي والدعوي</h1>
          <p className="text-sm opacity-90 flex items-center gap-1">
            <Compass className="h-4 w-4" /> في مكان واحد — بارك الله فيك
          </p>
        </div>
      </header>

      {/* Quick actions */}
      <section className="px-5 -mt-6 relative z-10">
        <div className="grid grid-cols-4 gap-3 bg-card rounded-2xl p-3 shadow-soft border border-border">
          {quick.map(({ to, label, icon: Icon, tint }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-1.5 py-1">
              <span className={`h-11 w-11 rounded-2xl grid place-items-center ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-bold text-foreground text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sections grid */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black">أقسام التطبيق</h2>
          <span className="text-xs text-muted-foreground">استكشف</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sections.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="aspect-square rounded-2xl bg-card border border-border shadow-card flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold text-center px-1">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hadith of the day */}
      <section className="px-5 mt-6">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-soft relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 px-2.5 py-1 rounded-full">
              <Radio className="h-3.5 w-3.5" /> حديث اليوم
            </span>
          </div>
          <p className="text-[15px] leading-loose font-medium" style={{ fontFamily: "Amiri, serif" }}>
            {hadithOfDay}
          </p>
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

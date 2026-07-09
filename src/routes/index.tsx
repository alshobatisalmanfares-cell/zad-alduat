import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Heart, ScrollText, Sparkles, Infinity as InfIcon, BookOpen, Compass, Moon, Radio, Shield,
} from "lucide-react";
import { AdminGateModal } from "@/components/AdminGateModal";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { hadithOfDay } = useStore();
  const [gate, setGate] = useState(false);

  const quick = [
    { to: "/favorites", label: "المفضلة", icon: Heart, gradient: "from-rose-500 to-pink-600" },
    { to: "/khutbah", label: "خطب الجمعة", icon: ScrollText, gradient: "from-emerald-600 to-teal-700" },
    { to: "/azkar", label: "الأذكار", icon: Sparkles, gradient: "from-amber-500 to-yellow-600" },
    { to: "/azkar", label: "التسبيح", icon: InfIcon, gradient: "from-teal-500 to-emerald-700" },
  ] as const;

  const sections = [
    { to: "/quran", label: "القرآن الكريم", icon: BookOpen, gradient: "from-emerald-600 to-green-700" },
    { to: "/quran", label: "الحديث الشريف", icon: Radio, gradient: "from-teal-600 to-emerald-800" },
    { to: "/khutbah", label: "خطب الجمعة", icon: ScrollText, gradient: "from-amber-500 to-orange-600" },
    { to: "/azkar", label: "أذكار وأدعية", icon: Sparkles, gradient: "from-yellow-500 to-amber-600" },
    { to: "/favorites", label: "المفضلة", icon: Heart, gradient: "from-rose-500 to-pink-600" },
    { to: "__admin__", label: "لوحة التحكم", icon: Shield, gradient: "from-slate-700 to-emerald-900" },
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
              <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur grid place-items-center overflow-hidden">
                <img src="/icon-192.png" alt="زاد الدعاة" className="h-9 w-9 rounded-xl object-cover" />
              </div>
              <div>
                <div className="text-[11px] opacity-80 leading-none">تطبيق</div>
                <div className="font-black text-lg leading-tight">زاد الدعاة</div>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-white/15 grid place-items-center backdrop-blur">
              <Moon className="h-4 w-4" />
            </div>
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
          {quick.map(({ to, label, icon: Icon, gradient }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-1.5 py-1">
              <span className={`h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br ${gradient} text-white shadow-md`}>
                <Icon className="h-6 w-6" strokeWidth={2.4} />
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
          {sections.map(({ to, label, icon: Icon, gradient }) => {
            const isAdmin = to === "__admin__";
            const Tile = (
              <div className="aspect-square rounded-2xl bg-card border border-border shadow-card flex flex-col items-center justify-center gap-2 hover:border-primary transition-all hover:-translate-y-0.5">
                <span className={`h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br ${gradient} text-white shadow-md`}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span className="text-xs font-bold text-center px-1">{label}</span>
              </div>
            );
            if (isAdmin) {
              return (
                <button key={label} type="button" onClick={() => setGate(true)} className="text-right">
                  {Tile}
                </button>
              );
            }
            return (
              <Link key={label} to={to}>
                {Tile}
              </Link>
            );
          })}
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

      <AdminGateModal open={gate} onClose={() => setGate(false)} />
    </div>
  );
}

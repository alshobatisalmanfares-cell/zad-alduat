import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import {
  ChevronLeft,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  BookHeart,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/azkar/")({
  component: AzkarPage,
});


const CATEGORY_META: Record<string, { icon: any; gradient: string }> = {
  "أذكار الصباح": { icon: Sunrise, gradient: "from-amber-500/25 to-orange-600/10" },
  "أذكار المساء": { icon: Sunset, gradient: "from-purple-500/25 to-indigo-600/10" },
  "أذكار النوم": { icon: Moon, gradient: "from-indigo-500/25 to-slate-700/10" },
  "أذكار الاستيقاظ": { icon: Sun, gradient: "from-yellow-500/25 to-amber-600/10" },
  "أذكار الصلاة": { icon: BookOpen, gradient: "from-emerald-500/25 to-teal-600/10" },
  "أدعية مأثورة": { icon: Sparkles, gradient: "from-rose-500/25 to-pink-600/10" },
};

function AzkarPage() {
  const { azkar } = useStore();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const z of azkar) map.set(z.category, (map.get(z.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [azkar]);

  return (
    <div>
      <PageHeader title="الأذكار والأدعية" subtitle={`حصن المسلم — ${azkar.length} ذكرًا ودعاء`} />

      <div className="px-5 mt-5 space-y-3">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-[color:var(--gold)] mb-3" />
            <p className="text-sm">جاري تحميل الذكر...</p>
          </div>
        ) : (
          categories.map((c) => {
            const meta = CATEGORY_META[c.name] ?? { icon: BookHeart, gradient: "from-[color:var(--gold)]/20 to-transparent" };
            const Icon = meta.icon;
            return (
              <Link
                key={c.name}
                to="/azkar/read/$category"
                params={{ category: c.name }}
                className="flex items-center gap-4 rounded-2xl bg-card border border-border shadow-card p-4 hover:border-[color:var(--gold)] transition-colors group"
              >
                <div className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${meta.gradient} border border-[color:var(--gold)]/30 grid place-items-center text-[color:var(--gold)]`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-foreground truncate">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.count} ذكرًا ودعاء</p>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-[color:var(--gold)] transition-colors" />
              </Link>
            );
          })
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}


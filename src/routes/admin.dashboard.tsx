import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { ScrollText, Sparkles, Tags, Radio, Heart } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { khutab, azkar, categories, favorites } = useStore();

  const stats = [
    { label: "الخطب", value: khutab.length, icon: ScrollText, to: "/admin/khutab" },
    { label: "الأذكار", value: azkar.length, icon: Sparkles, to: "/admin/azkar" },
    { label: "الأقسام", value: categories.length, icon: Tags, to: "/admin/categories" },
    { label: "المفضلة", value: favorites.length, icon: Heart, to: "/admin/dashboard" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl bg-card border border-border p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black tabular-nums">{s.value}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 font-bold">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-4 shadow-card">
        <h3 className="font-black text-sm mb-3">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/admin/khutab" className="rounded-xl bg-primary/10 text-primary text-xs font-bold py-2.5 text-center">
            + إضافة خطبة
          </Link>
          <Link to="/admin/azkar" className="rounded-xl bg-primary/10 text-primary text-xs font-bold py-2.5 text-center">
            + إضافة ذكر
          </Link>
          <Link to="/admin/hadith" className="rounded-xl bg-primary/10 text-primary text-xs font-bold py-2.5 text-center">
            تحديث حديث اليوم
          </Link>
          <Link to="/admin/categories" className="rounded-xl bg-primary/10 text-primary text-xs font-bold py-2.5 text-center">
            إدارة الأقسام
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-4 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-4 w-4" />
          <h3 className="font-black text-sm">تنبيه</h3>
        </div>
        <p className="text-xs opacity-90 leading-relaxed">
          البيانات محفوظة حاليًا محليًا على الجهاز. لتفعيل قاعدة بيانات حقيقية ومزامنة بين الأجهزة يمكن ربط التطبيق بـ Lovable Cloud.
        </p>
      </div>
    </div>
  );
}

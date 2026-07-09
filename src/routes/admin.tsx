import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { LogOut, Shield, ScrollText, Sparkles, Tags, Radio, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

function AdminShell() {
  const { isAdmin, loginAdmin, logoutAdmin } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isAdmin && pathname === "/admin") navigate({ to: "/admin/dashboard" });
  }, [isAdmin, pathname, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (loginAdmin(pw)) {
              setErr("");
              navigate({ to: "/admin/dashboard" });
            } else setErr("كلمة المرور غير صحيحة");
          }}
          className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-soft"
        >
          <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary text-primary-foreground grid place-items-center mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black text-center">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-5">دخول المشرفين فقط</p>

          <label className="block text-xs font-bold mb-1.5">كلمة المرور</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          {err && <p className="text-xs text-destructive mt-2">{err}</p>}
          <p className="text-[11px] text-muted-foreground mt-2">تجريبي: <b>admin123</b></p>

          <button
            type="submit"
            className="w-full mt-5 rounded-xl gradient-primary text-primary-foreground font-bold py-2.5 text-sm"
          >
            تسجيل الدخول
          </button>
          <Link to="/" className="block text-center text-xs text-muted-foreground mt-4">
            العودة إلى التطبيق
          </Link>
        </form>
      </div>
    );
  }

  const tabs = [
    { to: "/admin/dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/admin/khutab", label: "الخطب", icon: ScrollText },
    { to: "/admin/azkar", label: "الأذكار", icon: Sparkles },
    { to: "/admin/categories", label: "الأقسام", icon: Tags },
    { to: "/admin/hadith", label: "حديث اليوم", icon: Radio },
  ] as const;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="gradient-header text-primary-foreground px-5 pt-10 pb-5 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-white/15 grid place-items-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] opacity-80 leading-none">مرحبا بك</div>
              <div className="font-black">لوحة التحكم</div>
            </div>
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold"
          >
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        </div>
      </header>

      <div className="px-3 mt-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar bg-card border border-border rounded-2xl p-1.5">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}

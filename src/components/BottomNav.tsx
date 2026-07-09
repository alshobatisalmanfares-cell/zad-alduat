import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Heart, ScrollText } from "lucide-react";

const items = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/khutbah", label: "الخطب", icon: ScrollText },
  { to: "/quran", label: "القرآن", icon: BookOpen },
  { to: "/azkar", label: "الأذكار", icon: Sparkles },
  { to: "/favorites", label: "المفضلة", icon: Heart },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid place-items-center h-9 w-9 rounded-2xl transition-all ${
                    active ? "bg-primary/10 scale-105" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={active ? "font-bold" : "font-medium"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

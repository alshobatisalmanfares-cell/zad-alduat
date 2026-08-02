import { Link, useRouterState } from "@tanstack/react-router";
import { MushafIcon, MisbahaIcon, HadithIcon, MosqueIcon } from "@/components/icons/IslamicIcons";
import { BookHeart } from "lucide-react";

const items = [
  { to: "/quran", label: "المصحف", Icon: MushafIcon },
  { to: "/hadith", label: "الحديث", Icon: HadithIcon },
  { to: "/", label: "الرئيسية", Icon: MosqueIcon },
  { to: "/azkar", label: "الأذكار", Icon: BookHeart },
  { to: "/tasbih", label: "المسبحة", Icon: MisbahaIcon },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {items.map(({ to, label, Icon }) => {
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
                    active ? "bg-primary/15 scale-105" : ""
                  }`}
                >
                  <Icon className="h-6 w-6" />
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

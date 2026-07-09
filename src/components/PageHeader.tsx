import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
  back = true,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: boolean;
}) {
  return (
    <header className="gradient-header text-primary-foreground rounded-b-3xl px-5 pt-10 pb-6">
      <div className="flex items-center justify-between mb-3">
        {back ? (
          <Link to="/" className="h-9 w-9 rounded-full bg-white/15 grid place-items-center">
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
        {right}
      </div>
      <h1 className="text-xl font-black">{title}</h1>
      {subtitle && <p className="text-sm opacity-85 mt-1">{subtitle}</p>}
    </header>
  );
}

// Dummy route to keep file safe if imported as route; we use as component only
export const Route = createFileRoute("/_page-header-placeholder")({
  component: () => null,
});

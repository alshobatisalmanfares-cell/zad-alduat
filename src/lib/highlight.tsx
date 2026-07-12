import { useMemo, type ReactNode } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Highlight `query` occurrences inside `text` using a luminous gold background.
 * Case-insensitive; safe for RTL Arabic (uses substring split, not text nodes).
 */
export function Highlight({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}): ReactNode {
  const parts = useMemo(() => {
    const q = query.trim();
    if (!q) return [{ t: text, hit: false }];
    const re = new RegExp(`(${escapeRegExp(q)})`, "gi");
    return text.split(re).map((t) => ({ t, hit: re.test(t) && t.length > 0 && t.toLowerCase() === q.toLowerCase() }));
  }, [text, query]);

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded px-0.5 font-black"
            style={{
              background: "linear-gradient(90deg, oklch(0.85 0.16 85 / 0.55), oklch(0.72 0.16 80 / 0.55))",
              color: "inherit",
              boxShadow: "0 0 0 1px oklch(0.7 0.16 80 / 0.6)",
            }}
          >
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </span>
  );
}

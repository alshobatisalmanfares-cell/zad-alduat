import { useMemo, type ReactNode } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Highlight `query` occurrences inside `text` using a luminous gold background.
 * Case-insensitive; RTL-safe.
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
    const re = new RegExp(escapeRegExp(q), "gi");
    const out: { t: string; hit: boolean }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) out.push({ t: text.slice(last, m.index), hit: false });
      out.push({ t: m[0], hit: true });
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    if (last < text.length) out.push({ t: text.slice(last), hit: false });
    return out;
  }, [text, query]);

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded px-0.5 font-black"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.88 0.16 88 / 0.7), oklch(0.75 0.16 82 / 0.7))",
              color: "inherit",
              boxShadow: "0 0 0 1px oklch(0.72 0.16 82 / 0.7), 0 0 12px oklch(0.85 0.16 85 / 0.35)",
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

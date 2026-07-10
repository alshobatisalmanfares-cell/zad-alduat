import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = "w-6 h-6";

/** Open Mushaf (Quran) */
export function MushafIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M6 12c4-3 10-3 14 0v26c-4-3-10-3-14 0V12Z" fill="currentColor" opacity=".18" />
      <path d="M28 12c4-3 10-3 14 0v26c-4-3-10-3-14 0V12Z" fill="currentColor" opacity=".18" />
      <path d="M6 12c4-3 10-3 14 0v26c-4-3-10-3-14 0V12Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M28 12c4-3 10-3 14 0v26c-4-3-10-3-14 0V12Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M20 12v26M28 12v26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 20h5M32 20h5M11 26h5M32 26h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".85" />
      <path d="M24 8v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Minbar / Khutbah scroll */
export function MinbarIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M14 10c0-2 2-3 4-3h12c2 0 4 1 4 3v6h-4V11H18v5h-4v-6Z" fill="currentColor" opacity=".2" />
      <path d="M14 16h20l-2 22H16L14 16Z" fill="currentColor" opacity=".15" />
      <path d="M14 16h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 16v22M30 16v22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 40h32" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22 8h4v6h-4z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity=".2" />
      <circle cx="24" cy="6" r="1.6" fill="currentColor" />
      <path d="M20 23h8M20 28h8M20 33h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

/** Misbaha / Prayer beads */
export function MisbahaIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M10 24c0-8 6-14 14-14s14 6 14 14-6 14-14 14" stroke="currentColor" strokeWidth="2" fill="none" opacity=".7" />
      {[...Array(9)].map((_, i) => {
        const a = (Math.PI / 9) * i + Math.PI;
        const cx = 24 + Math.cos(a) * 14;
        const cy = 24 + Math.sin(a) * 14;
        return <circle key={i} cx={cx} cy={cy} r="2.4" fill="currentColor" />;
      })}
      <path d="M24 38v4M22 42h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 44l4 3 4-3-2 3h-4l-2-3Z" fill="currentColor" />
    </svg>
  );
}

/** Hadith — speech scroll with quote */
export function HadithIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M8 10h28a4 4 0 0 1 4 4v18a6 6 0 0 1-6 6H14l-6 4V10Z" fill="currentColor" opacity=".18" />
      <path d="M8 10h28a4 4 0 0 1 4 4v18a6 6 0 0 1-6 6H14l-6 4V10Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M14 18c0-2 2-3 4-3M14 22c0-2 2-3 4-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 18c0-2 2-3 4-3M22 22c0-2 2-3 4-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 28h20M14 32h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

/** Mosque dome (home) */
export function MosqueIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M24 6v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="5" r="1.6" fill="currentColor" />
      <path d="M14 22c0-6 4-10 10-10s10 4 10 10v4H14v-4Z" fill="currentColor" opacity=".2" />
      <path d="M14 22c0-6 4-10 10-10s10 4 10 10v4H14v-4Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M8 26v14M40 26v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="8" cy="24" r="1.6" fill="currentColor" />
      <circle cx="40" cy="24" r="1.6" fill="currentColor" />
      <path d="M6 40h36" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M14 40V28h20v12" stroke="currentColor" strokeWidth="2" />
      <path d="M22 40v-6a2 2 0 0 1 4 0v6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity=".2" />
    </svg>
  );
}

/** Heart (favorites) — filled crescent-heart hybrid */
export function HeartStarIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M24 40s-14-8-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 11-14 19-14 19Z" fill="currentColor" opacity=".2" />
      <path d="M24 40s-14-8-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 11-14 19-14 19Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="m24 18 1.5 3.2 3.5.5-2.5 2.4.6 3.4L24 25.9l-3.1 1.6.6-3.4-2.5-2.4 3.5-.5L24 18Z" fill="currentColor" />
    </svg>
  );
}

/** Crescent + Star */
export function CrescentIcon(props: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={base} {...props}>
      <path d="M32 24a12 12 0 1 1-10-11.8A9 9 0 0 0 32 24Z" fill="currentColor" opacity=".22" />
      <path d="M32 24a12 12 0 1 1-10-11.8A9 9 0 0 0 32 24Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="m36 12 1 2.5 2.5.5-1.8 1.8.4 2.7L36 18.2l-2.1 1.3.4-2.7-1.8-1.8 2.5-.5L36 12Z" fill="currentColor" />
    </svg>
  );
}

/** Sun (light mode) */
export function SunIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

import { useStore } from "@/lib/store";
import { Moon, Sun, Minus, Plus } from "lucide-react";

export function ReaderControls() {
  const { fontScale, setFontScale, nightMode, toggleNight } = useStore();
  return (
    <div className="flex items-center gap-2 rounded-full bg-card border border-border p-1 shadow-card">
      <button
        onClick={() => setFontScale(Math.max(0.8, +(fontScale - 0.1).toFixed(2)))}
        className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"
        aria-label="تصغير الخط"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-xs font-bold w-10 text-center tabular-nums">{Math.round(fontScale * 100)}%</span>
      <button
        onClick={() => setFontScale(Math.min(1.6, +(fontScale + 0.1).toFixed(2)))}
        className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"
        aria-label="تكبير الخط"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="w-px h-5 bg-border" />
      <button
        onClick={toggleNight}
        className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"
        aria-label="الوضع الليلي"
      >
        {nightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}

import { useOnline } from "@/hooks/use-online";
import { WifiOff } from "lucide-react";

/** Thin bar shown while the device has no connection. Content stays readable from local cache. */
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      dir="rtl"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/15 border-b border-[color:var(--gold)]/40 text-[color:var(--gold)] px-4 py-1.5 text-[11px] font-bold"
    >
      <WifiOff className="h-3.5 w-3.5" />
      أنت غير متصل بالإنترنت — يتم العرض من النسخة المحفوظة على الجهاز
    </div>
  );
}

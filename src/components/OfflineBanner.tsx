import { useOnline } from "@/hooks/use-online";
import { useEffect } from "react";
import { WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** One temporary notification per offline transition, with manual dismissal. */
export function OfflineBanner() {
  const online = useOnline();
  useEffect(() => {
    if (online) return;
    const id = toast.custom((toastId) => (
      <div dir="rtl" role="status" className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 text-foreground shadow-soft">
        <WifiOff className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-xs leading-relaxed">
          أنت غير متصل بالإنترنت — يتم العرض من النسخة المحفوظة على الجهاز
        </p>
        <Button variant="ghost" size="icon" aria-label="إغلاق تنبيه عدم الاتصال" title="إغلاق" className="shrink-0" onClick={() => toast.dismiss(toastId)}>
          <X aria-hidden="true" />
        </Button>
      </div>
    ), { duration: 8000, position: "bottom-center" });
    return () => { toast.dismiss(id); };
  }, [online]);
  return null;
}

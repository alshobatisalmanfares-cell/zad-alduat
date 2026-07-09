import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "zad.pwa.dismissed";

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already installed?
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    if (standalone) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setEvt(null);
      localStorage.setItem(DISMISS_KEY, "1");
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!evt) return;
    try {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === "accepted") localStorage.setItem(DISMISS_KEY, "1");
    } finally {
      setVisible(false);
      setEvt(null);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 inset-x-0 z-50 px-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto rounded-2xl bg-card border border-border shadow-soft p-3 flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl gradient-primary text-primary-foreground grid place-items-center shrink-0">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] leading-snug font-medium text-foreground">
            قم بتثبيت تطبيق زاد الدعاة على هاتفك لسهولة الوصول وسرعة التصفح.
          </p>
        </div>
        <button
          onClick={install}
          className="shrink-0 rounded-xl gradient-primary text-primary-foreground text-xs font-bold px-3 py-2"
        >
          تثبيت الآن
        </button>
        <button
          onClick={dismiss}
          aria-label="إغلاق"
          className="shrink-0 h-8 w-8 rounded-full bg-muted grid place-items-center text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

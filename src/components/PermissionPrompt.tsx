import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  markNotificationsAsked,
  requestNotifications,
  requestPersistentStorage,
  shouldAskNotifications,
} from "@/lib/permissions";

/** Gentle in-app explanation shown once before the native permission dialog. */
export function PermissionPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    void requestPersistentStorage();
    const t = setTimeout(() => setShow(shouldAskNotifications()), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div dir="rtl" className="fixed bottom-24 inset-x-0 z-40 mx-auto max-w-md px-4">
      <div className="rounded-2xl border border-[color:var(--gold)]/40 bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-[color:var(--gold)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">تفعيل التنبيهات</p>
            <p className="text-xs text-muted-foreground mt-1">
              نود تذكيرك بأذكار الصباح والمساء وخطبة الجمعة. يمكنك تغيير ذلك لاحقاً.
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={async () => {
              setShow(false);
              await requestNotifications();
            }}
            className="flex-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
          >
            السماح
          </button>
          <button
            onClick={() => {
              markNotificationsAsked();
              setShow(false);
            }}
            className="flex-1 rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground"
          >
            ليس الآن
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function AdminGateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { loginAdmin } = useStore();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pw)) {
      setErr(false);
      setPw("");
      onClose();
      navigate({ to: "/admin/dashboard" });
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 700);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm grid place-items-center p-5" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-card rounded-3xl p-6 shadow-soft border border-border ${err ? "animate-shake" : ""}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-11 w-11 rounded-2xl gradient-primary text-primary-foreground grid place-items-center">
            <Shield className="h-5 w-5" />
          </div>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-full bg-muted grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-lg font-black text-center">لوحة التحكم</h2>
        <p className="text-xs text-muted-foreground text-center mt-1 mb-4">أدخل كلمة المرور للمتابعة</p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••"
          className={`w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none text-center tracking-widest ${
            err ? "border-destructive" : "border-input focus:border-primary"
          }`}
        />
        {err && <p className="text-xs text-destructive mt-2 text-center">كلمة المرور غير صحيحة</p>}
        <button
          type="submit"
          className="w-full mt-4 rounded-xl gradient-primary text-primary-foreground font-bold py-2.5 text-sm"
        >
          دخول
        </button>
      </form>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}.animate-shake{animation:shake .5s}`}</style>
    </div>
  );
}

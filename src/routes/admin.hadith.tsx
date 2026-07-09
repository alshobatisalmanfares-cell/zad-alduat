import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Save, Radio } from "lucide-react";

export const Route = createFileRoute("/admin/hadith")({
  component: AdminHadith,
});

function AdminHadith() {
  const { hadithOfDay, setHadithOfDay } = useStore();
  const [text, setText] = useState(hadithOfDay);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-4 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-4 w-4" />
          <span className="font-black text-sm">حديث اليوم الحالي</span>
        </div>
        <p className="text-sm leading-loose" style={{ fontFamily: "Amiri, serif" }}>
          {hadithOfDay}
        </p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4 shadow-card">
        <label className="block text-xs font-bold mb-1.5">تحديث الحديث</label>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
          className="w-full rounded-xl border border-input bg-background p-3 text-sm leading-loose outline-none focus:border-primary resize-none"
          style={{ fontFamily: "Amiri, serif" }}
        />
        <button
          onClick={() => {
            setHadithOfDay(text.trim());
            setSaved(true);
          }}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary text-primary-foreground py-2.5 font-bold text-sm"
        >
          <Save className="h-4 w-4" /> حفظ ونشر فورًا
        </button>
        {saved && <p className="text-xs text-primary mt-2 text-center">✓ تم التحديث ويظهر الآن للمستخدمين</p>}
      </div>
    </div>
  );
}

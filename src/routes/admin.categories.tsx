import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";
import { Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
  head: () => ({ meta: [
    { title: "إدارة الأقسام | زاد الدعاة" },
    { name: "description", content: "إضافة أقسام الخطب وتعديلها وحذفها." },
    { property: "og:title", content: "إدارة الأقسام | زاد الدعاة" },
    { property: "og:description", content: "إضافة أقسام الخطب وتعديلها وحذفها." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});

function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const mutate = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try { await action(); toast.success("تم حفظ الأقسام"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "تعذّر حفظ الأقسام"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          void mutate(async () => { await addCategory(name.trim()); setName(""); });
        }}
        className="flex gap-2 bg-card border border-border rounded-2xl p-2 shadow-card"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم القسم الجديد"
          aria-label="اسم القسم الجديد"
          className="flex-1 bg-transparent px-3 text-sm outline-none"
        />
        <Button disabled={busy || !name.trim()} type="submit" className="inline-flex items-center gap-1 rounded-xl gradient-primary text-primary-foreground px-4 text-sm font-bold">
          <Plus className="h-4 w-4" /> إضافة
        </Button>
      </form>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between bg-card border border-border rounded-2xl p-3 shadow-card">
            {editing === c.id ? <input aria-label="تعديل اسم القسم" value={draft} onChange={e => setDraft(e.target.value)} className="min-w-0 flex-1 bg-background border border-input rounded-md px-2 py-1" /> : <span className="font-bold text-sm">{c.name}</span>}
            <div className="flex gap-1 shrink-0">
            {editing === c.id ? <>
              <Button size="icon" variant="ghost" aria-label="حفظ القسم" disabled={busy || !draft.trim()} onClick={() => void mutate(async () => { await updateCategory(c.id, draft.trim()); setEditing(null); })}><Save /></Button>
              <Button size="icon" variant="ghost" aria-label="إلغاء التعديل" onClick={() => setEditing(null)}><X /></Button>
            </> : <Button size="icon" variant="ghost" aria-label={`تعديل ${c.name}`} disabled={busy} onClick={() => { setEditing(c.id); setDraft(c.name); }}><Edit3 /></Button>}
            <Button size="icon" variant="ghost" disabled={busy}
              aria-label={`حذف ${c.name}`}
              onClick={() => { if (confirm("حذف هذا القسم وإزالته من الخطب المرتبطة؟")) void mutate(() => deleteCategory(c.id)); }}
              className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive grid place-items-center"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            </div>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-8">لا توجد أقسام بعد</li>
        )}
      </ul>
    </div>
  );
}

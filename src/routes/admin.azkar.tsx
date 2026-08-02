import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Dhikr } from "@/lib/store";
import { Plus, Edit3, Trash2, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/azkar")({
  component: AdminAzkar,
});

const empty: Omit<Dhikr, "id"> = { title: "", text: "", count: 1, category: "أذكار الصباح", sortOrder: 0 };

function AdminAzkar() {
  const { azkar, addDhikr, updateDhikr, deleteDhikr } = useStore();
  const [editing, setEditing] = useState<Dhikr | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Dhikr, "id">>(empty);
  const [saving, setSaving] = useState(false);

  const cats = Array.from(new Set([...azkar.map((z) => z.category), "أذكار الصباح", "أذكار المساء", "التسبيح", "أدعية متنوعة"]));

  const openCreate = () => {
    setForm(empty);
    setCreating(true);
  };
  const openEdit = (d: Dhikr) => {
    setEditing(d);
    setForm({ title: d.title, text: d.text, count: d.count, category: d.category, sortOrder: d.sortOrder ?? 0 });
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
  };
  const save = async () => {
    if (!form.title.trim() || !form.text.trim()) return;
    setSaving(true);
    try {
      if (editing) await updateDhikr(editing.id, form);
      else await addDhikr(form);
      toast.success("تم الحفظ بنجاح");
      close();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا الذكر؟")) return;
    try {
      await deleteDhikr(id);
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر الحذف");
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={openCreate}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl gradient-primary text-primary-foreground py-3 font-bold text-sm shadow-soft"
      >
        <Plus className="h-4 w-4" /> إضافة ذكر/دعاء
      </button>

      <ul className="space-y-2">
        {azkar.map((d) => (
          <li key={d.id} className="rounded-2xl bg-card border border-border p-3 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {d.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                    × {d.count}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    الترتيب: {d.sortOrder ?? 0}
                  </span>
                </div>
                <h3 className="font-black text-sm truncate">{d.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{d.text}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => openEdit(d)} className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => remove(d.id)}
                  className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive grid place-items-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-end sm:place-items-center p-3" onClick={close}>
          <div className="w-full max-w-md bg-card rounded-3xl p-5 shadow-soft max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black">{editing ? "تعديل ذكر" : "ذكر جديد"}</h2>
              <button onClick={close} className="h-8 w-8 rounded-full bg-muted grid place-items-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-bold mb-1 block">العنوان</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs font-bold mb-1 block">القسم</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                    {cats.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold mb-1 block">التكرار</span>
                  <input
                    type="number"
                    min={1}
                    value={form.count}
                    onChange={(e) => setForm({ ...form, count: Math.max(1, +e.target.value || 1) })}
                    className="input"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold mb-1 block">الترتيب</span>
                  <input
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Math.max(0, +e.target.value || 0) })}
                    className="input"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold mb-1 block">النص</span>
                <textarea
                  rows={6}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="input resize-none leading-loose"
                  style={{ fontFamily: "Amiri, serif" }}
                />
              </label>
              <button
                onClick={save}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary text-primary-foreground py-2.5 font-bold text-sm disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);border-radius:.75rem;padding:.55rem .75rem;font-size:.85rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

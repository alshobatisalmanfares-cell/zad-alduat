import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Khutbah } from "@/lib/store";
import { Plus, Edit3, Trash2, X, Save } from "lucide-react";

export const Route = createFileRoute("/admin/khutab")({
  component: AdminKhutab,
});

const empty: Omit<Khutbah, "id"> = { title: "", category: "", date: "", content: "" };

function AdminKhutab() {
  const { khutab, categories, addKhutbah, updateKhutbah, deleteKhutbah } = useStore();
  const [editing, setEditing] = useState<Khutbah | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Khutbah, "id">>(empty);

  const openCreate = () => {
    setForm({ ...empty, category: categories[0]?.name ?? "", date: new Date().toISOString().slice(0, 10) });
    setCreating(true);
  };
  const openEdit = (k: Khutbah) => {
    setEditing(k);
    setForm({ title: k.title, category: k.category, date: k.date, content: k.content });
  };
  const close = () => {
    setCreating(false);
    setEditing(null);
  };
  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      if (editing) await updateKhutbah(editing.id, form);
      else await addKhutbah(form);
      close();
    } catch (e) {
      alert("فشل الحفظ: " + (e as Error).message);
    }
  };


  return (
    <div className="space-y-3">
      <button
        onClick={openCreate}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl gradient-primary text-primary-foreground py-3 font-bold text-sm shadow-soft"
      >
        <Plus className="h-4 w-4" /> إضافة خطبة جديدة
      </button>

      <ul className="space-y-2">
        {khutab.map((k) => (
          <li key={k.id} className="rounded-2xl bg-card border border-border p-3 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {k.category || "—"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{k.date}</span>
                </div>
                <h3 className="font-black text-sm truncate">{k.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{k.content}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => openEdit(k)} className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => confirm("حذف هذه الخطبة؟") && deleteKhutbah(k.id)}
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
          <div
            className="w-full max-w-md bg-card rounded-3xl p-5 shadow-soft max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black">{editing ? "تعديل خطبة" : "خطبة جديدة"}</h2>
              <button onClick={close} className="h-8 w-8 rounded-full bg-muted grid place-items-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="العنوان">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="القسم">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                  >
                    <option value="">اختر...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="التاريخ">
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="input"
                    placeholder="1447/05/12"
                  />
                </Field>
              </div>
              <Field label="نص الخطبة">
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input resize-none leading-relaxed"
                  style={{ fontFamily: "Amiri, serif" }}
                />
              </Field>

              <button
                onClick={save}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary text-primary-foreground py-2.5 font-bold text-sm"
              >
                <Save className="h-4 w-4" /> حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);border-radius:.75rem;padding:.55rem .75rem;font-size:.85rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold mb-1 block">{label}</span>
      {children}
    </label>
  );
}

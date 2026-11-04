import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, type Khutbah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { matchesKhutbah, khutbahCategories } from "@/lib/khutbah-search.mjs";
import { Plus, Edit3, Trash2, X, Save, Loader2, Search, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/admin/khutab")({
  component: AdminKhutab,
  head: () => ({ meta: [
    { title: "إدارة الخطب | زاد الدعاة" },
    { name: "description", content: "إدارة خطب الجمعة وأقسامها ووسومها." },
    { property: "og:title", content: "إدارة الخطب | زاد الدعاة" },
    { property: "og:description", content: "إدارة خطب الجمعة وأقسامها ووسومها." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});

const empty: Omit<Khutbah, "id"> = { title: "", category: "", categories: [], tags: [], date: "", content: "" };

function AdminKhutab() {
  const { khutab, categories, addKhutbah, updateKhutbah, deleteKhutbah } = useStore();
  const [editing, setEditing] = useState<Khutbah | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Khutbah, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState("الكل");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");

  const visible = useMemo(() => {
    const list = khutab.filter(k => matchesKhutbah(k, q, filterCat === "الكل" ? null : filterCat));
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "ar");
      const cmp = (a.date || "").localeCompare(b.date || "");
      return sort === "newest" ? -cmp : cmp;
    });
  }, [khutab, q, filterCat, sort]);


  const openCreate = () => {
    setForm({ ...empty, category: "", categories: [], date: new Date().toISOString().slice(0, 10) });
    setCreating(true);
  };
  const openEdit = (k: Khutbah) => {
    setEditing(k);
    setForm({ title: k.title, category: k.category, categories: khutbahCategories(k), tags: k.tags ?? [], date: k.date, content: k.content });
  };
  const close = () => {
    setCreating(false);
    setEditing(null);
  };
  const save = async () => {
    if (!form.title.trim() || !form.content.trim() || saving) return;
    setSaving(true);
    try {
      const data = { ...form, category: form.categories?.[0] ?? "" };
      if (editing) await updateKhutbah(editing.id, data);
      else await addKhutbah(data);
      close();
    } catch (e) {
      alert("فشل الحفظ: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-3">
      <Button
        onClick={openCreate}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl gradient-primary text-primary-foreground py-3 font-bold text-sm shadow-soft"
      >
        <Plus className="h-4 w-4" /> إضافة خطبة جديدة
      </Button>

      <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في الخطب..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input flex-1"
        >
          <option value="الكل">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="input flex-1"
        >
          <option value="newest">الأحدث أولًا</option>
          <option value="oldest">الأقدم أولًا</option>
          <option value="title">حسب العنوان</option>
        </select>
        <span className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <ArrowUpDown className="h-4 w-4" />
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground">{visible.length} خطبة</p>

      <ul className="space-y-2">
        {visible.map((k) => (

          <li key={k.id} className="rounded-2xl bg-card border border-border p-3 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {khutbahCategories(k).join("، ") || "—"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{k.date}</span>
                </div>
                <h3 className="font-black text-sm truncate">{k.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{k.content}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button onClick={() => openEdit(k)} className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={async () => {
                    if (!confirm("حذف هذه الخطبة؟")) return;
                    try {
                      await deleteKhutbah(k.id);
                    } catch (e) {
                      alert("فشل الحذف: " + (e as Error).message);
                    }
                  }}
                  className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive grid place-items-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
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
              <Button onClick={close} className="h-8 w-8 rounded-full bg-muted grid place-items-center">
                <X className="h-4 w-4" />
              </Button>
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
                <fieldset className="min-w-0">
                  <legend className="text-xs font-bold mb-2">الأقسام</legend>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map(c => <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.categories?.includes(c.name) ?? false} onChange={e => setForm({ ...form, categories: e.target.checked ? [...(form.categories ?? []), c.name] : (form.categories ?? []).filter(n => n !== c.name) })} />
                      {c.name}
                    </label>)}
                  </div>
                </fieldset>
                <Field label="التاريخ">
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="input"
                    placeholder="1447/05/12"
                  />
                </Field>
              </div>
              <Field label="الوسوم">
                <input className="input" value={(form.tags ?? []).join("، ")} onChange={e => setForm({ ...form, tags: e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean) })} placeholder="تربية، إحسان" />
              </Field>
              <Field label="نص الخطبة">
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input resize-none leading-relaxed"
                  style={{ fontFamily: "Amiri, serif" }}
                />
              </Field>

              <Button
                onClick={save}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary text-primary-foreground py-2.5 font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> حفظ
                  </>
                )}
              </Button>
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

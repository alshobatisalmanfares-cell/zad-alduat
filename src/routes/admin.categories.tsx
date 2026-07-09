import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { categories, addCategory, deleteCategory } = useStore();
  const [name, setName] = useState("");

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addCategory(name.trim());
          setName("");
        }}
        className="flex gap-2 bg-card border border-border rounded-2xl p-2 shadow-card"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم القسم الجديد"
          className="flex-1 bg-transparent px-3 text-sm outline-none"
        />
        <button className="inline-flex items-center gap-1 rounded-xl gradient-primary text-primary-foreground px-4 text-sm font-bold">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between bg-card border border-border rounded-2xl p-3 shadow-card">
            <span className="font-bold text-sm">{c.name}</span>
            <button
              onClick={() => confirm("حذف هذا القسم؟") && deleteCategory(c.id)}
              className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive grid place-items-center"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-8">لا توجد أقسام بعد</li>
        )}
      </ul>
    </div>
  );
}

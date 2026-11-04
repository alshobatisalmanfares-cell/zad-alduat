import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText, shareText } from "@/lib/text-actions";

export function TextActions() {
  const [selection, setSelection] = useState("");
  useEffect(() => {
    const update = () => setSelection(window.getSelection()?.toString().trim() ?? "");
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);
  const getText = () => selection || document.querySelector("[data-share-content]")?.textContent?.trim() || "";
  return <div className="flex justify-center gap-2 px-5 py-4" aria-label="أدوات النص">
    <Button variant="outline" size="sm" title={selection ? "نسخ النص المحدد" : "نسخ نص الصفحة"} onMouseDown={e => e.preventDefault()} onClick={async () => {
      try { await copyText(getText()); toast.success("تم نسخ النص بنجاح"); }
      catch { toast.error("تعذّر النسخ، يمكنك تحديد النص ونسخه يدوياً"); }
    }}><Copy />{selection ? "نسخ المحدد" : "نسخ النص"}</Button>
    <Button variant="outline" size="sm" onMouseDown={e => e.preventDefault()} onClick={() => shareText(document.title, getText())}><Share2 />مشاركة</Button>
  </div>;
}
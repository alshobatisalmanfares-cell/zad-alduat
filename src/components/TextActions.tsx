import { memo, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText, shareText, plainText } from "@/lib/text-actions";

/** Full, exact content exposed by detail views via data-copy-text. */
function pageText() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-copy-text]");
  const exact = Array.from(nodes).map(n => plainText(n.dataset.copyText ?? "")).filter(Boolean);
  if (exact.length) return exact[exact.length - 1];
  return (document.querySelector<HTMLElement>("[data-share-content]")?.innerText ?? "").trim();
}

export const TextActions = memo(function TextActions() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [hasSelection, setHasSelection] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setHasSelection(!!window.getSelection()?.toString().trim()));
    };
    document.addEventListener("selectionchange", update);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("selectionchange", update); };
  }, []);
  if (pathname === "/" || pathname.startsWith("/admin")) return null;
  const getText = () => window.getSelection()?.toString().trim() || pageText();
  return <div className="flex justify-center gap-2 px-5 py-4" aria-label="أدوات النص">
    <Button variant="outline" size="sm" onMouseDown={e => e.preventDefault()} onClick={async () => {
      try { await copyText(getText()); toast.success("تم نسخ النص بنجاح"); }
      catch { toast.error("تعذّر النسخ، يمكنك تحديد النص ونسخه يدوياً"); }
    }}><Copy />{hasSelection ? "نسخ المحدد" : "نسخ النص"}</Button>
    <Button variant="outline" size="sm" onMouseDown={e => e.preventDefault()} onClick={() => shareText(document.title, getText())}><Share2 />مشاركة</Button>
  </div>;
});

import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

/** Converts admin-entered content (plain or rich HTML) to complete plain text, keeping line breaks. */
export function plainText(input: string) {
  if (!/<[a-z][\s\S]*>/i.test(input)) return input.trim();
  const html = input.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
}

export async function copyText(text: string) {
  if (Capacitor.isNativePlatform()) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
  } else {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.className = "clipboard-fallback";
      document.body.append(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Copy unavailable");
    }
  }
}

export async function shareText(title: string, text: string) {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title, text, dialogTitle: "مشاركة النص" });
    } else if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      await copyText(text);
      toast.success("تم نسخ النص للمشاركة");
    }
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || /cancel/i.test(error.message))) return;
    toast.error("تعذّرت المشاركة، يمكنك نسخ النص");
  }
}
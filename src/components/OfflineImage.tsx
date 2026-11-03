import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { loadOfflineImage } from "@/lib/offline-media.mjs";

// Bundled paths render immediately. Remote images use device storage even in Capacitor.
export function OfflineImage({ src = "", alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const remote = /^https?:\/\//i.test(src);
  const [saved, setSaved] = useState<{ source: string; url: string } | null>(null);
  useEffect(() => {
    if (!remote) return;
    let active = true;
    let objectUrl: string | undefined;
    loadOfflineImage(src).then((blob: Blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setSaved({ source: src, url: objectUrl });
    }).catch(() => { if (active) setSaved(null); });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, remote]);
  return <img {...props} alt={alt} src={remote ? (saved?.source === src ? saved.url : undefined) : src} />;
}
// Browser-only calls; no storage or network work happens during SSR imports.
export const MEDIA_CACHE = "zad-image-blobs-v1";
const pending = new Map();

export async function loadOfflineImage(source) {
  const url = new URL(source, window.location.origin);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported image URL");
  const key = url.href;
  if (pending.has(key)) return pending.get(key);
  const task = (async () => {
    let cache;
    try {
      cache = await caches.open(MEDIA_CACHE);
      const saved = await cache.match(key);
      if (saved?.ok) return saved.blob();
    } catch {
      // Disabled/quota-limited storage must not prevent online reading.
    }
    if (navigator.onLine === false) throw new Error("Image is not saved offline");
    const response = await fetch(key, { mode: "cors", credentials: "omit", signal: AbortSignal.timeout(15000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
      throw new Error("Invalid image response");
    }
    try { await cache?.put(key, response.clone()); } catch { /* keep showing the image */ }
    return response.blob();
  })();
  pending.set(key, task);
  try { return await task; } finally { pending.delete(key); }
}
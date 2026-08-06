// Lightweight IndexedDB wrapper used as the offline-first local database.
// Falls back to localStorage when IndexedDB is unavailable (private mode, old webviews).

const DB_NAME = "zad-offline";
const DB_VERSION = 1;
export const STORES = ["khutab", "azkar", "settings", "quran"] as const;
export type StoreName = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

function hasIDB() {
  return typeof indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

const lsKey = (store: StoreName, key: string) => `zad.idb.${store}.${key}`;

export async function idbGet<T>(store: StoreName, key: string): Promise<T | undefined> {
  if (typeof window === "undefined") return undefined;
  if (!hasIDB()) {
    try {
      const raw = localStorage.getItem(lsKey(store, key));
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  }
  try {
    const db = await openDB();
    return await new Promise<T | undefined>((resolve, reject) => {
      const req = db.transaction(store, "readonly").objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

export async function idbSet<T>(store: StoreName, key: string, value: T): Promise<void> {
  if (typeof window === "undefined") return;
  if (!hasIDB()) {
    try {
      localStorage.setItem(lsKey(store, key), JSON.stringify(value));
    } catch {
      /* quota */
    }
    return;
  }
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value as unknown as never, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* ignore write failures — cache is best effort */
  }
}

export async function clearOfflineData(): Promise<void> {
  if (!hasIDB()) {
    for (const s of STORES)
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`zad.idb.${s}.`))
        .forEach((k) => localStorage.removeItem(k));
    return;
  }
  const db = await openDB();
  await Promise.all(
    STORES.map(
      (s) =>
        new Promise<void>((resolve) => {
          const tx = db.transaction(s, "readwrite");
          tx.objectStore(s).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        }),
    ),
  );
}

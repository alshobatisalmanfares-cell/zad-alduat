// Polite, crash-safe permission helpers for web + Capacitor native.
const ASKED_KEY = "zad.perm.notifications.asked";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function shouldAskNotifications(): boolean {
  if (!notificationsSupported()) return false;
  try {
    if (localStorage.getItem(ASKED_KEY)) return false;
  } catch {
    return false;
  }
  return Notification.permission === "default";
}

export function markNotificationsAsked() {
  try {
    localStorage.setItem(ASKED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export async function requestNotifications(): Promise<boolean> {
  markNotificationsAsked();
  if (!notificationsSupported()) return false;
  try {
    const res = await Notification.requestPermission();
    return res === "granted";
  } catch {
    return false;
  }
}

/** Ask for persistent storage so the browser/WebView never evicts the offline cache. */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      const already = await navigator.storage.persisted?.();
      if (!already) await navigator.storage.persist();
    }
  } catch {
    /* ignore */
  }
}

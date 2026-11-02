// Guarded service-worker registration. Never registers in dev / Lovable preview / iframes.
const SW_URL = "/sw.js";

function isBlockedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const h = window.location.hostname.toLowerCase();
  const hostedPreviewDomain = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(h);
  const label = h.split(".")[0];
  if (hostedPreviewDomain && /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(label)) return true;
  if (hostedPreviewDomain && /^project--.+-dev$/.test(label)) return true;
  if (h === "lovableproject.com" || h.endsWith(".lovableproject.com")) return true;
  if (h === "lovableproject-dev.com" || h.endsWith(".lovableproject-dev.com")) return true;
  if (h === "beta.lovable.dev" || h.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppSW() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    regs
      .filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith(SW_URL))
      .map((r) => r.unregister()),
  );
}

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (isBlockedContext()) {
    void unregisterAppSW();
    return;
  }
  const register = () => {
    void navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {});
  };
  // React may hydrate after load has already fired. Don't miss registration.
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}

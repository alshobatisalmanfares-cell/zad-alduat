import { useEffect, useState } from "react";

type NetworkPlugin = {
  getStatus: () => Promise<{ connected: boolean }>;
  addListener: (
    event: "networkStatusChange",
    cb: (status: { connected: boolean }) => void,
  ) => Promise<{ remove: () => void }> | { remove: () => void };
};

function capacitorNetwork(): NetworkPlugin | undefined {
  const cap = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, unknown> } })
    .Capacitor;
  if (!cap?.isNativePlatform?.()) return undefined;
  return cap.Plugins?.["Network"] as NetworkPlugin | undefined;
}

/** Tracks connectivity in the browser and inside the Capacitor Android app. */
export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine !== false);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    let remove: (() => void) | undefined;
    const net = capacitorNetwork();
    if (net) {
      void net.getStatus().then((s) => setOnline(s.connected));
      void Promise.resolve(net.addListener("networkStatusChange", (s) => setOnline(s.connected))).then((h) => {
        remove = () => h.remove();
      });
    }

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      remove?.();
    };
  }, []);

  return online;
}

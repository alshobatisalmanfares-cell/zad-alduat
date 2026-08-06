import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  // Static web assets produced by `bun run build` (Nitro copies the client bundle here).
  // Real bundled assets — no remote WebView wrapper, the app works with no network.
  webDir: ".output/public",
  android: {
    allowMixedContent: false,
    backgroundColor: "#0B0B0B",
  },
  plugins: {
    SplashScreen: {
      backgroundColor: "#0B0B0B",
      showSpinner: false,
    },
  },
};

export default config;

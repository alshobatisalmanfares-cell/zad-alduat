import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  webDir: "dist/client",
  server: {
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#0B0B0B",
    captureInput: true,
  },
};

export default config;

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  webDir: "dist",

  server: {
    androidScheme: "https",
    allowNavigation: [
      "zad-alduat.lovable.app",
      "*.lovable.app"
    ]
  },

  android: {
    backgroundColor: "#0B0B0B"
  }
};

export default config;

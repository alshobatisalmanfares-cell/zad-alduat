import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  webDir: ".output/public",

  server: {
    androidScheme: "https"
  },

  android: {
    backgroundColor: "#0B0B0B"
  }
};

export default config;

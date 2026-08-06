import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  webDir: "dist",

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

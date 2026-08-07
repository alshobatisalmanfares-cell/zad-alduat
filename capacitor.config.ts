import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.zadalduat",
  appName: "زاد الدعاة",
  webDir: ".output/public", // يجعل التطبيق يقرأ الملفات المحملة داخل APK مباشرة

  server: {
    androidScheme: "https",
    allowNavigation: [
      "zad-alduat.lovable.app",
      "*.lovable.app"
    ]
  },

  android: {
    backgroundColor: "#0B0B0B" // يمنع البياض المؤقت ويزيد سرعة الإقلاع
  }
};

export default config;

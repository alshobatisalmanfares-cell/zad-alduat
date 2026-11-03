// Native build tooling only. Never imported by SSR or the browser.
import sharp from "sharp";
import { mkdir, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || "android");
const res = resolve(root, "app/src/main/res");
await access(resolve(root, "app/src/main/AndroidManifest.xml"));
const source = resolve("public/icon-512.png");
for (const [density, size, adaptive] of [["mdpi",48,108],["hdpi",72,162],["xhdpi",96,216],["xxhdpi",144,324],["xxxhdpi",192,432]]) {
  const dir = resolve(res, `mipmap-${density}`);
  await mkdir(dir, { recursive: true });
  const icon = await sharp(source).resize(size, size).png().toBuffer();
  await writeFile(resolve(dir, "ic_launcher.png"), icon);
  await writeFile(resolve(dir, "ic_launcher_round.png"), icon);
  const logoSize = Math.round(adaptive * 0.60);
  const logo = await sharp(source).resize(logoSize, logoSize).png().toBuffer();
  await sharp({ create: { width: adaptive, height: adaptive, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, gravity: "centre" }]).png().toFile(resolve(dir, "ic_launcher_foreground.png"));
}
const adaptiveDir = resolve(res, "mipmap-anydpi-v26");
await mkdir(adaptiveDir, { recursive: true });
const xml = '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/zad_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>\n';
for (const name of ["ic_launcher.xml", "ic_launcher_round.xml"]) await writeFile(resolve(adaptiveDir, name), xml);
await mkdir(resolve(res, "values"), { recursive: true });
await writeFile(resolve(res, "values/zad_launcher.xml"), '<resources><color name="zad_launcher_background">#0a0a0a</color></resources>\n');
console.log("Official launcher, round and adaptive icons generated for all Android densities.");
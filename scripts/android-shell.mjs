// Renders the built app's home page into dist/client/index.html so the
// Android app (Capacitor) can load it from the phone without any server.
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const serverEntry = resolve("dist/server/index.mjs");
if (!existsSync(serverEntry)) {
  console.error("dist/server/index.mjs not found — run the web build first");
  process.exit(1);
}

const mod = await import(serverEntry);
const handler = mod.default ?? mod;
const ctx = { waitUntil() {}, passThroughOnException() {} };
const res = await handler.fetch(new Request("https://localhost/"), {}, ctx);
const html = await res.text();

if (res.status !== 200 || !html.includes("/assets/")) {
  console.error("Failed to render app shell, status", res.status);
  console.error(html.slice(0, 500));
  process.exit(1);
}

writeFileSync(resolve("dist/client/index.html"), html);
console.log("Wrote dist/client/index.html (" + html.length + " bytes)");
process.exit(0);

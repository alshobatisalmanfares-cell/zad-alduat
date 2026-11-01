// CI-only: render the built home page for Capacitor's bundled webDir.
import { writeFileSync, existsSync, cpSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer } from "node:http";

async function renderShell() {
  // Nitro outside Lovable normally emits .output; older builds use dist.
  const candidates = [
    ".output/server/index.mjs",
    "dist/server/index.mjs",
    "dist/server/server.js",
    "dist/server/index.js",
  ];
  const serverEntry = candidates.find((file) => existsSync(resolve(file)));
  if (!serverEntry) {
    throw new Error(`No built server entry found. Run bun run build first. Checked: ${candidates.join(", ")}`);
  }

  const clientDir = resolve("dist/client");
  if (!existsSync(resolve(clientDir, "assets")) && existsSync(resolve(".output/public/assets"))) {
    cpSync(resolve(".output/public"), clientDir, { recursive: true });
  }
  if (!existsSync(resolve(clientDir, "assets")) || readdirSync(resolve(clientDir, "assets")).length === 0) {
    throw new Error("Client assets are missing. The web build must generate dist/client/assets or .output/public/assets.");
  }

  console.log(`Rendering offline page using ${serverEntry}`);
  const mod = await import(pathToFileURL(resolve(serverEntry)).href);
  const handler = mod.default ?? mod;
  let res;
  let html;
  if (typeof mod.middleware === "function") {
    // NITRO_PRESET=node-middleware produces a Node-compatible CI renderer.
    const server = createServer(mod.middleware);
    try {
      await new Promise((accept, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", accept);
      });
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Cannot start offline renderer");
      res = await fetch(`http://127.0.0.1:${address.port}/`, { signal: AbortSignal.timeout(60000) });
      html = await res.text();
    } finally {
      server.closeAllConnections();
      await new Promise((done) => server.close(done));
    }
  } else if (typeof handler.fetch === "function") {
    res = await handler.fetch(new Request("https://localhost/"), {}, {
      waitUntil() {}, passThroughOnException() {}, props: {},
    });
    html = await res.text();
  } else {
    throw new Error(`${serverEntry} has no fetch or middleware export. Build with NITRO_PRESET=node-middleware for Android CI.`);
  }

  if (res.status !== 200 || !html.includes("/assets/") || !/<html[\s>]/i.test(html)) {
    throw new Error(`Failed to render a valid offline app shell (status ${res.status}).`);
  }
  writeFileSync(resolve(clientDir, "index.html"), html);
  console.log(`Wrote dist/client/index.html (${html.length} bytes)`);
}

try {
  await renderShell();
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

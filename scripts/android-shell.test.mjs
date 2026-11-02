import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const script = resolve("scripts/android-shell.mjs");
const html = '<html><head><script src="/assets/app.js"></script></head><body>زاد الدعاة</body></html>';

function fixture(t, entry, source, assets = "dist/client") {
  const root = mkdtempSync(join(tmpdir(), "zad-shell-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, "package.json"), '{"type":"module"}');
  if (entry) {
    mkdirSync(dirname(join(root, entry)), { recursive: true });
    writeFileSync(join(root, entry), source);
  }
  if (assets) {
    mkdirSync(join(root, assets, "assets"), { recursive: true });
    writeFileSync(join(root, assets, "assets/app.js"), "// fixture");
  }
  return { root, run: () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8", timeout: 10000 }) };
}

test("renders Nitro middleware output and copies public assets into the Capacitor directory", (t) => {
  const f = fixture(t, ".output/server/index.mjs", `export function middleware(req, res) { res.setHeader('content-type', 'text/html'); res.end(${JSON.stringify(html)}); }`, ".output/public");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(join(f.root, "dist/client/index.html"), "utf8"), html);
  assert.equal(readFileSync(join(f.root, "dist/client/assets/app.js"), "utf8"), "// fixture");
});

for (const entry of ["dist/server/index.mjs", "dist/server/server.js", "dist/server/index.js"]) {
  test(`renders fetch output from ${entry}`, (t) => {
    const f = fixture(t, entry, `export default { fetch() { return new Response(${JSON.stringify(html)}); } };`);
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(f.root, "dist/client/index.html"), "utf8"), html);
  });
}

test("fails clearly when no server was built", (t) => {
  const result = fixture(t).run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No built server entry found/);
});

test("bundles unvisited public images and fonts when client assets already exist", (t) => {
  const f = fixture(t, "dist/server/index.mjs", `export default { fetch() { return new Response(${JSON.stringify(html)}); } };`);
  mkdirSync(join(f.root, "public/fonts"), { recursive: true });
  writeFileSync(join(f.root, "public/icon-512.png"), "official icon");
  writeFileSync(join(f.root, "public/fonts/cairo-400.woff"), "local font");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(join(f.root, "dist/client/icon-512.png"), "utf8"), "official icon");
  assert.equal(readFileSync(join(f.root, "dist/client/fonts/cairo-400.woff"), "utf8"), "local font");
});

test("rejects missing client assets", (t) => {
  const result = fixture(t, ".output/server/index.mjs", "export default {};", null).run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Client assets are missing/);
});

test("rejects failed SSR rather than packaging an error page", (t) => {
  const result = fixture(t, ".output/server/index.mjs", `export default { fetch() { return new Response(${JSON.stringify(html)}, { status: 500 }); } };`).run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /status 500/);
});
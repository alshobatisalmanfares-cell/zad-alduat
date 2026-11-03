import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

test("official logo generates all native launcher densities and adaptive resources", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "zad-icons-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "app/src/main"), { recursive: true });
  writeFileSync(join(root, "app/src/main/AndroidManifest.xml"), "<manifest/>");
  const result = spawnSync(process.execPath, [resolve("scripts/android-icons.mjs"), root], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  for (const [density, size] of [["mdpi",48],["hdpi",72],["xhdpi",96],["xxhdpi",144],["xxxhdpi",192]]) {
    const dir = join(root, "app/src/main/res", `mipmap-${density}`);
    const actual = readFileSync(join(dir, "ic_launcher.png"));
    const expected = await sharp("public/icon-512.png").resize(size, size).png().toBuffer();
    assert.deepEqual(actual, expected);
    assert.deepEqual(readFileSync(join(dir, "ic_launcher_round.png")), expected);
  }
  assert.match(readFileSync(join(root, "app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml"), "utf8"), /@mipmap\/ic_launcher_foreground/);
});
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadOfflineImage } from "../src/lib/offline-media.mjs";

test("remote image is persisted on first load and reused offline without fetch", async () => {
  const previous = Object.getOwnPropertyDescriptors(globalThis);
  const saved = new Map();
  let calls = 0;
  for (const [name, value] of Object.entries({
    window: { location: { origin: "https://localhost" } },
    navigator: { onLine: true },
    caches: { open: async () => ({ match: async (key) => saved.get(key)?.clone(), put: async (key, value) => saved.set(key, value) }) },
    fetch: async () => { calls++; return new Response("image bytes", { headers: { "content-type": "image/png" } }); },
  })) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  try {
    assert.equal(await (await loadOfflineImage("https://media.example/quran.png")).text(), "image bytes");
    assert.equal(saved.size, 1);
    navigator.onLine = false;
    assert.equal(await (await loadOfflineImage("https://media.example/quran.png")).text(), "image bytes");
    assert.equal(calls, 1);
    await assert.rejects(loadOfflineImage("https://media.example/unvisited.png"), /not saved offline/);
    assert.equal(calls, 1);
  } finally {
    for (const name of ["window", "navigator", "caches", "fetch"]) {
      if (previous[name]) Object.defineProperty(globalThis, name, previous[name]);
      else delete globalThis[name];
    }
  }
});
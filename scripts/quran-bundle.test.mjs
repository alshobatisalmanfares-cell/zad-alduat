import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const quran = JSON.parse(readFileSync(new URL('../src/data/quran-uthmani.json', import.meta.url)));
const surahs = JSON.parse(readFileSync(new URL('../src/data/surahs.json', import.meta.url)));
test('complete Quran is bundled with 114 surahs and 6236 ayahs', () => {
  assert.equal(Object.keys(quran.surahs).length, 114);
  assert.equal(Object.values(quran.surahs).flat().length, 6236);
});
test('every bundled surah has the expected verse count and continuous numbers', () => {
  let number = 0;
  for (const s of surahs) {
    const ayahs = quran.surahs[s.number];
    assert.equal(ayahs.length, s.ayahs);
    ayahs.forEach((a, i) => { assert.equal(a.numberInSurah, i + 1); assert.equal(a.number, ++number); assert.ok(a.text.length > 0); });
  }
});
test('source and license remain in the distributed corpus', () => {
  assert.equal(quran.source, 'https://tanzil.net');
  assert.ok(quran.notice.includes('CHANGING IT IS NOT ALLOWED'));
});
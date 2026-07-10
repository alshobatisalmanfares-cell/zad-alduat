# Zad Al-Duat — Fixes + Content + Sitemap

Big batch. Shipping in 3 phases so each is verifiable in preview before the next.

## Phase A — Fixes, real icons, hidden admin, dark mode

1. **Dark mode actually toggles**
   - Add `dark` class toggle on `<html>` from the store's `nightMode` (currently only affects inline reader styles). Wire the top-left Sun/Moon button on the home header to `toggleNight()`.
   - Tailwind v4: add `@custom-variant dark (&:where(.dark, .dark *))` in `src/styles.css` and dark tokens in `@theme` so every page (cards, borders, muted text) flips globally.
2. **Hide "لوحة التحكم" from home**
   - Remove the tile + `AdminGateModal` from `src/routes/index.tsx`. Admin stays reachable only via typing `/admin` in the URL (password gate already in `src/routes/admin.tsx` = `77salmanfares77ss`).
3. **Real, branded icons per section**
   - Ship a small custom SVG set in `src/components/icons/` (Mushaf, Minbar/Khutbah scroll, Misbaha beads, Hadith speech/book, Compass/Qibla, Heart-favorites, Home dome). Replace Lucide usages in `BottomNav`, quick actions, and sections grid. Keep Lucide only for UI chrome (X, chevrons, search).

## Phase B — Real content: Quran (114), Hadith standalone, Hisn al-Muslim

1. **Quran index + reader**
   - Bundle `src/data/surahs.json` (all 114: number, Arabic name, English, revelation place, ayah count) as static metadata.
   - `/quran` → grid/list of 114 surahs with number badge, name, meta.
   - `/quran/$id` → fetches ayahs from `https://api.alquran.cloud/v1/surah/{id}/quran-uthmani` on first visit, caches in `localStorage` (`quran:surah:{id}`), renders with Cairo/Amiri, respects font scale + night mode. Includes basmala handling and ayah number circles.
2. **Standalone `/hadith` section**
   - New route separate from Quran. Bundled `src/data/hadith.json` — curated set of ~80 authentic ahadith from Bukhari & Muslim (الأربعون النووية + مختارات من الصحيحين), each with `{book, number, category, text, grade: "صحيح"}`.
   - Category tabs (الإيمان، العبادات، الأخلاق، المعاملات، الرقائق، الدعاء). Search. Favorites. Reader controls.
   - Add "الحديث" to bottom nav (replaces the mixed Quran+Hadith tab). Quran tab stays.
3. **Hisn al-Muslim full azkar**
   - Bundle verified dataset (`src/data/azkar.json`) from open-source Hisn al-Muslim (categories: الاستيقاظ، الصباح، المساء، النوم، بعد الصلاة، الطعام، الخلاء، اللباس، السفر، الأدعية النبوية…).
   - `/azkar` → categories grid. `/azkar/$catId` → each zikr card with countdown counter button (`تبقى: N`), vibrate + gold glow when done, progress ring. Respects global settings.

## Phase C — Dynamic sitemap + Supabase

1. **Enable Lovable Cloud** (Supabase).
2. **Migrate admin-managed tables**: `khutab`, `categories`, `hadith_of_day`, `custom_azkar` with RLS (`SELECT` public via `TO anon`, writes gated by `has_role('admin')` on `user_roles`). Seed from current mock data.
3. **Real admin auth**: replace hard-coded password with Supabase email/password login + admin role check. Old `/admin` password still works as fallback for the seed account creation flow only, then removed.
4. **Dynamic sitemap** at `src/routes/sitemap[.]xml.ts` (server route). Static entries for `/`, `/quran`, `/hadith`, `/azkar`, `/khutbah`, `/favorites`. Dynamic entries for each published khutbah (fetched via server publishable client from `khutab` table) and each of the 114 surahs. Correct `<loc>`, `<lastmod>` (from `updated_at`), `<changefreq>`. Add `Sitemap:` line to `robots.txt`.

## Notes / trade-offs

- Hadith set will be ~80 verified entries bundled offline (Nawawi 40 + selected Bukhari/Muslim). "Every hadith in the Sahihain" is ~14k+ and would need an API/DB — say the word to swap.
- Quran text still fetched on demand (cached forever after first open) to keep bundle small; alt is bundling all 114 surahs (~5MB).
- Custom SVG icons are hand-drawn simple line/fill style tuned to the emerald+gold theme, not photorealistic.
- Phase C depends on enabling Cloud (one click). Until then sitemap can only list static routes + the 114 surahs.

Reply **"go"** and I start Phase A immediately, or tell me to reorder / skip parts.

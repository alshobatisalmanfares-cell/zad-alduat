# Zad Al-Duat — Upgrade Plan

This is a large batch of features. I'll ship it in **4 sequential phases** so each phase is stable and you can preview it before the next starts. If you want a different order, tell me and I'll adjust.

---

## Phase 1 — Security, UI polish, PWA install, favicon (no backend)

Fast wins, no data migration risk.

1. **Admin password → `77salmanfares77ss`**
   - Update `src/lib/store.tsx` so `loginAdmin` compares against this exact value.
   - Session persists in `localStorage` until "خروج" is clicked (already the case).
2. **Dashboard access from home**
   - Clicking the "لوحة التحكم" card opens a centered password modal (same 77salmanfares77ss). On success → `/admin/dashboard`. On fail → shake + error message.
3. **Hide top-left settings gear** on the home header.
4. **Icon polish (emerald + gold)**
   - Keep Lucide (already installed) but wrap each nav / quick-access / section icon in a colored gradient tile (emerald→gold) with soft shadow, so they read as premium branded icons instead of flat outlines. This is the fastest way to get a "premium colorful" feel without shipping a heavy icon pack.
5. **Favicon + app icon = uploaded logo**
   - Save upload to `public/logo.png` via Lovable Assets, generate `favicon.png` + `apple-touch-icon.png` + `icon-192.png` + `icon-512.png` (same image, resized).
   - Update `__root.tsx` head links and create `public/manifest.webmanifest`.
   - Delete default `public/favicon.ico`.
6. **PWA install banner**
   - Add `public/manifest.webmanifest` (name: زاد الدعاة, theme #0f5132, standalone, icons above).
   - Add a client-only `<InstallPrompt />` component that listens to `beforeinstallprompt`, shows a bottom banner with the exact Arabic copy + "تثبيت الآن" button, and hides on dismiss (stored in `localStorage`) or on `appinstalled`.
   - Manifest-only PWA — no service worker (per Lovable PWA rules); native install still works on Android/desktop Chrome. iOS shows "Add to Home Screen" via Safari share sheet using the same manifest + apple-touch-icon.

## Phase 2 — Full Quran (all 114 surahs, verified)

- Fetch on demand from **api.alquran.cloud** (`quran-uthmani` edition — verified Uthmani script with full tashkeel).
- New route structure:
  - `/quran` → Surah index (114 items with name, number, Meccan/Medinan badge, ayah count). Metadata bundled as static JSON so index is instant/offline.
  - `/quran/$surahId` → Reader view with all ayahs, Cairo font, ayah number circles, respects global font-size + night mode.
- Cache each fetched surah in `localStorage` (`quran:surah:{id}`) so it opens instantly offline after the first load.
- Update Bottom Nav "القرآن" link accordingly.

## Phase 3 — Full Azkar (Hisn al-Muslim, verified)

- Import a certified Hisn al-Muslim JSON dataset (open-source, e.g. `hadith-json` / `ahegazy/muslim_data`) bundled into the app for full offline availability and zero-typo accuracy.
- New route structure:
  - `/azkar` → Categories list (أذكار الصباح، المساء، الاستيقاظ، النوم، بعد الصلاة، الأدعية النبوية، …).
  - `/azkar/$catId` → List of azkar with per-zikr counter button (تكرار N مرات). Tapping decreases the remaining count, shows progress ring, vibrates (`navigator.vibrate`) + color-changes to gold when completed.
- Respects global font-size + night mode.
- Admin can still add extra custom azkar (stored in Supabase after Phase 4) that appear alongside built-in ones.

## Phase 4 — Supabase (Lovable Cloud) for admin-managed content

Enable Lovable Cloud and migrate mockup content:

- Tables: `khutab`, `categories`, `hadith_of_day`, `custom_azkar` — all with RLS.
- Policies:
  - `SELECT`: public (anon + authenticated) — everyone can read published content.
  - `INSERT/UPDATE/DELETE`: only admins (role checked via `user_roles` + `has_role`).
- Admin auth upgrade: replace the hard-coded password with real Supabase email/password login gated by an `admin` role. I'll seed one admin account for you (you'll set the email/password after Cloud is enabled).
- Public reads via server publishable client from a TanStack loader; writes via `requireSupabaseAuth` server functions.

---

## Notes / trade-offs

- **PWA install prompt won't fire in the Lovable editor preview iframe.** You'll see the banner only on the published site (or in a normal browser tab). I'll add a small "how to test" note in the response.
- **Icons:** I'm styling Lucide with gradients rather than pulling a heavy premium set — this keeps bundle size small while looking branded. If you want a specific pack (e.g. FontAwesome Pro / a custom SVG set), point me at it and I'll swap.
- **Admin password in code:** storing `77salmanfares77ss` client-side is a soft gate — anyone reading the JS bundle can see it. Phase 4 replaces this with a real Supabase login + role check, which is the actually-secure version. Say the word if you want Phase 4 first instead.
- **Quran API:** first open of each surah needs internet; after that it's cached forever in the browser. If you'd rather bundle the entire mushaf (~4–8 MB) for pure offline, tell me and I'll switch.

Approve and I'll start with **Phase 1** immediately.

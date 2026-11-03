# Android build (Capacitor)

The app is a real offline-first app: all web assets are bundled into the APK and all
content (khutbahs, hadiths, adhkar, Quran surahs you have opened, tasbeeh) is stored in a
local database on the device. Supabase stays the source of truth and syncs in the
background whenever the phone is online. This is not a remote WebView wrapper — there is no
`server.url` pointing to a website.

## One-time setup

```bash
bun install --frozen-lockfile
NITRO_PRESET=node-middleware bun run build && bun scripts/android-shell.mjs
bunx cap add android
node scripts/android-icons.mjs
bunx cap sync android
```

## Every build after a code change

```bash
NITRO_PRESET=node-middleware bun run build && bun scripts/android-shell.mjs
node scripts/android-icons.mjs
bunx cap sync android
bunx cap open android   # then Build > Build APK / Bundle in Android Studio
```

Requirements: Node 22.12+ + Android Studio + JDK 21 + Android SDK 36 / Build Tools 36.0.0 on your machine
(the cloud editor cannot run the native Gradle build).

## Offline behaviour

| Layer | Where it lives |
| --- | --- |
| App shell, icons, fonts | Bundled in the APK / service worker cache |
| Khutbahs, Azkar, Hadith-of-day | IndexedDB (`zad-offline`), hydrated before any network call |
| Quran surahs | IndexedDB (`quran` store), cached the first time a surah is opened |
| Tasbeeh counter, favourites, settings | Device storage (localStorage) |

Sync rules:
- On launch the UI renders from the local database first, then refreshes from Supabase.
- Reconnecting to the internet triggers an automatic sync.
- Supabase realtime updates are written straight into the local database.
- The manual "تحديث البيانات" button forces a sync and reports success/failure.

The admin dashboard is unchanged and still requires a connection for write operations.

Local public images and fonts are copied into every APK, even if their pages have never
been visited. The published PWA precaches them during service-worker installation;
it needs one online installation to finish, not an online visit to every image.
Offline service workers are intentionally disabled in the editor preview.
GitHub Actions produces a debug APK artifact; a signed store release requires separate
signing credentials and release configuration. Nitro remains pinned because newer
registry versions are prereleases, not stable replacements.

Native launcher icons are generated from public/icon-512.png for legacy, round and
adaptive Android launchers after every fresh cap add. The golden/black source is
preserved with safe adaptive padding; no template launcher resources are used.
The generator also refreshes `resources/icon.png` from the official logo, removes
conflicting density-specific fallback files, and explicitly maps the Android
manifest's `android:icon` and `android:roundIcon` to the generated mipmaps.
Run `bun run cap:icons` after creating the Android platform or changing the logo;
`cap:sync` and GitHub Actions already run this step before syncing Android.
Remote images rendered through OfflineImage persist readable image blobs in device
CacheStorage and return saved blobs before any network request. New remote servers
must permit CORS for native blob caching. Published PWA image requests, including
cross-origin images, are cache-first (opaque responses supported). Saved PWA media
has no age expiry; the 1000-entry bound and device storage availability still apply.
Quran pages currently render API text, not Quran image scans. A remote image must be
loaded once online before it can be read offline; bundled icons need no such load.

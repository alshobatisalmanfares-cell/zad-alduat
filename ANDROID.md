# Android build (Capacitor)

The app is a real offline-first app: all web assets are bundled into the APK and all
content (khutbahs, hadiths, adhkar, Quran surahs you have opened, tasbeeh) is stored in a
local database on the device. Supabase stays the source of truth and syncs in the
background whenever the phone is online. This is not a remote WebView wrapper — there is no
`server.url` pointing to a website.

## One-time setup

```bash
bun install
bun run build          # produces .output/public (webDir)
bunx cap add android
bunx cap sync android
```

## Every build after a code change

```bash
bun run build
bunx cap sync android
bunx cap open android   # then Build > Build APK / Bundle in Android Studio
```

Requirements: Android Studio + JDK 21 + Android SDK 34+ on your machine
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

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Android CI builds use Nitro's `node-middleware` preset only for local shell rendering; the packaging script resolves Nitro and legacy TanStack output paths into Capacitor's `dist/client` webDir so hosted deployment settings remain unchanged.
- Fonts and official app icons remain bundled in public assets and are referenced through same-origin paths so Capacitor and the PWA precache include them without any CDN dependency.
- PWA output and precache target dist/client, and Android packaging always copies public assets regardless of whether client/assets already exists; unvisited images and fonts must be available offline.
- Every fresh Android project generates density, round and adaptive launcher resources from the official public logo before sync, refreshes resources/icon.png, removes conflicting density fallbacks and explicitly maps native manifest icons; web manifests alone do not set native launcher branding.
- Remote image controls use OfflineImage and device CacheStorage blobs before fetch, independent of service workers; PWA image requests use cache-first and never age-expire saved media. Quran reading currently uses text, not page images.
- Quran reading uses the complete verbatim bundled Tanzil Uthmani corpus before cached or remote data; preserve its license notice and attribution for offline first-launch reading.
- Sermon categories and tags use array fields, with the legacy category field mirroring the first assignment; database triggers keep renamed/deleted category assignments consistent.
- Shared text actions use native Capacitor clipboard/share on devices and browser APIs with copy fallback on web; copy/share buttons live only inside detail views (no global floating toolbar).

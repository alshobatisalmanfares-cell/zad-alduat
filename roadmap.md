# Android build repair

# Current content and offline fixes

- [ ] Enable global selection, copying and native sharing.
- [ ] Normalize sermon search across title, content, tags and multiple categories.
- [ ] Persist category create, rename and delete with synchronized sermon assignments.
- [ ] Add multi-category sermon editing.
- [ ] Bundle the complete text Quran for offline first launch.
- [ ] Verify content management, search, sharing and offline Quran flows.

- [x] Align the offline shell script with TanStack/Nitro build outputs.
- [x] Configure GitHub Actions to generate a CI-compatible server and verify the offline page.
- [x] Run script regression tests and workflow validation (7 tests passed).

# Offline presentation updates

- [x] Bundle Cairo, Amiri, and Amiri Quran fonts and remove external font links.
- [x] Verify local logo paths and remove the home-page hadith card.
- [x] Replace the sticky offline bar with a dismissible, temporary notification.
- [x] Check offline fonts, images, notification dismissal, and home layout.

# Current Android and offline image update

- [x] Update compatible Android build dependencies and CI setup.
- [x] Precache local images/fonts and bundle them even when pages were never opened.
- [x] Verify packaging tests and offline image loading; APK generation on GitHub and real-device verification remain external checks.

# Native branding and saved media

- [x] Harden native logo source, density resources and Android manifest mappings; all 10 icon, packaging and offline media checks passed. APK/device verification remains external.

- [x] Apply official launcher icons to every generated Android project.
- [x] Serve saved remote images cache-first in PWA and native app image controls.
- [x] Verify image cache reuse without network requests and native icon resources; 10 tests and workflow validation passed, full APK/device run remains unverified.
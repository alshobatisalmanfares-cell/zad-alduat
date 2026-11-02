# Android build repair

- [x] Align the offline shell script with TanStack/Nitro build outputs.
- [x] Configure GitHub Actions to generate a CI-compatible server and verify the offline page.
- [x] Run script regression tests and workflow validation (7 tests passed).

# Offline presentation updates

- [x] Bundle Cairo, Amiri, and Amiri Quran fonts and remove external font links.
- [x] Verify local logo paths and remove the home-page hadith card.
- [x] Replace the sticky offline bar with a dismissible, temporary notification.
- [x] Check offline fonts, images, notification dismissal, and home layout.

# Current Android and offline image update

- [ ] Update compatible Android build dependencies and CI setup.
- [ ] Precache local images/fonts and bundle them even when pages were never opened.
- [ ] Verify packaging tests and offline image loading; report APK build limitations.
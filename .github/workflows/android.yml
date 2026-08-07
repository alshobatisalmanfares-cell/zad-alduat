name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 22

    - name: Install Dependencies
      run: npm install

    - name: Build Web Assets
      run: npm run build

    - name: Ensure Dist Directory
      run: |
        mkdir -p dist
        if [ ! -f "dist/index.html" ] && [ -d "build" ]; then cp -r build/* dist/; fi
        if [ ! -f "dist/index.html" ] && [ -d "out" ]; then cp -r out/* dist/; fi

    - name: Sync Capacitor Android
      run: |
        rm -rf android
        npx cap add android
        npx cap sync android

    - name: Force Fix Android Icons Without XML Conflict
      run: |
        rm -rf android/app/src/main/res/mipmap-anydpi-v26
        
        ICON_SRC=$(find public src -name "*icon-512*.png" -o -name "*logo*.png" -o -name "*favicon*.png" | head -n 1)
        if [ -z "$ICON_SRC" ]; then ICON_SRC="public/icon-512.png"; fi
        
        for dir in android/app/src/main/res/mipmap-*; do
          if [ -d "$dir" ]; then
            cp -f "$ICON_SRC" "$dir/ic_launcher.png"
            cp -f "$ICON_SRC" "$dir/ic_launcher_round.png"
            cp -f "$ICON_SRC" "$dir/ic_launcher_foreground.png"
          fi
        done

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'

    - name: Build APK with Gradle
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug --no-daemon

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: zad-alduat-app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk

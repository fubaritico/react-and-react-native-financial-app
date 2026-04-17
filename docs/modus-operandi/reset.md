# Modus Operandi — Post-Reset Verification

## Prerequisites

- Close all simulators (iOS Simulator app, Android emulator)
- Close Xcode if open
- Stop any running Metro bundler (`Ctrl+C`)

## What `pnpm reset` does

1. Removes all `node_modules/` (root + all packages)
2. Removes `.expo/` caches (mobile-expo, mobile-expo-ejected)
3. Removes iOS native artifacts (`ios/Pods/`, `ios/build/`) for mobile + mobile-expo-ejected
4. Removes Android native artifacts (`android/build/`, `android/.gradle/`) for mobile + mobile-expo-ejected
5. Removes Metro/Haste/React Native temp caches from `/tmp/`
6. Clears Watchman watches
7. Clears Xcode DerivedData for mobile projects
8. Prunes pnpm store (orphaned packages)
9. Runs `pnpm install --frozen-lockfile`
10. Runs `pod install` for mobile and mobile-expo-ejected

## Post-Reset Verification Checklist

### 1. mobile-expo (canonical — verify first)

This app runs via Expo Go. No native build required.

```bash
# Terminal 1: start Metro
pnpm --filter mobile-expo start

# Then press:
#   i → opens iOS simulator
#   a → opens Android emulator
```

- [ ] iOS simulator: app launches, UI renders correctly
- [ ] Android emulator: app launches, UI renders correctly
- [ ] Physical iPhone via Expo Go: scan QR code, app loads

### 2. mobile (bare RN CLI)

This app builds native binaries directly.

```bash
# Terminal 1: start Metro
pnpm --filter mobile start

# Terminal 2: build + launch on simulator
pnpm --filter mobile ios:sim
```

- [ ] iOS simulator (iPhone 16): app builds, installs, launches, connects to Metro
- [ ] Close iOS simulator before testing Android

```bash
# Terminal 2: build + launch on Android emulator
pnpm --filter mobile android
```

- [ ] Android emulator: app builds, installs, launches, connects to Metro

### 3. mobile-expo-ejected

```bash
# Terminal 1: start Metro
pnpm --filter mobile-expo-ejected start

# Terminal 2: build + launch
pnpm --filter mobile-expo-ejected ios
# or
pnpm --filter mobile-expo-ejected android
```

- [ ] iOS simulator: app builds, installs, launches
- [ ] Android emulator: app builds, installs, launches

## Important Notes

- **Close simulators between apps**: Metro port 8081 is shared. Close the simulator
  before switching to a different app, or Metro will serve the wrong bundle.
- **One Metro at a time**: only one `pnpm --filter <app> start` should run at a time.
  Kill the previous one before starting the next app.

## Known Issues & Fixes

### `pnpm --filter mobile ios` targets physical iPhone instead of simulator

**Symptom**: `react-native run-ios` auto-detects a booted/connected physical iPhone and
targets it instead of a simulator. Build fails with error code 70 (signing) or 65 (sandbox).

**Fix**: Use `ios:sim` to explicitly target iPhone 16 simulator:
```bash
pnpm --filter mobile ios:sim
```

The generic `ios` command is for physical device deployment (requires signing setup).

### Error 70 — code signing failure on physical device

**Symptom**: `xcodebuild exited with error code '70'` when targeting a physical iPhone.

**Cause**: The Xcode project isn't configured for device signing.

**Fix**:
1. Open `packages/mobile/ios/mobile.xcworkspace` in Xcode
2. Click the blue **mobile** project icon (top of left sidebar)
3. Under **TARGETS**, click **mobile**
4. Go to **Signing & Capabilities** tab
5. Check **Automatically manage signing**
6. Set **Team** to your Apple ID (Personal Team — free)
7. Set **Bundle Identifier** to `com.<yourname>.mobile`

### Error 65 — Xcode sandbox / DerivedData conflict

**Symptom**: `Sandbox: rsync deny(1) file-read-data hermes.framework` or
`hermes.framework/Info.plist: unlinkat: Operation not permitted`

**Cause**: Stale Xcode DerivedData from a previous build (different target architecture
or signing config).

**Fix**:
```bash
# Remove DerivedData for this project
rm -rf ~/Library/Developer/Xcode/DerivedData/mobile-*

# Then rebuild
pnpm --filter mobile ios:sim
```

The reset script already cleans DerivedData, but this can happen if you switch between
simulator and device builds without cleaning.

### "Waiting to reconnect to iPhone" in Xcode

**Symptom**: Xcode status bar shows "Waiting to reconnect to iPhone12mini" even though
the phone is plugged in via USB.

**Fixes (try in order)**:
1. Unplug USB, wait 5s, replug
2. On iPhone: tap **Trust** if "Trust This Computer?" appears
3. If no trust dialog: iPhone **Settings > General > Transfer or Reset iPhone > Reset >
   Reset Location & Privacy** — then unplug/replug to trigger the dialog again
4. Try a different USB cable (some are charge-only)
5. Restart iPhone + Mac

**Known limitation**: On some older iPhones (iPhone 12 mini), the USB connection drops
during heavy Xcode compilation I/O. The device build may fail even with correct signing.
Use simulator (`ios:sim`) as fallback, or test on physical device via Expo Go with
mobile-expo instead.

### Pod install fails

**Symptom**: `pod install` errors during reset.

**Fixes**:
```bash
# Update CocoaPods repo
pod repo update

# If that doesn't work, clear pod cache
pod cache clean --all

# Then retry
cd packages/mobile/ios && pod install
```

### Metro port 8081 already in use

**Symptom**: `A dev server is already running for this project on port 8081`

**Fix**:
```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill -9

# Or kill all node processes
killall node
```

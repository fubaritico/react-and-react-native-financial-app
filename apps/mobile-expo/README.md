# mobile-expo

React Native application with **Expo (managed workflow)**.

## Stack

- **Expo SDK 54**
- **React Native 0.81.5**
- **TypeScript**

## Prerequisites

### iOS Simulator

1. Install **Xcode** from the Mac App Store
2. Open Xcode, go to **Settings > Components**
3. Download an **iOS runtime** (e.g. iOS 18.4 — ~9 GB)
4. Verify simulators are available:
   ```bash
   xcrun simctl list devices available
   ```
   You should see devices like "iPhone 16", "iPhone 15 Pro", etc.

### Android Emulator

Since there is no Android physical device available, the emulator is the only way to test on Android.

1. Install **Android Studio** from https://developer.android.com/studio
2. On first launch, complete the setup wizard — it installs the Android SDK, build tools, and platform tools
3. Open Android Studio, go to **More Actions > Virtual Device Manager** (or **Tools > Device Manager** if a project is open)
4. Click **Create Device**:
   - Pick a device profile (e.g. "Pixel 8")
   - Select a system image — download one with **API 34+** (click the download icon next to it)
   - Finish the wizard
5. Start the emulator by clicking the play button next to your device in the Device Manager
6. Set the environment variables — add these to your `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
   Then reload your shell:
   ```bash
   source ~/.zshrc
   ```
7. Verify the setup:
   ```bash
   adb devices
   ```
   You should see your emulator listed (e.g. `emulator-5554  device`)
8. Launch the app:
   ```bash
   pnpm --filter mobile-expo android
   ```

**Note:** The Android emulator requires hardware acceleration (Intel HAXM or Apple Hypervisor). On Apple Silicon Macs this works out of the box. On Intel Macs, ensure HAXM is installed (Android Studio setup wizard handles this).

### Dependencies

```bash
# From monorepo root
pnpm install
```

## Commands

All commands are run from the **monorepo root**.

### Dev (Expo Go — no native build)

Use these for day-to-day development. Runs JS via Expo Go on your device or simulator — fast startup, but no custom native code, no custom app icon or splash screen.

```bash
# Start Metro bundler (interactive — pick device from menu)
pnpm expo:start

# Clear Metro cache and start
pnpm expo:start:clean

# Launch on iOS simulator via Expo Go
pnpm expo:ios

# Launch on Android emulator via Expo Go
pnpm expo:android

# Launch on Web
pnpm --filter mobile-expo-financial-app web
```

### Simulator / emulator device targeting

Target a specific device form factor without the interactive picker:

```bash
# iOS simulators
pnpm expo:ios                  # Default iPhone simulator
pnpm expo:ios:iphone           # iPhone 16 Pro
pnpm expo:ios:ipad             # iPad Pro 11-inch (M4)

# Android emulators
pnpm expo:android              # Default emulator
pnpm expo:android:phone        # Small_Phone AVD
pnpm expo:android:tablet       # Medium_Tablet AVD
```

> **Note:** Device names are tied to locally available simulators/AVDs. If you delete or rename a simulator in Xcode or Android Studio, update the corresponding script in `package.json`.

### Build (native binary — full app experience)

Use these when you need the real app: custom icon, splash screen, native modules, or testing on a physical device. Compiles a native binary via Xcode/Gradle — slower first build, but produces a standalone app.

```bash
# Build and run on iOS simulator
pnpm --filter mobile-expo-financial-app ios:build

# Build and run on physical iPhone (prompts for device selection)
pnpm expo:ios:device

# Build and run on Android emulator
pnpm --filter mobile-expo-financial-app android:build

# Build and run on physical Android device
pnpm expo:android:device
```

> **First build** generates the `ios/` and `android/` folders (via `expo prebuild`) and runs pod install. Subsequent builds are incremental and much faster.

## Expo Go (physical device)

Expo Go lets you run the app on a real device without building a native binary.

1. Install **Expo Go** from the App Store (iOS) or Google Play Store (Android)
2. Make sure your phone and your computer are on the **same Wi-Fi network**
3. From the monorepo root, run:
   ```bash
   pnpm --filter mobile-expo start
   ```
4. A QR code appears in the terminal
   - **iOS**: open the **Camera** app and point it at the QR code — tap the Expo banner that appears
   - **Android**: open the **Expo Go** app and tap "Scan QR code"
5. The app loads on your device via the Metro bundler — changes reload automatically

## Hot Reload (Fast Refresh)

Expo uses **Fast Refresh** powered by Metro. Any change to a `.tsx` or `.ts` file is reflected on the device/simulator within seconds — no full rebuild needed.

- Works on **Expo Go**, **dev builds**, and **simulators/emulators**
- Preserves component state when possible
- If Fast Refresh fails (e.g. syntax error), fix the error and save again — it recovers automatically
- To force a full reload, press `r` in the Metro terminal

## Advantages of managed workflow

- No native configuration required (no Xcode/Android Studio needed for day-to-day dev)
- OTA updates possible
- Rich Expo SDK (camera, notifications, auth...)
- Cloud builds with EAS

## Limitations

- No direct access to native iOS/Android code
- Custom native modules are limited
- Dependency on the Expo ecosystem

## Troubleshooting

### "Unable to boot device / cannot determine the runtime bundle"
The iOS simulator runtime is missing. Install it via Xcode > Settings > Components (see Prerequisites above).

### Simulator boot timeout
On first launch after installing a runtime, the simulator may timeout during boot. The app usually recovers automatically — check if the simulator opened and the app loaded despite the error.

### expo version mismatch warning
If Metro warns about expo version mismatch, update with:
```bash
pnpm --filter mobile-expo add expo@~54.0.33
```

## Structure

```
mobile-expo/
├── app/                 # Expo Router file-based routes
│   ├── _layout.tsx      # Root layout (auth gate)
│   ├── (auth)/          # Auth stack (login, signup)
│   └── (tabs)/          # Tab navigator (Overview, Transactions, Budgets, Pots, Recurring)
├── app.json             # Expo configuration
├── metro.config.js      # Metro config (monorepo watchFolders)
├── src/
│   └── components/      # App-level components (DevBadge, etc.)
├── assets/              # Images, fonts...
├── package.json
└── tsconfig.json
```

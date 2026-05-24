# Rules — Troubleshooting

## Reset & Build Issues

Full modus operandi: `docs/modus-operandi/reset.md`

### Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| xcodebuild error 70 | Code signing not configured for physical device | Use `ios:sim` or set up signing in Xcode |
| xcodebuild error 65 | Stale DerivedData or ENABLE_USER_SCRIPT_SANDBOXING=YES | See `iphone-wireless-deploy.md` |
| "Waiting to reconnect" | USB connection dropping during build | Use wireless debugging (see `iphone-wireless-deploy.md`) |
| Port 8081 in use | Leftover Metro process | `lsof -ti:8081 \| xargs kill -9` |
| Pod install fails | Stale CocoaPods cache | `pod repo update && pod cache clean --all` |
| `getDevServer is not a function (it is Object)` | `@expo/metro-runtime` or `expo-router` version mismatch with SDK | Run `npx expo install --fix` then `npx expo prebuild --clean && npx expo run:ios` |
| `Cannot find native module 'ExpoLinking'` | JS bundle updated but native binary is stale (missing new native modules) | `npx expo prebuild --clean && npx expo run:ios` |
| `Could not find org.asyncstorage.shared_storage:storage-android:1.0.0` | AsyncStorage v3 local Maven repo not configured | Add `allprojects { repositories { maven { url = uri(project(":react-native-async-storage_async-storage").file("local_repo")) } } }` to `android/build.gradle` |
| `__fbBatchedBridgeConfig is not set` (Jest) | pnpm created 2+ copies of react-native (different peer dep contexts) — preset mocks only apply to one | `moduleNameMapper` to force singleton — see "Jest + pnpm Monorepo" section below |
| Android emulator: API requests silently fail (no error, pages stay loading) | Node.js `app.listen(PORT)` may bind to IPv6 `::1` only — emulator's `10.0.2.2` can't reach it | Bind explicitly: `app.listen(PORT, '0.0.0.0', ...)`. Also ensure `"usesCleartextTraffic": true` in `app.json` under `android`. Fallback: `adb reverse tcp:3001 tcp:3001` |

### Expo Managed (apps/mobile-expo) — Dependency Alignment

After upgrading Expo packages or adding native dependencies, the JS bundle and native binary
can get out of sync. Symptoms: `Cannot find native module '...'`, `getDevServer is not a function`.

Fix sequence:
```bash
cd apps/mobile-expo
npx expo install --fix          # align all Expo deps to current SDK version
npx expo prebuild --clean       # regenerate ios/ and android/ with new native modules
npx expo run:ios                # build and install fresh binary on simulator
```

Key lesson (Phase 7.2): the pnpm catalog had `expo-router: "~4.0.22"` but SDK 54 requires
`expo-router@~6.0.23` and `@expo/metro-runtime@^6.1.2`. The old v4 had ESM/CJS interop issues
with RN 0.81. Always run `npx expo install --check` after adding Expo dependencies to verify
version alignment. Do NOT attempt Metro resolver shims — fix the version mismatch instead.

### Bare RN CLI (apps/mobile) — Physical Device

Full guide: `docs/modus-operandi/iphone-wireless-deploy.md`

Physical device deployment uses **wireless debugging** (Connect via Network) to avoid
USB disconnect issues during heavy xcodebuild I/O (iPhone 12 mini).

Key requirements:
- Developer Mode enabled on iPhone
- "Connect via network" checked in Xcode → Devices and Simulators
- `ENABLE_USER_SCRIPT_SANDBOXING = NO` in project.pbxproj (both Debug + Release)
- Mac and iPhone on same Wi-Fi
- Device Conditions set to None (no network simulation active)

### Disk Space — Build Artifacts

Xcode DerivedData, CocoaPods cache, and Expo prebuild output (`ios/`, `android/`) accumulate
quickly and can consume several GB. This is especially problematic on smaller drives.

Cleanup commands:
```bash
# DerivedData — can be 5-20+ GB (Xcode rebuilds what it needs)
rm -rf ~/Library/Developer/Xcode/DerivedData

# CocoaPods cache
pod cache clean --all

# Expo managed (mobile-expo) generated native dirs
rm -rf apps/mobile-expo/ios apps/mobile-expo/android

# pnpm store — remove unreferenced packages
pnpm store prune

# iOS simulator caches (resets all simulators)
xcrun simctl erase all
```

The reset script (`pnpm reset`) handles most of these automatically.

> **Warning**: third-party cleanup utilities may delete Xcode simulator runtimes and device
> trust caches. If your simulator or physical device stops being recognized after a cleanup,
> re-download the runtime in Xcode > Settings > Components and re-pair your device.

### Expo Modes — QR Code / Simulateur / Device

| Je veux... | Prérequis | Commande |
|---|---|---|
| **QR code → iPhone (Expo Go)** | Expo Go installé, PAS de dossier `ios/`/`android/` | `npx expo start` puis flash QR |
| **Simulateur iPhone** | Xcode + simulateur installé | `pnpm expo:ios:iphone` (build + install) puis `npx expo start --dev-client` |
| **Simulateur iPad** | Xcode + simulateur iPad installé | `pnpm expo:ios:ipad` (build + install) puis `npx expo start --dev-client` |
| **iPhone physique (dev build)** | Apple Developer account, device registered | `pnpm expo:ios:device` puis `npx expo start --dev-client` |
| **Android émulateur** | Android Studio + AVD | `pnpm expo:android` |

**Piège principal** : si `ios/` ou `android/` existent → `expo start` passe en mode dev-client
automatiquement. Le QR code ne fonctionne plus avec Expo Go.

| Symptôme | Cause | Fix |
|---|---|---|
| "is no longer available" (QR code iPhone) | `ios/` existe → mode dev-client, mais pas de build installé | `rm -rf ios android` pour revenir à Expo Go, OU `npx expo run:ios --device` pour installer le dev build |
| QR code ouvre Expo Go mais crash | SDK mismatch entre app et Expo Go | Mettre à jour Expo Go depuis l'App Store |
| "Could not connect to server" | Mac et iPhone pas sur le même Wi-Fi, ou firewall | Vérifier Wi-Fi, `npx expo start --tunnel` en fallback |
| Metro ne sert pas après `expo start` | Port 8081 occupé par un autre Metro | `lsof -ti:8081 \| xargs kill -9` |

**Règle simple** :
- Expo Go (QR code rapide) = pas de dossier natif, pas de `--dev-client`
- Dev build (simulateur/device) = `prebuild` + `run:ios/android`, puis `--dev-client`
- Ne jamais mélanger les deux sur le même device

### Jest + pnpm Monorepo — react-native Singleton

**Symptom**: `__fbBatchedBridgeConfig is not set, cannot invoke native modules` when running
Jest tests that render components from workspace packages (`@financial-app/ui`, `@financial-app/features`).

**Root cause**: pnpm creates separate copies of `react-native` when peer dependency contexts
differ (e.g. `@babel/core@7.28.5` vs `@babel/core@7.29.0`). The Jest preset (`preset: 'react-native'`)
mocks internal RN modules (`Text`, `View`, `ScrollView`, etc.) only for the copy resolved from
the **app's** `node_modules`. But workspace packages resolve a **different** copy → no mocks → crash.

**Diagnosis**:
```bash
# List react-native copies — more than 1 = problem
ls node_modules/.pnpm/ | grep "^react-native@"

# Check which copy the app resolves
pnpm --filter <app> exec node -e "console.log(require.resolve('react-native/package.json'))"

# Check which copy a workspace package resolves
pnpm --filter <app> exec node -e "console.log(require.resolve('react-native', { paths: ['../../packages/ui/src/'] }))"
```

**Fix**: force all react-native imports to the app's copy via `moduleNameMapper` in `jest.config.js`:

```js
const rnRoot = path.dirname(require.resolve('react-native/package.json'))

module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native$': rnRoot,
    '^react-native/(.*)$': `${rnRoot}/$1`,
    // Same pattern for other native singletons:
    '^react-native-svg$': '<rootDir>/jest.mocks/react-native-svg.js',
    '^twrnc$': '<rootDir>/jest.mocks/twrnc.js',
  },
}
```

Mock files go in `<app>/jest.mocks/` — simple stubs returning `View` or proxy objects.

**Key insight**: if tests work everywhere else (standalone projects, CI examples, RNTL docs),
the problem is YOUR setup, not Jest or RN. Investigate the resolution chain, don't accept
"it can't work" as an answer.

References:
- [callstack/react-native-testing-library #1559](https://github.com/callstack/react-native-testing-library/issues/1559)
- RN 0.81 `jest/setup.js` mocks internals via `m#` module map — only applies to one copy
- RN 0.81 `jest/react-native-env.js` sets `customExportConditions = ['require', 'react-native']`
- RN 0.85 moves the preset to `@react-native/jest-preset` (dedicated package)

### Android Emulator — Keyboard Layout

Expo managed launches directly into the app — there's no app drawer to reach Settings.

To change the keyboard layout (e.g. QWERTY → AZERTY):

```bash
# Open keyboard settings directly
adb shell am start -a android.settings.INPUT_METHOD_SETTINGS
```

Then: **Gboard → Languages → Add French** (or your preferred layout).

### Simulator Management

- Close simulator between app switches (Metro port conflict)
- Only one Metro bundler at a time
- Use `ios:sim` for bare RN CLI to avoid targeting physical devices

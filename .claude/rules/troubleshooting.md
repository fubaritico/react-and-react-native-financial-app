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

### Simulator Management

- Close simulator between app switches (Metro port conflict)
- Only one Metro bundler at a time
- Use `ios:sim` for bare RN CLI to avoid targeting physical devices

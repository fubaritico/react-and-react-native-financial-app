# mobile-expo-ejected

React Native application with **Expo (bare workflow)** — project "ejected" via `expo prebuild`.

## Stack

- **Expo SDK 54**
- **React Native 0.81.5**
- **TypeScript**
- **Native code exposed** (ios/ and android/)

## Commands

All commands are run from the **monorepo root**.

### Dev (Expo Go — JS only)

Use these for quick iteration on JS code. Runs via Expo Go — no native build required, but no custom icon, splash screen, or native modules.

```bash
# Start Metro bundler
pnpm --filter mobile-expo-ejected start

# Launch on iOS via Expo Go
pnpm --filter mobile-expo-ejected ios

# Launch on Android via Expo Go
pnpm --filter mobile-expo-ejected android
```

### Build (native binary — full app experience)

Use these when you need the real app: custom icon, splash screen, native modules, or testing on a physical device. Compiles a native binary via Xcode/Gradle using the existing `ios/` and `android/` folders.

```bash
# Build and run on iOS simulator
pnpm --filter mobile-expo-ejected ios:build

# Build and run on physical iPhone (prompts for device selection)
pnpm --filter mobile-expo-ejected ios:build:device

# Build and run on Android emulator
pnpm --filter mobile-expo-ejected android:build

# Build and run on physical Android device
pnpm --filter mobile-expo-ejected android:build:device
```

## Difference with mobile-expo (managed)

| Aspect | mobile-expo (managed) | mobile-expo-ejected (bare) |
|--------|----------------------|---------------------------|
| ios/android folders | Hidden | Exposed |
| Custom native modules | Limited | Possible |
| Expo Go | Yes | No (native build required) |
| Complexity | Simple | More complex |
| Expo SDK | Available | Available |

## Difference with mobile (pure React Native CLI)

| Aspect | mobile (RN CLI) | mobile-expo-ejected |
|--------|-----------------|---------------------|
| Expo SDK | No | Yes |
| Config via app.json | No | Yes |
| Regenerable | No | Yes (`npx expo prebuild`) |
| Initial setup | Manual | Automated |

## Regenerate native code

If you modify `app.json` (name, icon, permissions...), you can regenerate:

```bash
npx expo prebuild --clean
```

Warning: this overwrites manual modifications in `ios/` and `android/`.

## Structure

```
mobile-expo-ejected/
├── App.tsx          # Entry point
├── app.json         # Expo configuration
├── ios/             # Native Xcode project
├── android/         # Native Gradle project
├── assets/
├── package.json
└── tsconfig.json
```

## When to use this workflow?

- You need **custom native modules**
- You want to **modify native iOS/Android code**
- You want to keep **Expo advantages** (SDK, centralized config)

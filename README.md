# React & React Native Financial App

A cross-platform **Personal Finance** application (Frontend Mentor challenge) built on a shared design system targeting React Native (Expo) and React web (React Router), managed with **pnpm workspaces**.

### Technologies

React Native · Expo SDK 54 · React · TypeScript · pnpm · Turborepo · twrnc · Tailwind CSS · Style Dictionary · CVA · Supabase · Jotai · TanStack Query · Expo Router · react-hook-form · zod

---

## Table of Contents

- [Project Structure](#project-structure)
- [Packages](#packages)
- [Prerequisites](#prerequisites)
- [Environment Setup (macOS)](#environment-setup-macos)
- [Main Commands](#main-commands)
- [How the Monorepo Works](#how-the-monorepo-works)
- [React Native Version Alignment (0.81.5)](#react-native-version-alignment-0815)
- [Troubleshooting](#troubleshooting)

---

## Project Structure

```
react-and-react-native-financial-app/
├── package.json            # Monorepo root config
├── pnpm-workspace.yaml     # pnpm workspaces + catalog
├── turbo.json              # Turborepo task pipeline
├── apps/
│   ├── mobile-expo/        # Expo SDK 54 (canonical mobile app)
│   ├── web/                # React Router v7 + Vite (SSR)
│   ├── mobile/             # Bare React Native CLI (learning reference)
│   └── mobile-expo-ejected/ # Ejected Expo (learning reference)
├── packages/
│   ├── tokens/             # @financial-app/tokens — Style Dictionary (DTCG)
│   ├── tailwind-config/    # @financial-app/tailwind-config — shared Tailwind config
│   ├── icons/              # @financial-app/icons — cross-platform SVG icon library
│   ├── ui/                 # @financial-app/ui — cross-platform design system
│   └── shared/             # @financial-app/shared — auth, types, utils, atoms
└── scripts/                # Utility scripts (reset, changelogs)
```

[Back to top](#table-of-contents)

---

## Packages

### Apps

| App | Path | Status | Description |
|-----|------|--------|-------------|
| `mobile-expo` | `apps/mobile-expo/` | Active | Expo managed (SDK 54) — canonical mobile app, primary focus |
| `web` | `apps/web/` | Active | React Router v7 + Vite with SSR |
| `mobile` | `apps/mobile/` | Active | Bare React Native CLI — learning reference |
| `mobile-expo-ejected` | `apps/mobile-expo-ejected/` | Active | Expo bare/ejected — learning reference |
| `api` | `apps/api/` | Planned | Express REST API (OpenAPI + zod-to-openapi) |

### Shared Packages

| Package | Path | Status | Description |
|---------|------|--------|-------------|
| `@financial-app/tokens` | `packages/tokens/` | Active | Style Dictionary (DTCG) — colors, spacing, typography, radii |
| `@financial-app/tailwind-config` | `packages/tailwind-config/` | Active | Shared Tailwind config consuming token outputs |
| `@financial-app/icons` | `packages/icons/` | Active | Cross-platform SVG icon library — type-safe `<Icon name="..." />` component |
| `@financial-app/ui` | `packages/ui/` | Active | Cross-platform design system (file extension split: `.native.tsx` / `.web.tsx`) |
| `@financial-app/shared` | `packages/shared/` | Active | Auth (Supabase), Jotai atoms, domain types, utils |
| `@financial-app/http-client` | `packages/http-client/` | Planned | HeyAPI client consuming the Express REST API |

### Dependency Graph

```
@financial-app/tokens           -> depends on nothing
@financial-app/icons            -> depends on nothing (react-native-svg is a peer dep)
@financial-app/tailwind-config  -> @financial-app/tokens
@financial-app/ui               -> @financial-app/tokens, @financial-app/tailwind-config, @financial-app/icons
@financial-app/shared           -> depends on nothing (pure TS, no renderer)
apps/*  (mobile, web)           -> @financial-app/ui, @financial-app/shared, @financial-app/icons
```

[Back to top](#table-of-contents)

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm**: `npm install -g pnpm`
- **Ruby** (v3.1.x recommended): for CocoaPods (iOS)
- **Xcode** (macOS): for iOS
- **Android Studio**: for Android

[Back to top](#table-of-contents)

---

## Environment Setup (macOS)

This section details the steps to configure the React Native development environment on macOS.

### 1. Install pnpm

```bash
npm install -g pnpm
```

### 2. Install Ruby 3.1 via rbenv

The system Ruby version (2.6) is too old for CocoaPods. Ruby 3.4+ can also cause compatibility issues. **Ruby 3.1.x is recommended.**

```bash
# Install rbenv
brew install rbenv

# Install Ruby 3.1.4
rbenv install 3.1.4

# Set as global version
rbenv global 3.1.4

# Add rbenv to shell (once only)
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && source ~/.zshrc

# Verify version
ruby -v  # Should display ruby 3.1.4
```

### 3. Configure Xcode (iOS)

```bash
# Select Xcode as the active build tool
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Open Xcode at least once to accept the license and install additional components (iOS simulators).

### 4. Configure Android Studio (Android)

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio -> **More Actions** -> **Virtual Device Manager**
3. Create an emulator (e.g. Pixel 7, API 34)

Configure environment variables:

```bash
# Java 17 (required by Gradle 9)
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Android SDK
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

Verify:

```bash
java -version   # Should display openjdk 17.x.x
adb --version   # Should display Android Debug Bridge
```

### 5. Install project dependencies

```bash
# From the monorepo root
pnpm install
```

### 6. Install iOS Pods

```bash
# In apps/mobile
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

### 7. Run the app

```bash
# Start Metro (in a dedicated terminal)
pnpm --filter mobile-financial-app start

# In another terminal:
pnpm --filter mobile-financial-app ios      # iOS (simulator)
pnpm --filter mobile-financial-app android  # Android (emulator must be running)
```

[Back to top](#table-of-contents)

---

## Main Commands

All orchestrated commands use **Turborepo** for caching and correct dependency ordering.

### Install & build

```bash
pnpm install       # Install all dependencies
pnpm build         # Build all packages (tokens → tailwind-config → ui → apps)
pnpm tokens        # Rebuild token outputs only
pnpm icons         # Regenerate icon data from SVGs
```

### Development

```bash
pnpm dev           # Start all dev servers in parallel

# Or run individual apps:
pnpm --filter mobile-expo-financial-app start   # Expo (press i/a for iOS/Android)
pnpm --filter web-financial-app dev             # Web (React Router dev server)
pnpm --filter mobile-financial-app start        # Bare RN CLI (Metro bundler)
```

### Quality checks

```bash
pnpm type-check    # TypeScript --noEmit across all packages
pnpm lint          # ESLint across all packages
pnpm test          # Jest tests across all packages
```

### Cleanup

```bash
pnpm reset         # Full clean + reinstall + pod install + token rebuild
pnpm clean         # Remove all node_modules
pnpm clean:build   # Remove all build/dist outputs
```

[Back to top](#table-of-contents)

---

## How the Monorepo Works

### pnpm workspaces + Turborepo

The monorepo uses **pnpm workspaces** for dependency management and **Turborepo** for task orchestration.

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
```

Turborepo ensures tasks run in the correct dependency order with caching:

```
pnpm build → tokens → tailwind-config → ui → shared → web (parallel where possible)
```

Cached tasks replay instantly — a full `pnpm type-check` with warm cache runs in ~30ms.

### Add a dependency to a package

```bash
# Add a dependency to a specific package
pnpm --filter mobile-expo-financial-app add <package-name>

# Add a dev dependency
pnpm --filter mobile-expo-financial-app add -D <package-name>
```

### Add a dependency to the root (shared tools)

```bash
pnpm add -w -D <package-name>
```

### Cross-platform component architecture

UI components use a **file extension split** pattern — shared types + CVA variants with platform-specific implementations:

```
packages/ui/src/components/Button/
  Button.tsx           # Types + props interface only (no JSX)
  Button.native.tsx    # React Native implementation (twrnc)
  Button.web.tsx       # DOM/HTML implementation (Tailwind CSS + cn())
  index.ts             # Native barrel (Metro picks this)
  index.web.ts         # Web barrel (Vite picks this)
```

Styling: **twrnc** on native, **Tailwind CSS** on web. Shared variant logic via **CVA** (class-variance-authority).

[Back to top](#table-of-contents)

---

## React Native Version Alignment (0.81.5)

### Why React Native 0.81.5?

This monorepo contains multiple apps:
- **`mobile`**: React Native CLI (without Expo)
- **`mobile-expo`**: Expo managed (SDK 54)
- **`mobile-expo-ejected`**: Expo bare/ejected
- **`ui`**: Shared components with `twrnc` (Tailwind for RN)

**Expo SDK 54 requires React Native 0.81.x**. To avoid multiple version conflicts in the monorepo (which cause "Invalid hook call" errors and crashes), all apps must use the **same React Native version**.

### The Problem Encountered

Initially, `mobile` used RN 0.82.1 (latest version) while Expo SDK 54 used RN 0.81.5. This caused:
- **3 versions of react-native** in `node_modules/.pnpm`
- "Invalid hook call" errors due to multiple React instances
- Android crashes with `library "libreact_featureflagsjni.so" not found`

### The Solution

#### 1. Force a single version with pnpm overrides

In the root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "react-native": "0.81.5",
      "@react-native/babel-plugin-codegen": "0.81.5",
      "@react-native/babel-preset": "0.81.5",
      "@react-native/codegen": "0.81.5",
      "@react-native/js-polyfills": "0.81.5",
      "@react-native/metro-babel-transformer": "0.81.5",
      "@react-native/metro-config": "0.81.5"
    }
  }
}
```

#### 2. Align versions in each package.json

In `apps/mobile/package.json`, `apps/mobile-expo/package.json`, etc.:

```json
{
  "dependencies": {
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@react-native-community/cli": "20.0.0",
    "@react-native/babel-preset": "0.81.5",
    "@react-native/metro-config": "0.81.5",
    "@react-native/typescript-config": "0.81.5"
  }
}
```

#### 3. Regenerate the Android folder (if created with a different version)

If the `android/` folder was created with RN 0.82, it contains incompatible files. Solution:

```bash
cd apps/mobile
mv android android_backup
npx @react-native-community/cli init mobile --version 0.81.5 --skip-install --directory temp_mobile
mv temp_mobile/android .
rm -rf temp_mobile
```

### Useful Cleanup Commands

#### Check installed versions

```bash
# See how many react-native versions are installed
ls node_modules/.pnpm | grep "^react-native@0"

# Check version in a package
cat apps/mobile/node_modules/react-native/package.json | grep version
```

#### Full cleanup and reinstall

```bash
# Remove lockfile and reinstall
rm pnpm-lock.yaml
pnpm clean && pnpm install
```

#### iOS Cleanup

```bash
cd apps/mobile/ios
rm -rf build Pods Podfile.lock
pod install
```

#### Android Cleanup

```bash
# Remove builds and Gradle caches
rm -rf apps/mobile/android/build
rm -rf apps/mobile/android/app/build
rm -rf apps/mobile/android/.gradle
rm -rf ~/.gradle/caches

# Uninstall app from emulator
adb uninstall com.mobile

# Rebuild
pnpm --filter mobile-financial-app android
```

#### Reset Metro

```bash
npx react-native start --reset-cache
```

### Android Debugging

To view Android crash logs:

```bash
# Clear old logs
adb logcat -c

# Record logs to file
adb logcat > /tmp/crash.log

# (Launch the crashing app, then Ctrl+C)

# View errors
grep -A 10 "FATAL EXCEPTION" /tmp/crash.log
```

[Back to top](#table-of-contents)

---

## Troubleshooting

### General (iOS & Android)

#### "Unable to resolve module" error in simulator/emulator

In a pnpm monorepo, dependencies are hoisted to the root. Metro must be configured to find them.

The `apps/mobile/metro.config.js` file must include:

```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const monorepoRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

After modification, restart Metro (`Ctrl + C` then `pnpm --filter mobile-financial-app start`).

---

### iOS

#### `xcodebuild` requires Xcode

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

#### `pod: command not found` or CocoaPods errors

Use Bundler (installed locally in the project):

```bash
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

#### Ruby / `kconv` / `securerandom` errors

Install Ruby 3.1.x via rbenv (see section 2 above).

#### "No script URL provided" error when launching the app

Metro is not started. Run in a separate terminal:

```bash
pnpm --filter mobile-financial-app start
```

Then reload the app in the simulator (`Cmd + R`).

---

### Android

#### "Gradle requires JVM 17 or later" error

Gradle 9 requires Java 17 minimum. Install and configure Java 17:

```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

Verify: `java -version` should display `openjdk 17.x.x`.

#### "adb: command not found" error

The Android SDK is not in the PATH:

```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

#### "Included build node_modules/@react-native/gradle-plugin does not exist" error

In a pnpm monorepo, some React Native dependencies are not installed by default. Add the missing dependencies:

```bash
pnpm --filter mobile-financial-app add -D @react-native/gradle-plugin@0.82.1 @react-native/codegen@0.82.1
```

#### "Unable to load script" or white screen error

Metro is not started or the app is not connected.

1. Start Metro in a separate terminal:
   ```bash
   pnpm --filter mobile-financial-app start
   ```

2. Relaunch the app:
   ```bash
   pnpm --filter mobile-financial-app android
   ```

3. Or reload in the emulator: press `R` twice.

[Back to top](#table-of-contents)

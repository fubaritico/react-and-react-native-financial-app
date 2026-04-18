# React & React Native Financial App

Monorepo for React Native applications, managed with **pnpm workspaces**.

## Project Structure

```
react-native/
├── package.json            # Monorepo root config
├── pnpm-workspace.yaml     # pnpm workspaces declaration
├── .gitignore              # Git ignored files
├── README.md               # This file
├── apps/                   # Applications
│   ├── mobile/             # React Native CLI app (without Expo)
│   ├── mobile-expo/        # React Native app with Expo (canonical)
│   └── mobile-expo-ejected/ # Ejected Expo app
└── packages/               # Shared packages
    └── ui/      # @financial-app/ui
```

## Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm**: `npm install -g pnpm`
- **Ruby** (v3.1.x recommended): for CocoaPods (iOS)
- **Xcode** (macOS): for iOS
- **Android Studio**: for Android

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

## Main Commands

### Install dependencies (all packages)

```bash
pnpm install
```

### Run a script in a specific package

```bash
pnpm --filter <package-name> <script>
```

Examples:

```bash
# Start the Metro bundler for the mobile app
pnpm --filter mobile-financial-app start

# Launch the app on Android
pnpm --filter mobile-financial-app android

# Launch the app on iOS
pnpm --filter mobile-financial-app ios
```

## How the Monorepo Works

### pnpm workspaces

The `pnpm-workspace.yaml` file declares the monorepo packages:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**Advantages:**

- **Centralized dependencies**: pnpm installs everything in a single root `node_modules` (with symlinks).
- **Code sharing**: packages can import from each other.
- **Unified commands**: everything is managed from the root with `pnpm --filter`.

### Add a dependency to a package

```bash
# Add a dependency to the "mobile" package
pnpm --filter mobile-financial-app add <package-name>

# Add a dev dependency
pnpm --filter mobile-financial-app add -D <package-name>
```

### Add a dependency to the root (shared tools)

```bash
pnpm add -w -D <package-name>
```

## Planned Packages

| Package | Description |
|---------|-------------|
| `mobile` | React Native CLI app (without Expo) |
| `mobile-expo` | React Native app with Expo |
| `shared` | (optional) Shared code between apps |

## Next Steps

1. ~~Create the `packages/` folder~~ Done
2. ~~Initialize the React Native CLI project in `apps/mobile`~~ Done
3. Add an Expo project in `apps/mobile-expo`
4. Create a `shared` package for shared code

---
title: Troubleshooting Guide
type: note
permalink: financial-app/troubleshooting-guide
tags:
- debugging
- reference
- onboarding
---

# Troubleshooting Guide

For advanced troubleshooting (Jest singleton issues, Expo mode switching, simulator management, disk space cleanup), see `.claude/rules/troubleshooting.md`.

## General (iOS & Android)

### "Unable to resolve module" error in simulator/emulator

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

### "Unable to load script" or white screen / splash screen stuck

Metro is not running or the emulator can't reach it.

If you used a `rebuild` command, Metro is started automatically — check the output for `Metro is ready (PID ...)`. If you used a regular `run` command, start Metro manually:

```bash
# Terminal 1: start Metro
pnpm mobile:start   # or pnpm expo:start

# Terminal 2: build + launch
pnpm mobile:android  # or pnpm expo:android
```

If Metro is running but the emulator still can't connect, forward the port:

```bash
adb reverse tcp:8081 tcp:8081
```

Then reload in the emulator: press `R` twice.

## iOS

### `xcodebuild` requires Xcode

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### `pod: command not found` or CocoaPods errors

Use Bundler (installed locally in the project):

```bash
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

### Ruby / `kconv` / `securerandom` errors

Install Ruby 3.1.x via rbenv.

### "No script URL provided" error when launching the app

Metro is not started. Run in a separate terminal:

```bash
pnpm mobile:start
```

Then reload the app in the simulator (`Cmd + R`).

## Android

### "Gradle requires JVM 17 or later" error

Gradle 9 requires Java 17 minimum. Install and configure Java 17:

```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

Verify: `java -version` should display `openjdk 17.x.x`.

### "adb: command not found" error

The Android SDK is not in the PATH:

```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

### "Could not find org.asyncstorage.shared_storage:storage-android:1.0.0"

AsyncStorage v3 ships its Android artifact via a local Maven repo, not Maven Central. The project's `android/build.gradle` must include:

```gradle
allprojects {
    repositories {
        maven {
            url = uri(project(":react-native-async-storage_async-storage").file("local_repo"))
        }
    }
}
```

Already configured in `apps/mobile/android/build.gradle`. If you see this error after a fresh clone or reset, verify the block is present.

### "Included build node_modules/@react-native/gradle-plugin does not exist" error

In a pnpm monorepo, some React Native dependencies are not installed by default:

```bash
pnpm --filter mobile-financial-app add -D @react-native/gradle-plugin@0.82.1 @react-native/codegen@0.82.1
```

### Any other Android build failure

When in doubt, use the rebuild command — it handles all cache layers:

```bash
pnpm mobile:rebuild:android        # bare RN CLI
pnpm expo:rebuild:android          # Expo managed
```

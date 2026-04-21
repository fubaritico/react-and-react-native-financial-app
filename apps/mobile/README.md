# Mobile (Bare React Native CLI)

> **Status: On standby** — React Navigation is set up (5 bottom tabs + auth stack)
> with placeholder screens. Work is paused here while the canonical Expo app
> (`apps/mobile-expo`) gets the overview page and auth wired first.
> This app will be aligned once those features are stable.

Bare React Native CLI app — kept as a learning reference to compare React Navigation
(imperative, config-based) vs Expo Router (file-based) with the same shared UI components.

## Navigation Structure

```
RootNavigator (auth gate — bypassed for now)
├── TabNavigator (bottom tabs)
│   ├── Overview
│   ├── Transactions
│   ├── Budgets
│   ├── Pots
│   └── Recurring Bills
└── AuthStack (native stack — commented out)
    ├── Login
    └── Signup
```

## Scripts

Run from monorepo root:

```bash
pnpm mobile:pods             # install CocoaPods deps (after adding native packages)
pnpm mobile:start            # start Metro bundler
pnpm mobile:ios              # build and run on iOS simulator
pnpm mobile:android          # build and run on Android emulator
pnpm mobile:ios:device       # build and run on physical iPhone
pnpm mobile:rebuild:ios      # clean build + pod install + run iOS
pnpm mobile:rebuild:android  # clean build + run Android
```

Or from `apps/mobile`:

```bash
pnpm start
pnpm ios
pnpm android
```

## Known Issue

After adding `react-native-screens` (React Navigation dependency), you must run
`pnpm mobile:pods` then `pnpm mobile:rebuild:ios` to link the native module.
Without this, the app shows `Unimplemented component: <RNSScreenNavigationContainer>`.

## Prerequisites

- Xcode with iOS simulator runtime
- Android Studio with emulator (optional)
- CocoaPods (`gem install cocoapods` or via Homebrew)
- See [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment)

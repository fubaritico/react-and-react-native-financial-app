---
title: Fix — Expo Native/JS Bundle Desync
type: note
permalink: fix-expo-native-js-desync
tags: [fix, expo, debugging, how-to]
---

# Fix — Expo Native/JS Bundle Desync

## Observations

- [symptom] `Cannot find native module 'ExpoLinking'` or similar missing native module errors
- [symptom] `getDevServer is not a function (it is Object)` — metro-runtime vs expo-router version mismatch
- [cause] JS bundle was updated (new packages installed) but native binary is stale — missing new native modules
- [cause] pnpm catalog or manual install pinned wrong version — SDK 54 needs exact ranges
- [diagnosis] Run `npx expo install --check` — shows misaligned packages
- [fix-step-1] `npx expo install --fix` — align all Expo deps to current SDK version
- [fix-step-2] `npx expo prebuild --clean` — regenerate ios/ and android/ with new native modules
- [fix-step-3] `npx expo run:ios` — build and install fresh binary on simulator
- [principle] NEVER attempt Metro resolver shims for version mismatches — fix the version, not the resolver
- [principle] Always run `--check` after adding ANY Expo dependency — catches drift immediately
- [real-case] pnpm catalog had `expo-router: "~4.0.22"` but SDK 54 requires `~6.0.23` — old v4 had ESM/CJS interop issues with RN 0.81

## Relations

- diagnosed_by [[Expo SDK Alignment Lessons]]
- related_to [[Metro Config Monorepo Lessons]]

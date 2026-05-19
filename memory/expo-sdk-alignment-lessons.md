---
title: Expo SDK Alignment Lessons
type: note
permalink: expo-sdk-alignment-lessons
tags: [lesson, expo, debugging]
---

# Expo SDK Alignment Lessons

## Observations

- [lesson] Expo SDK versions pin exact ranges for all Expo packages — mixing versions causes runtime crashes
- [lesson] pnpm catalog had `expo-router: "~4.0.22"` but SDK 54 requires `expo-router@~6.0.23` — caused ESM/CJS interop issues with RN 0.81
- [lesson] `@expo/metro-runtime` must match SDK version — old v4 had module format mismatches
- [fix] Always run `npx expo install --check` after adding Expo dependencies to verify alignment
- [fix] When native modules go missing: `npx expo install --fix` then `npx expo prebuild --clean && npx expo run:ios`
- [symptom] `getDevServer is not a function (it is Object)` — version mismatch between metro-runtime and expo-router
- [symptom] `Cannot find native module 'ExpoLinking'` — JS bundle updated but native binary is stale
- [principle] Do NOT attempt Metro resolver shims for version mismatches — fix the version, not the resolver
- [principle] When Expo prebuild output (ios/, android/) exists, `expo start` switches to dev-client mode — QR code stops working with Expo Go
- [constraint] React pinned to 19.1.x — Expo SDK 54 renderer requires it, don't upgrade until SDK upgrade

## Relations

- related_to [[Metro Config Monorepo Lessons]]
- related_to [[pnpm Singleton Debugging]]
- constrains [[Storybook Architecture]]

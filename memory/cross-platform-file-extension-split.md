---
title: Cross-Platform File Extension Split
type: note
permalink: cross-platform-file-extension-split
tags: [decision, architecture, components]
---

# Cross-Platform File Extension Split

## Observations

- [decision] Every UI component uses file extension split: .native.tsx for React Native, .web.tsx for DOM
- [reason] twrnc and Tailwind CSS have fundamentally different APIs — tw`` template literals vs className strings
- [reason] React Native and DOM have different primitive elements (View/Text vs div/span) — no shared JSX possible
- [pattern] ComponentName.tsx holds ONLY types and interfaces — no JSX, no runtime code
- [pattern] ComponentName.variants.ts holds CVA — platform-agnostic class strings consumed by both implementations
- [pattern] ComponentName.styles.ts has three exports: `shared` (both), `web` (hover/focus/transition), `native` (RN layout quirks)
- [lesson] Vite resolves `.web.tsx` before `.tsx` — so barrel files MUST use explicit extensions for type imports to avoid circular resolution
- [lesson] `@storybook/react-native-web-vite` adds `.native.tsx` to resolve.extensions — ambiguous `./Component` resolves to native instead of types file
- [lesson] Never export runtime values from the types file (.tsx) — Vite picks up .web.tsx first causing circular imports
- [lesson] Constants that need sharing between native and web go in a separate `.constants.ts` file
- [consequence] Each component has 6-8 files minimum — but the separation prevents renderer leaks and keeps each platform idiomatic

## Relations

- caused_by [[Why twrnc Over NativeWind]]
- resolved_by [[Barrel File Resolution Rules]]
- validated_by [[Cross-Platform Import Safety]]

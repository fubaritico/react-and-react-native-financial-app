---
title: Why twrnc Over NativeWind
type: note
permalink: why-twrnc-over-nativewind
tags: [decision, styling, architecture]
---

# Why twrnc Over NativeWind

## Observations

- [decision] Chose twrnc + Tailwind CSS v3 for styling instead of NativeWind v5 + Tailwind CSS v4
- [reason] NativeWind v5 explicitly states "not intended for production use" as of April 2026
- [reason] twrnc depends on `tailwindcss/resolveConfig` which is the TW v3 JS config API — stable and proven
- [reason] NativeWind v5 targets TW v4 which dropped the JS config API entirely — breaking change for the ecosystem
- [tradeoff] twrnc requires file extension split (.native.tsx / .web.tsx) since it can't share `className` across platforms
- [tradeoff] NativeWind v5 would eliminate the file extension split — single `className` prop for both platforms
- [risk] Known NativeWind v5 issues: classnames not generating, migration difficulties from v4 to v5
- [prerequisite] Expo SDK 54 ships RN 0.81 + Reanimated v4 — technical prerequisites for NativeWind v5 ARE met, but library stability is not
- [future] Revisit when NativeWind v5 hits stable release — migration skill `migrate-to-nativewind-v5` already drafted
- [consequence] File extension split means every component has 6+ files — more boilerplate but clear separation of concerns

## Relations

- led_to [[Cross-Platform File Extension Split]]
- depends_on [[Token Pipeline Architecture]]
- future_migration [[NativeWind v5 Migration Plan]]

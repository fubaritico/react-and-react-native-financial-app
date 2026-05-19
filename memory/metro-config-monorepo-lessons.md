---
title: Metro Config Monorepo Lessons
type: note
permalink: metro-config-monorepo-lessons
tags: [lesson, metro, monorepo, react-native]
---

# Metro Config Monorepo Lessons

## Observations

- [lesson] Metro must watch the entire monorepo root — `config.watchFolders = [monorepoRoot]`
- [lesson] `nodeModulesPaths` must include both app and root node_modules for pnpm resolution
- [lesson] Source extensions must prioritize `.native.tsx` before `.tsx` for correct platform resolution
- [lesson] `resolver.resolveRequest` override needed to force singleton resolution for packages that pnpm duplicates
- [lesson] `.lottie` files must be added to `assetExts` — Metro doesn't know binary animation formats
- [gotcha] pnpm hoists differently than npm/yarn — Metro can't find packages without explicit `nodeModulesPaths`
- [gotcha] React Native's module resolution assumes flat node_modules — pnpm's virtual store breaks this assumption
- [gotcha] TanStack Query option factories called at module top level fire before `useConfigureHttpClient` sets `baseUrl` on Android — queries hit `localhost` which emulator can't reach. Always call inside component body.
- [fix] Android emulator: `10.0.2.2` maps to host `localhost` but only IPv4 — Node must bind `0.0.0.0` not default (which may be IPv6 `::1`)
- [fix] `"usesCleartextTraffic": true` in `app.json` under `android` for HTTP requests to `10.0.2.2`

## Relations

- caused_by [[pnpm Singleton Debugging]]
- affects [[Android Emulator Networking]]
- configures [[Cross-Platform File Extension Split]]

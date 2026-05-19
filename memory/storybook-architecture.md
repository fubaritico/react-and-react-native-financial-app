---
title: Storybook Architecture
type: note
permalink: storybook-architecture
tags: [decision, tooling, storybook]
---

# Storybook Architecture

## Observations

- [decision] Storybook lives in standalone `apps/storybook/` — NOT inside `packages/ui/`
- [reason] Separates concerns — UI package stays focused on components, Storybook is a dev tool
- [framework] `@storybook/react-native-web-vite` — renders BOTH web and native components in browser via react-native-web
- [pattern] Web stories import from `@financial-app/ui` (resolves to web barrel), native stories from `@financial-app/ui/native`
- [gotcha] Framework adds `.native.tsx` to `resolve.extensions` — ambiguous imports resolve to native instead of types file
- [fix] ALL barrel files use explicit extensions: `export type { IProps } from './Component.tsx'`
- [gotcha] Storybook v10 built-in backgrounds addon NOT available with react-native-web-vite framework
- [fix] Custom decorator in `preview.ts` sets `document.body.style.backgroundColor` directly from `parameters.backgrounds`
- [gotcha] `typescript: { reactDocgen: false }` required — react-docgen chokes on RN Flow syntax in node_modules
- [config] Three Vite aliases (regex) route `@financial-app/ui` subpaths correctly
- [config] `server.fs.allow: [workspaceRoot]` — Vite needs filesystem access to packages/ outside apps/storybook
- [constraint] React version pinned to 19.1.x — Expo SDK 54 renderer requires it, don't upgrade

## Relations

- renders [[Cross-Platform File Extension Split]]
- blocked_by [[Vite Resolution Gotchas]]
- uses [[React Native Web]]

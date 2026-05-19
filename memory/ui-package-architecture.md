---
title: UI Package Architecture
type: note
permalink: ui-package-architecture
tags: [architecture, design-system, components]
---

# UI Package Architecture

## Observations

- [package] `@financial-app/ui` at `packages/ui/`
- [structure] Atomic Design: atoms/ molecules/ organisms/ templates/ under `src/components/`
- [exports] Platform routing via package.json exports map: `"react-native"` -> `./src/index.ts`, `"default"` -> `./src/index.web.ts`
- [barrel] Two barrels per component: `index.ts` (Metro/native), `index.web.ts` (Vite/web)
- [barrel] Two top-level barrels: `src/index.ts` (native), `src/index.web.ts` (web)
- [barrel-rule] ALL barrel imports use explicit paths — `./Button.native`, `./Button.web`, `./Button.tsx`
- [barrel-rule] Never re-export variants or styles — they are internal
- [alias] `#Atoms`, `#Molecules`, `#Organisms`, `#Templates`, `#Lib` — tsconfig path aliases
- [alias-rule] `.native.tsx` imports bare `#Atoms` (resolves to native barrel)
- [alias-rule] `.web.tsx` MUST import `#Atoms/index.web` (explicit web barrel) — bare `#Atoms` pulls native code
- [reference] Build pipeline adapted from `vite-mf-monorepo/packages/ui/` — tsup + tsc + Tailwind CSS
- [peer-deps] react, react-native, react-native-svg — installed by consuming apps
- [i18n] Zero i18n dependency — components receive translated strings as props

## Relations

- implements [[Cross-Platform File Extension Split]]
- implements [[Why Atomic Design]]
- implements [[Styling — The Five Layers]]
- contains [[Typography Component]]
- contains [[BottomSheet Touch System Lessons]]
- contains [[Icons Data-Driven Approach]]
- referenced_from [[Copy/Adapt Workflow]]

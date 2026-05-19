---
title: Barrel File Resolution Rules
type: note
permalink: barrel-file-resolution-rules
tags: [pattern, architecture, vite, metro, gotcha]
---

# Barrel File Resolution Rules

## Observations

- [problem] Vite's `resolve.extensions` does NOT apply to package entry points — only file-level imports
- [problem] `@storybook/react-native-web-vite` adds `.native.tsx` to resolve.extensions — `./Component` resolves to `Component.native.tsx` instead of `Component.tsx`
- [solution] ALL barrel file imports use explicit extensions — no ambiguous `./ComponentName`
- [pattern] Component import: `export { Button } from './Button.native'` or `./Button.web'`
- [pattern] Type import: `export type { IButtonProps } from './Button.tsx'` — explicit `.tsx`
- [pattern] Never re-export variants — internal to the component
- [rule] Never export runtime values (const, function, object) from the types file (.tsx) — Vite resolves `.web.tsx` before `.tsx` causing circular import
- [rule] Shared runtime constants go in `.constants.ts` — imported by both .native.tsx and .web.tsx
- [gotcha] ESLint `import/order`: bare `#Atoms` (no slash) doesn't match `#Atoms/**` pathGroup — sorts after `type` group. `#Atoms/index.web` (with slash) matches — stays in `internal` group.
- [gotcha] Workspace packages exporting raw TS need `ssr.noExternal` in Vite config — otherwise Vite SSR treats them as Node externals and feeds untransformed TS to ESM loader

## Relations

- solves [[Cross-Platform File Extension Split]]
- affects [[Storybook Architecture]]
- affects [[UI Package Architecture]]
- caused_by [[Vite Resolution Gotchas]]

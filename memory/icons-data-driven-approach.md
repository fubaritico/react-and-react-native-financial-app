---
title: Icons — Data-Driven Approach
type: note
permalink: icons-data-driven-approach
tags: [decision, architecture, icons]
---

# Icons — Data-Driven Approach

## Observations

- [decision] Icons use a data-driven build: SVGs parsed into a single `iconData.ts` map at build time
- [reason] No `svg-to-jsx` dependency needed — simple regex parser handles single-path SVGs
- [pattern] Build script (`script/generate-icon-data.js`) parses SVGs from `src/assets/` into `src/generated/iconData.ts`
- [pattern] `iconData.ts` uses discriminated union: `IconPathData` (standard) vs `IconCircleData` (type: 'circle')
- [pattern] `IconName` type derived from `as const` array — full autocomplete in consumers
- [pattern] `<Icon name="..." />` reads from data map at runtime — no SVG imports needed per component
- [decision] UI components accept `icon?: IconName` (string) instead of `ReactNode` for simple icons
- [decision] TextInput has both `icon?: IconName` (simple prefix) and `trailingElement?: ReactNode` (interactive, e.g. password toggle)
- [reason] String-based icon prop is simpler for consumers, prevents misuse, and enables tree-shaking
- [dependency] `react-native-svg` is a peer dep — must be installed in consuming apps

## Relations

- consumed_by [[UI Component Props Pattern]]
- built_by [[Icon Build Script]]

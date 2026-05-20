---
title: SVG Import Pipeline
type: note
permalink: financial-app/svg-import-pipeline
tags:
- svg
- pipeline
- bundler
- metro
- vite
- storybook
---

# SVG Import Pipeline

## Context
SVG assets (flags, icons) live in `@financial-app/shared/assets/` and need to be imported as React components across 3 bundlers with different configurations.

## Setup per Bundler

### Metro (mobile-expo)
- Uses `react-native-svg-transformer/expo` as `babelTransformerPath`
- SVG removed from `assetExts`, added to `sourceExts`
- Import: `import EnFlag from '@financial-app/shared/assets/en-flag.svg'`
- Returns `FC<SvgProps>` from `react-native-svg`

### Vite (web app)
- Uses `vite-plugin-svgr` plugin
- Import: `import EnFlag from '@financial-app/shared/assets/en-flag.svg?react'`
- The `?react` suffix is required
- Returns `FC<SVGProps<SVGSVGElement>>`

### Storybook
- **Cannot use vite-plugin-svgr** — `@storybook/react-native-web-vite` converts SVGs to data-URI strings before any normal plugin runs
- Custom Vite plugin `svgComponentPlugin()` with `enforce: 'pre'` intercepts `.svg` loads in the `load` hook (not `transform`)
- Wraps SVG content in a `<span dangerouslySetInnerHTML>` via `createElement`
- Must be first in the plugins array

## Type Declarations
- Root `svg.d.ts` declares both `*.svg` (→ `FC<SvgProps>`) and `*.svg?react` (→ `FC<SVGProps<SVGSVGElement>>`)
- Included in all app tsconfigs + `packages/features/src/svg.d.ts`

## Package Exports
- `@financial-app/shared` package.json has `"./assets/*": "./src/assets/*"`

## Key Gotcha
- Storybook's framework plugin runs before normal Vite plugins — even with `enforce: 'pre'` on vite-plugin-svgr, the framework's asset handler wins. The custom plugin works because it uses the `load` hook (earlier in Vite's pipeline than `transform`).

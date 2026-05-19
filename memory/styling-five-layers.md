---
title: Styling — The Five Layers
type: note
permalink: styling-five-layers
tags: [architecture, styling, design-system]
---

# Styling — The Five Layers

## Observations

- [layer-1] Tokens — `packages/tokens/src/*.json` — designers edit this, single source of truth for all design values
- [layer-2] Tailwind Config — `packages/tailwind-config/index.js` — consumes token build output, generates class names
- [layer-3] Variants — `ComponentName.variants.ts` — CVA, root element only, cross-platform safe classes
- [layer-4] Styles — `ComponentName.styles.ts` — inner elements, three exports: shared + web + native
- [layer-5] Components — `*.native.tsx` / `*.web.tsx` — consume variants + styles, render platform-specific JSX
- [rule] Never skip layers — never reference colors/spacing that aren't from tokens
- [rule] Variants handle the root element, styles handle inner elements
- [native] twrnc singleton initialized with `resolveConfig(@financial-app/tailwind-config)` — never inline theme
- [native] Use template literals: `tw\`bg-primary rounded-md px-4\``
- [web] `cn()` is the ONLY way to compose classNames — clsx + tailwind-merge, never string concatenation
- [web] Always start with CVA output, then add web-only classes via cn()
- [never] Never mix `StyleSheet.create()` with tw — pick one per component
- [never] Never import cn() in .native.tsx files
- [never] Never import tw in .web.tsx files

## Relations

- built_on [[Token Pipeline Architecture]]
- uses [[Why CVA for Variants]]
- uses [[Why twrnc Over NativeWind]]
- implements [[Cross-Platform File Extension Split]]
- taught_by [[Component Design Lessons]]

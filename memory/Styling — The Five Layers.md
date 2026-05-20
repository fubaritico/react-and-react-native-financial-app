---
title: Styling — The Five Layers
type: note
permalink: financial-app/styling-the-five-layers
tags:
- architecture
- styling
- design-system
- features
- priority
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
- [scope] Applies to BOTH `packages/ui/` AND `packages/features/` — same pattern, no exception. Feature components (ScreenViews, cards, form contents) follow the exact same file structure and styling rules as UI components.
- [priority] **PRIMORDIAL** — `packages/ui/` and `packages/features/` components MUST follow the 5 layers with zero tolerance. These are the reusable building blocks. No inline styles, no shortcuts, no excuses.
- [priority] App route files (`apps/*/app/`, `apps/*/routes/`) — styling rigor remains important but inline style objects are acceptable for navigator config props (`tabBarStyle`, `tabBarBackground`) and one-off layout overrides that are not reusable components. This does NOT mean low quality — structure, JSDoc, memoization, and all other rules still apply fully.
- [native] twrnc singleton initialized with `resolveConfig(@financial-app/tailwind-config)` — never inline theme
- [native] Use template literals: `tw\`bg-primary rounded-md px-4\``
- [native] Native components use `tw` for all styles — never `StyleSheet.create()` when `tw` is the styling approach
- [web] `cn()` is the ONLY way to compose classNames — clsx + tailwind-merge, never string concatenation
- [web] Always start with CVA output, then add web-only classes via cn()
- [never] Never mix `StyleSheet.create()` with tw — pick one per component
- [never] Never import cn() in .native.tsx files
- [never] Never import tw in .web.tsx files
- [never] Never use inline style objects `style={{ ... }}` in `packages/ui/` or `packages/features/` when tw classes exist for the same purpose

## Relations

- built_on [[Token Pipeline Architecture]]
- uses [[Why CVA for Variants]]
- uses [[Why twrnc Over NativeWind]]
- implements [[Cross-Platform File Extension Split]]
- taught_by [[Component Design Lessons]]

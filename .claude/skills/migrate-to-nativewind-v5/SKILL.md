---
name: migrate-to-nativewind-v5
description: Migrate from twrnc + Tailwind v3 to NativeWind v5 + Tailwind v4. Use when NativeWind v5 reaches stable release and the team decides to switch styling approach. Covers dependency swap, config migration, component refactor, and token output update.
allowed-tools: Read Write Edit Bash(pnpm:*) Bash(npx:*) Bash(ls:*) WebSearch WebFetch
paths:
  - packages/ui/**
  - packages/tokens/**
  - packages/tailwind-config/**
  - apps/mobile-expo/**
metadata:
  author: financial-app
  version: "0.1"
  status: draft
---

# Migrate to NativeWind v5

Migrate the styling stack from twrnc + Tailwind CSS v3 to NativeWind v5 + Tailwind CSS v4.

**Status**: DRAFT — Do NOT execute until NativeWind v5 is stable (not pre-release).

Before starting, check the latest NativeWind v5 release status:
- https://www.nativewind.dev/v5
- https://github.com/nativewind/nativewind/releases

## Prerequisites Check

Verify these are met before proceeding:

- [ ] NativeWind v5 is marked as **stable** (not preview/pre-release)
- [ ] Expo SDK 54+ (we have SDK 54 — RN 0.81, Reanimated v4)
- [ ] React Native 0.81+ (ships with Expo SDK 54)
- [ ] react-native-reanimated v4+ (ships with Expo SDK 54)
- [ ] No critical open issues for NativeWind v5 + Expo SDK 54

## What Changes

| Aspect | Before (twrnc) | After (NativeWind v5) |
|--------|----------------|----------------------|
| Styling API | `style={tw\`...\`}` | `className="..."` |
| Config format | `tailwind.config.js` (JS) | `global.css` with `@theme` (CSS) |
| Tailwind version | v3 | v4.1+ |
| Build approach | Runtime parsing | Build-time compilation (PostCSS) |
| Component split | `.native.tsx` + `.web.tsx` required | Could share single file for many components |
| CVA consumption | `tw\`${variants()}\`` | `className={variants()}` — same as web |
| Pseudo-classes | Not supported in twrnc | `hover:`, `active:`, `focus:`, `dark:` work |
| CSS variables | Not available | Full support via `@theme` |
| Token output | JS map (`tailwind.tokens.js`) | CSS `@theme` (`theme.css`) |

## Phase 1 — Dependencies

### Remove
```bash
pnpm --filter @financial-app/ui remove twrnc
```

### Install
```bash
npx expo install tailwindcss@^4 nativewind@latest react-native-css react-native-reanimated react-native-safe-area-context
pnpm --filter @financial-app/ui add -D @tailwindcss/postcss postcss
```

### Pin lightningcss
Add to `apps/mobile-expo/package.json` overrides:
```json
{
  "overrides": {
    "lightningcss": "1.x.x"
  }
}
```
Check NativeWind docs for exact version — deserialization errors occur without pinning.

## Phase 2 — Configuration

### Create postcss.config.mjs
In `apps/mobile-expo/`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

### Create/update global.css
In `apps/mobile-expo/`:
```css
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);

@import "@financial-app/tokens/css";

@theme {
  /* Token-driven theme — imported from @financial-app/tokens/tailwind */
}
```

### Update Metro config
```js
const { getDefaultConfig } = require("expo/metro-config")
const { withNativewind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)
module.exports = withNativewind(config)
```

### Remove babel NativeWind plugin (if any)
NativeWind v5 does NOT use a Babel plugin. Remove any `nativewind/babel` from babel.config.js.

### TypeScript
Create `nativewind-env.d.ts`:
```ts
/// <reference types="react-native-css/types" />
```

## Phase 3 — Token Output Update

Update `packages/tokens/sd.config.js`:
- Replace `javascript/tailwind-map` format with `css/tailwind-theme` format
- Output `@theme { --color-primary: #hex; ... }` instead of JS map
- Keep native output unchanged (still needed for direct RN style access)

Update `packages/tailwind-config/`:
- Switch from JS config (`tailwind.config.js` extending token JS map) to CSS-first config
- May be able to simplify or remove this package if `@theme` in global.css suffices

## Phase 4 — Component Migration

### Remove tw singleton
Delete `packages/ui/src/lib/tw.ts` (the twrnc instance).

### Migrate .native.tsx files
For each component, replace:
```tsx
// Before (twrnc)
import { tw } from '../../lib/tw'
<View style={tw`${buttonVariants({ variant })}`}>

// After (NativeWind v5)
<View className={buttonVariants({ variant })}>
```

### Evaluate file extension split
NativeWind v5 uses `className` on both web and native. Many components may no longer
need separate `.native.tsx` / `.web.tsx` files. Evaluate case by case:

- **Can merge**: components where the only difference is styling API (`tw` vs `className`)
- **Must keep split**: components with platform-specific behavior (gestures, haptics, native APIs)
- **Web-only additions**: `hover:`, `focus:`, `transition-` can now go in shared CVA variants
  since NativeWind handles them natively

### Update CVA variant rules
With NativeWind v5, pseudo-classes work on native. Update `.claude/rules/styling.md`:
- `hover:`, `active:`, `focus:` may be allowed in shared variants
- `transition-`, `shadow-` may work — test each one

## Phase 5 — Cleanup

- [ ] Remove `twrnc` from pnpm catalog
- [ ] Remove `tailwindcss/resolveConfig` usage
- [ ] Remove `packages/ui/src/lib/tw.ts`
- [ ] Update `.claude/rules/styling.md` — new allowed/forbidden classes
- [ ] Update `.claude/rules/design-system.md` — new component template
- [ ] Update `.claude/rules/tokens.md` — new output format
- [ ] Update CLAUDE.md tech stack table
- [ ] Run `pnpm type-check && pnpm lint && pnpm test`
- [ ] Test on iOS simulator and Android emulator
- [ ] Test web build

## Gotchas

- NativeWind v5 removes the JSX transform — replaced by import rewrite system
- Do NOT import global.css in the same file as `AppRegistry.registerComponent` (breaks Fast Refresh)
- `cssInterop` / `remapProps` only needed for third-party components, not your own
- FlatList needs `remapProps` for `contentContainerStyle` className support
- NativeWind auto-merges with inline `style` prop — inline styles take precedence
- Pin `lightningcss` version or you'll get deserialization errors
- Metro config: `withNativewind(config)` — no second argument needed in v5 (unlike v4)

## Resources

- NativeWind v5 docs: https://www.nativewind.dev/v5
- Installation: https://www.nativewind.dev/v5/getting-started/installation
- Migration from v4: https://www.nativewind.dev/v5/guides/migrate-from-v4
- Custom components: https://www.nativewind.dev/v5/guides/custom-components
- Third-party components: https://www.nativewind.dev/v5/guides/third-party-components
- Expo SDK 54 issues: https://github.com/nativewind/nativewind/discussions/1617

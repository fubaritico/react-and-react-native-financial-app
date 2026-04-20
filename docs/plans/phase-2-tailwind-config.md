# Phase 2 — Shared Tailwind Config Package

## Goal

Create a single `@financial-app/tailwind-config` package that consumes the token
build outputs and provides the Tailwind theme to all apps. After this phase,
no app or package should define its own colors or spacing — they all extend
this shared config.

## Status: TODO (requires Phase 0 complete — Phase 0 done ✅)

---

## Step 2.1 — Create packages/tailwind-config/

### packages/tailwind-config/package.json
```json
{
  "name": "@financial-app/tailwind-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "@financial-app/tokens": "workspace:^"
  }
}
```

### packages/tailwind-config/index.js

CJS format — Tailwind CSS v3 `resolveConfig` and twrnc both expect CJS configs.
The file uses `.js` extension inside a package without `"type": "module"`, so
Node treats it as CJS regardless of root package.json.

Consumes the **alias layer** via the `./tailwind` subpath export — these are
the flat, consumer-facing names (`primary`, `background`, `green`, etc.).
Base (`base-*`) and semantic (`semantic-*`) keys are intentionally excluded
to keep the public API clean.

```js
const tokens = require('@financial-app/tokens/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: tokens.color,
    borderRadius: tokens.radius,
    spacing: tokens.spacing,
    fontFamily: {
      sans: tokens.font['family-sans'].split(', '),
    },
    fontSize: {
      xs:   tokens.font['size-xs'],
      sm:   tokens.font['size-sm'],
      base: tokens.font['size-base'],
      lg:   tokens.font['size-lg'],
      xl:   tokens.font['size-xl'],
      '2xl': tokens.font['size-2xl'],
      '3xl': tokens.font['size-3xl'],
      '4xl': tokens.font['size-4xl'],
    },
    fontWeight: {
      normal: tokens.font['weight-normal'],
      bold:   tokens.font['weight-bold'],
    },
    lineHeight: {
      tight:  tokens.font['lineHeight-tight'],
      normal: tokens.font['lineHeight-normal'],
    },
  },
}
```

> **Note on `theme` vs `theme.extend`**: We use `theme` (replace) not `theme.extend`
> because our tokens are the complete design system. This prevents accidental use
> of default Tailwind values not in our design system. twrnc's `resolveConfig`
> merges this correctly.

> **Note on `base-*` and `semantic-*` color keys**: The tailwind token output
> includes all three layers (base, semantic, alias). Only the alias layer
> (flat names without prefix) should be used in classes. If consumers need
> the full set, they can import tokens directly.

---

## Step 2.2 — Update packages/ui/src/lib/tw.ts

```ts
import { create } from 'twrnc'
import resolveConfig from 'tailwindcss/resolveConfig'
import baseConfig from '@financial-app/tailwind-config'

export const tw = create(resolveConfig(baseConfig))
```

Remove all hardcoded color/theme values from this file.

---

## Step 2.3 — Install and Verify

```bash
pnpm install

# Verify tw instance resolves correct colors
# Boot apps/mobile-expo and confirm colors render correctly
pnpm --filter mobile-expo-financial-app start
```

---

## Step 2.4 — Future: App-Level Configs

When `apps/web` is created (Phase 4), it will have its own `tailwind.config.js`
that extends this shared config and adds `content` paths:

```js
const baseConfig = require('@financial-app/tailwind-config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.web.tsx',
  ],
}
```

No NativeWind preset — we use twrnc on native, Tailwind CSS on web.

---

## Completion Criteria

- [ ] `packages/tailwind-config/` exists with package.json + index.js
- [ ] `index.js` consumes `@financial-app/tokens/build/tailwind/` alias layer
- [ ] All token categories mapped: colors, spacing, radius, font family/size/weight/lineHeight
- [ ] `packages/ui/src/lib/tw.ts` uses shared config via `resolveConfig`
- [ ] No hardcoded hex values remain in any tailwind config or tw.ts
- [ ] Mobile app boots and colors render correctly
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes

## Next

→ docs/plans/phase-3-design-system.md

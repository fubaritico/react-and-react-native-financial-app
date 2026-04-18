# Phase 2 — Shared Tailwind Config Package

## Goal

Create a single `@financial-app/tailwind-config` package that consumes the token
build outputs and provides the Tailwind theme to all apps. After this phase,
no app or package should define its own colors or spacing — they all extend
this shared config.

## Status: TODO (requires Phase 1 complete)

---

## Step 2.1 — Create packages/tailwind-config/

```bash
mkdir packages/tailwind-config
```

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
```js
const tokens = require('@financial-app/tokens/build/tailwind/tailwind.tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:     tokens.colorPrimary500,
        'primary-dark': tokens.colorPrimary600,
        secondary:   tokens.colorSecondary500,
        destructive: tokens.colorDestructive500,
        surface:     tokens.colorNeutral0,
        background:  tokens.colorNeutral100,
        'text-muted': tokens.colorNeutral600,
      },
      borderRadius: {
        sm:   tokens.radiusSm,
        md:   tokens.radiusMd,
        lg:   tokens.radiusLg,
        xl:   tokens.radiusXl,
        full: tokens.radiusFull,
      },
    },
  },
};
```

> Note: Token key names come from Style Dictionary's js transform group
> (camelCase of the token path). Verify exact names from build/tailwind/tailwind.tokens.js
> after Phase 1 build before writing this file.

---

## Step 2.2 — Update apps/mobile/tailwind.config.js

Replace current hardcoded config:
```js
const baseConfig = require('@financial-app/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
};
```

---

## Step 2.3 — Update packages/ui/tailwind.config.js

```js
const baseConfig = require('@financial-app/tailwind-config');

module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
};
```

---

## Step 2.4 — Update packages/ui/src/lib/tw.ts

```ts
import { create } from 'twrnc';
import resolveConfig from 'tailwindcss/resolveConfig';
import baseConfig from '@financial-app/tailwind-config';

export const tw = create(resolveConfig(baseConfig));
```

Remove all hardcoded color/theme values from this file.

---

## Step 2.5 — Install and Verify

```bash
pnpm install

# Verify tw instance resolves correct colors
# Boot apps/mobile and confirm primary color still renders correctly
pnpm --filter mobile-financial-app start
```

---

## Completion Criteria

- [ ] `packages/tailwind-config/` exists
- [ ] `index.js` consumes `@financial-app/tokens/build/tailwind/`
- [ ] `apps/mobile/tailwind.config.js` extends `@financial-app/tailwind-config`
- [ ] `packages/ui/tailwind.config.js` extends `@financial-app/tailwind-config`
- [ ] `packages/ui/src/lib/tw.ts` uses shared config
- [ ] No hardcoded hex values remain in any tailwind.config.js or tw.ts
- [ ] Mobile app boots and colors render correctly

## Next

→ docs/plans/phase-3-ui.md

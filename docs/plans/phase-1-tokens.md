# Phase 1 — Token Pipeline (Style Dictionary)

## Goal

Replace all hardcoded color/spacing values across the monorepo with a single
Style Dictionary source in `packages/tokens/`. After this phase, no package
should contain raw hex values or numeric spacing values in its config.

## Current Problem

Colors are hardcoded in 4 places:
- `packages/ui/src/lib/tw.ts`
- `packages/ui/tailwind.config.js`
- `apps/mobile/tailwind.config.js`
- `apps/web/tailwind.config.js` (future)

## Status: TODO (requires Phase 0 complete)

---

## Step 1.1 — Create packages/tokens/

Use command: `/add-package tokens lib`

Additional setup beyond standard package scaffold:

```bash
pnpm --filter @financial-app/tokens add -D style-dictionary
```

---

## Step 1.2 — Create Token Source Files

### packages/tokens/src/base/color.json
```json
{
  "color": {
    "primary": {
      "500": { "value": "#6200EE" },
      "600": { "value": "#5000CC" }
    },
    "secondary": {
      "500": { "value": "#03DAC6" }
    },
    "neutral": {
      "0":   { "value": "#FFFFFF" },
      "100": { "value": "#F3F4F6" },
      "600": { "value": "#6B7280" },
      "900": { "value": "#1A1A2E" }
    },
    "destructive": {
      "500": { "value": "#EF4444" }
    }
  }
}
```

### packages/tokens/src/base/spacing.json
```json
{
  "spacing": {
    "1":  { "value": "4px" },
    "2":  { "value": "8px" },
    "3":  { "value": "12px" },
    "4":  { "value": "16px" },
    "5":  { "value": "20px" },
    "6":  { "value": "24px" },
    "8":  { "value": "32px" },
    "10": { "value": "40px" }
  }
}
```

### packages/tokens/src/base/radius.json
```json
{
  "radius": {
    "sm":   { "value": "4px" },
    "md":   { "value": "8px" },
    "lg":   { "value": "12px" },
    "xl":   { "value": "16px" },
    "full": { "value": "9999px" }
  }
}
```

### packages/tokens/src/semantic/color.semantic.json
```json
{
  "color": {
    "background": {
      "app":     { "value": "{color.neutral.100}" },
      "surface": { "value": "{color.neutral.0}" },
      "primary": { "value": "{color.primary.500}" }
    },
    "text": {
      "default": { "value": "{color.neutral.900}" },
      "muted":   { "value": "{color.neutral.600}" },
      "inverse": { "value": "{color.neutral.0}" },
      "primary": { "value": "{color.primary.500}" }
    }
  }
}
```

---

## Step 1.3 — Create sd.config.js

```js
const StyleDictionary = require('style-dictionary');

// Custom transform: strip px unit for React Native (needs unitless numbers)
StyleDictionary.registerTransform({
  name: 'size/native',
  type: 'value',
  matcher: (token) => ['spacing', 'radius'].includes(token.attributes.category),
  transformer: (token) => parseFloat(token.value),
});

StyleDictionary.registerTransformGroup({
  name: 'react-native',
  transforms: ['attribute/cti', 'name/cti/camel', 'size/native', 'color/hex'],
});

module.exports = {
  source: ['src/**/*.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'build/tailwind/',
      files: [{ destination: 'tailwind.tokens.js', format: 'javascript/es6' }],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'variables.css', format: 'css/variables',
        options: { outputReferences: true } }],
    },
    native: {
      transformGroup: 'react-native',
      buildPath: 'build/native/',
      files: [{ destination: 'tokens.native.js', format: 'javascript/es6' }],
    },
  },
};
```

---

## Step 1.4 — Update packages/tokens/package.json scripts

```json
{
  "scripts": {
    "build": "style-dictionary build --config sd.config.js",
    "watch": "style-dictionary build --config sd.config.js --watch"
  },
  "exports": {
    ".": { "import": "./src/index.ts" },
    "./build/*": "./build/*"
  }
}
```

---

## Step 1.5 — Build and Verify

```bash
/build-tokens

# Verify outputs
ls packages/tokens/build/js/
ls packages/tokens/build/tailwind/
ls packages/tokens/build/css/
ls packages/tokens/build/native/
```

---

## Completion Criteria

- [ ] `packages/tokens/` exists with correct structure
- [ ] All 4 token categories in src/base/
- [ ] Semantic aliases in src/semantic/
- [ ] `pnpm --filter @financial-app/tokens build` succeeds
- [ ] All 4 build outputs generated
- [ ] `packages/tokens/build/` in .gitignore

## Next

→ docs/plans/phase-2-tailwind-config.md

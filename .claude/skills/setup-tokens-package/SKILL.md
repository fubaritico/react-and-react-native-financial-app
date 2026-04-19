---
name: setup-tokens-package
description: Scaffold the @financial-app/tokens package from scratch — Style Dictionary DTCG pipeline with CSS vars, Tailwind map, JS/TS exports, and RN native values. Use when creating the tokens package, setting up the design token pipeline, or starting Phase 0.
allowed-tools: Read Write Edit Bash(pnpm:*) Bash(mkdir:*) Bash(ls:*)
paths:
  - packages/tokens/**
metadata:
  author: financial-app
  version: "1.0"
---

# Setup Tokens Package

Scaffold `packages/tokens/` — the single source of truth for all design values.

Based on a proven reference implementation. Read `references/sd-config-template.md` for the
Style Dictionary config template and `references/token-sources.md` for all token JSON templates.

## Prerequisites

Before starting, read:
- `.claude/rules/tokens.md` — token rules and conventions
- `.claude/rules/styling.md` — how tokens flow into the styling layer

## Steps

### 1. Create directory structure

```
packages/tokens/
  src/
    base/
      color.json            # raw palette — hex values only
      spacing.json          # dimension scale (rem-based)
      typography.json       # font families, sizes, weights, line heights
      radius.json           # border radius scale
      shadow.json           # box shadow scale (web-only token, still useful for reference)
    semantic/
      color.semantic.json   # aliases referencing base tokens via {path}
    aliases/
      color.aliases.json    # flat names for Tailwind class consumption
  build/                    # GENERATED — gitignored, never hand-edit
  sd.config.js              # Style Dictionary v4 config with custom formats + transforms
  package.json
  .gitignore
  README.md
```

### 2. Create package.json

```json
{
  "name": "@financial-app/tokens",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./build/ts/tokens.d.ts",
        "default": "./build/js/tokens.js"
      }
    },
    "./css": "./build/css/variables.css",
    "./tailwind": "./build/tailwind/tailwind.tokens.js",
    "./native": "./build/native/tokens.native.js"
  },
  "react-native": "./build/native/tokens.native.js",
  "scripts": {
    "clean": "rm -rf build",
    "build": "pnpm clean && style-dictionary build --config sd.config.js",
    "watch": "style-dictionary build --config sd.config.js --watch"
  },
  "devDependencies": {
    "style-dictionary": "catalog:"
  }
}
```

Add `style-dictionary` to the pnpm catalog in `pnpm-workspace.yaml` if not already there.

### 3. Create .gitignore

```
build/
```

### 4. Create sd.config.js

Read `references/sd-config-template.md` for the full template.

Key requirements:
- `usesDtcg: true` — tokens use `$value` / `$type` format
- **5 output platforms**: css, tailwind, js, ts, native
- **Custom format** `css/variables-flat` — `:root {}` CSS custom properties
- **Custom format** `typescript/tokens` — nested TS object with `as const`
- **Custom format** `javascript/tailwind-map` — CommonJS module exporting a flat `{ 'color-name': '#hex' }` map for Tailwind v3 `theme.extend`
- **Custom transform** `size/native` — strips units from spacing/radius for React Native (`"1rem"` -> `16`, `"0.5rem"` -> `8`)
- Source glob: `src/**/*.json`

### 5. Create token source files

Read `references/token-sources.md` for all JSON templates.

Adapt colors to the financial app design (from the Frontend Mentor challenge spec).
If the exact colors are unknown, use the reference palette as a starting point — it can be updated later.

Token conventions:
- All base tokens use raw values (hex for colors, rem for dimensions)
- Semantic tokens use aliases: `{ "$value": "{color.base.neutral.900}", "$type": "color" }`
- Alias tokens flatten semantic paths for Tailwind: `"primary": { "$value": "{color.semantic.primary.default}" }`
- Every token MUST have `$type`

### 6. Create README.md

Short README covering:
- What the package is
- Directory structure
- Build command
- Usage examples (CSS import, JS/TS import, Tailwind config, RN native)
- Token categories summary

### 7. Install and build

```bash
pnpm install
pnpm --filter @financial-app/tokens build
```

### 8. Verify outputs

Confirm these files were generated:
- `packages/tokens/build/css/variables.css`
- `packages/tokens/build/tailwind/tailwind.tokens.js`
- `packages/tokens/build/js/tokens.js`
- `packages/tokens/build/ts/tokens.ts`
- `packages/tokens/build/native/tokens.native.js`

### 9. Validate

- [ ] All base colors are hex values, never aliases
- [ ] Semantic tokens use `{path}` aliases, never raw hex
- [ ] Alias tokens reference semantic tokens, never base
- [ ] `build/` is gitignored
- [ ] All 5 output platforms generate successfully
- [ ] Native output has unitless numbers for spacing/radius
- [ ] Package exports work: `import { tokens } from '@financial-app/tokens'`
- [ ] Run `pnpm type-check && pnpm lint && pnpm test` from root

## Gotchas

- Style Dictionary v4 uses `$value` / `$type` (DTCG). Do NOT use v3 `value` format.
- The `usesDtcg: true` flag in sd.config.js is mandatory for `$value`/`$type` parsing.
- `build/` is always gitignored. CI must run the build command.
- The native transform must handle both `rem` and `px` units.
- Tailwind output is a JS map (not CSS `@theme`), because this project uses Tailwind CSS v3, not v4.
- Layer order: tokens -> tailwind-config -> ui -> apps. Never skip.
- Add `style-dictionary` to the pnpm catalog before installing.

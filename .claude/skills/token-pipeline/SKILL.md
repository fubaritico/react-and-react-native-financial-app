---
name: token-pipeline
description: Manage the Style Dictionary token pipeline — create, edit, validate, and build design tokens (colors, spacing, typography, radii). Use when working with tokens, design values, theming, or the DTCG format.
allowed-tools: Read Write Edit Bash(pnpm:*) Bash(ls:*)
paths:
  - packages/tokens/**
metadata:
  author: financial-app
  version: "1.0"
---

# Token Pipeline

Manage the Style Dictionary token pipeline for @financial-app/tokens.

Before starting, read [the token rules](../../../.claude/rules/tokens.md).

## Source of Truth

ALL design values originate in `packages/tokens/src/**/*.json`. Never define design values anywhere else.

## Directory Structure

```
packages/tokens/
  src/
    base/
      color.json          # raw palette — hex values only
      spacing.json        # numeric scale in px
      typography.json     # font sizes, weights, line heights
      radius.json         # border radius scale
    semantic/
      color.semantic.json # aliases referencing base tokens
  build/                  # GENERATED — gitignored
  sd.config.js
  package.json
```

## Token JSON Format (DTCG-compatible)

```json
{
  "color": {
    "primary": {
      "500": { "value": "#6200EE" }
    }
  }
}
```

## Semantic Alias Format

```json
{
  "color": {
    "background": {
      "button": {
        "primary": { "value": "{color.primary.500}" }
      }
    }
  }
}
```

## Workflows

### Adding a New Token

1. Edit the appropriate `packages/tokens/src/base/*.json` file
2. If semantic, add alias in `packages/tokens/src/semantic/*.json`
3. Build: `pnpm --filter @financial-app/tokens build`
4. Verify outputs exist (js, tailwind, css, native)
5. Token is immediately available in all consuming packages

### Creating sd.config.js

Four required output platforms:
1. **js** -> `build/js/tokens.js` + `tokens.d.ts`
2. **tailwind** -> `build/tailwind/tailwind.tokens.js`
3. **css** -> `build/css/variables.css`
4. **native** -> `build/native/tokens.native.js` (unitless numbers for RN)

Must include a custom native transform for spacing (`"16px"` -> `16`).

## Validation

- [ ] All colors are hex values in base files
- [ ] Semantic tokens use aliases `{category.name.scale}`, never raw hex
- [ ] `build/` is gitignored
- [ ] All four output platforms generate successfully
- [ ] No hardcoded colors/spacing in app configs

## Gotchas

- `build/` is always gitignored — CI must run build first
- Rebrand = edit `base/color.json` only, then rebuild
- Layer order: tokens -> tailwind-config -> ui -> apps (never skip)
- Package exports must expose `./build/*` path for consumers

# Rules — Token Pipeline (Style Dictionary)

## Source of Truth

ALL design values (colors, spacing, radii, typography) originate in:
`packages/tokens/src/**/*.json`

Never define design values anywhere else. If a value is needed, add it here first.

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
  build/                  # GENERATED — gitignored, never hand-edit
    js/
      tokens.js
      tokens.d.ts
    tailwind/
      tailwind.tokens.js
    css/
      variables.css
    native/
      tokens.native.js
  sd.config.js
  package.json
```

## Token JSON Format (DTCG-compatible)

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
      "900": { "value": "#1A1A2E" }
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
    },
    "text": {
      "inverse": { "value": "{color.neutral.0}" }
    }
  }
}
```

## Build Commands

```bash
# Build all token outputs
pnpm --filter @monorepo/tokens build

# Watch mode during development
pnpm --filter @monorepo/tokens watch

# Must run before building tailwind-config or design-system
```

## sd.config.js Outputs

Four required platforms:
1. **js** → `build/js/tokens.js` + `tokens.d.ts` — consumed by design-system
2. **tailwind** → `build/tailwind/tailwind.tokens.js` — consumed by tailwind-config
3. **css** → `build/css/variables.css` — consumed by web app
4. **native** → `build/native/tokens.native.js` — unitless numbers for RN

## Custom Native Transform (required in sd.config.js)

```js
StyleDictionary.registerTransform({
  name: 'size/native',
  type: 'value',
  matcher: (token) => token.attributes.category === 'spacing',
  transformer: (token) => parseFloat(token.value), // "16px" → 16
});
```

## .gitignore (add to root)

```
packages/tokens/build/
```

## Rules

- build/ is always gitignored — CI must run `pnpm --filter @monorepo/tokens build` first
- Rebrand = edit base/color.json only, then rebuild
- Semantic tokens MUST use aliases `{category.name.scale}` — never raw hex values
- Package exports must expose `./build/*` path for consumers

# @financial-app/tokens

Design tokens for the personal finance app, built with [Style Dictionary](https://styledictionary.com/).

Single source of truth for all design values — consumed by `@financial-app/tailwind-config`, `@financial-app/ui`, and both apps.

## Structure

```
src/
├── base/
│   ├── color.json          # Raw palette from Figma (not for direct use)
│   ├── spacing.json        # Spacing scale (0.25rem increments)
│   ├── radius.json         # Border radius scale
│   └── typography.json     # Font family, sizes, weights, line heights, text presets
├── semantic/
│   └── color.semantic.json # UI role mappings (use these in components)
└── aliases/
    └── color.aliases.json  # Flat names for Tailwind classes
```

## Build

```bash
pnpm build
```

This generates:

- `build/css/variables.css` — CSS custom properties
- `build/tailwind/tailwind.tokens.js` — Tailwind v3 JS map for `theme.extend`
- `build/js/tokens.js` — JavaScript ES6 exports
- `build/ts/tokens.ts` — TypeScript nested object with `as const`
- `build/native/tokens.native.js` — React Native values (unitless numbers)

## Usage

### In CSS (web app)

```css
@import '@financial-app/tokens/css';

.my-component {
  background: var(--color-background);
  color: var(--color-foreground);
}
```

### In Tailwind config

```js
const tokens = require('@financial-app/tokens/tailwind')

module.exports = {
  theme: {
    extend: {
      colors: tokens.color,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
    },
  },
}
```

### In JavaScript/TypeScript

```typescript
import { tokens } from '@financial-app/tokens'

const primaryColor = tokens.color.primary
```

### In React Native

```js
const tokens = require('@financial-app/tokens/native')

const styles = { padding: tokens.spacing[4] } // 16 (unitless)
```

## Token Categories

### Colors

- **Base**: Raw palette from Figma — beige, grey, 15 secondary/other colors
- **Semantic**: UI roles — background, foreground, nav, transaction, recurring, destructive, success, warning
- **Aliases**: Flat Tailwind names — `bg-primary`, `text-foreground-muted`, `bg-theme-cyan`, etc.

### Spacing

Figma scale (50–500: 4px–40px) plus standard Tailwind increments from `0` to `96` (24rem).

### Radius

Border radius scale: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`.

### Typography

- **Family**: Public Sans (variable)
- **Size**: xs to 4xl
- **Weight**: normal (400), bold (700)
- **Line Height**: tight (1.2), normal (1.5)
- **Text Presets**: 1–5 matching Figma design system (with bold variants for 4 and 5)

---
name: new-component
description: Create a new cross-platform component in @financial-app/ui following the file extension split pattern (types, native, web, variants, index). Use when creating a UI component, adding a design system component, or scaffolding a new component.
allowed-tools: Read Write Bash(pnpm:*)
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: "2.0"
---

# New Component

Create a cross-platform component in `packages/ui/src/components/`.

Before starting, read [the design system rules](../../../.claude/rules/design-system.md) and [the styling rules](../../../.claude/rules/styling.md).

## Arguments

`$ARGUMENTS` = ComponentName (PascalCase, e.g. `Button`, `Avatar`, `Card`)

## Atomic Design Placement

Determine the correct atomic level before creating files:

- **atoms/** — indivisible elements, no internal UI dependency
- **molecules/** — compose atoms
- **organisms/** — autonomous sections, compose molecules
- **templates/** — page layouts

Atoms NEVER import from molecules/organisms/templates. Molecules NEVER import from organisms/templates.

## Steps

### 1. Create variant file (colocated in component folder)

`packages/ui/src/components/{level}/$Name/$Name.variants.ts`

```ts
import { cva } from 'class-variance-authority'

export const $nameVariants = cva(
  'base-classes-safe-for-both-platforms',
  {
    variants: {
      variant: {
        primary: '...',
        secondary: '...',
      },
      size: {
        sm: '...',
        md: '...',
        lg: '...',
      },
      disabled: { true: 'opacity-50' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)
```

FORBIDDEN in variants: `hover:*`, `focus:*`, `active:*`, `transition-*`, `cursor-*`, `shadow-*`, `ring-*`, `outline-*`.

### 2. Create types file

`packages/ui/src/components/{level}/$Name/$Name.tsx`

- Export the Props interface and NOTHING else
- No JSX, no runtime code, no renderer imports
- NEVER re-export variants — they are internal
- NEVER export runtime values (const, function, object) — causes circular imports with Vite

```ts
import type { VariantProps } from 'class-variance-authority'
import type { $nameVariants } from './$Name.variants'

export interface I$NameProps extends VariantProps<typeof $nameVariants> {
  /** Description of prop */
  onPress: () => void
}
```

### 3. Create native implementation

`packages/ui/src/components/{level}/$Name/$Name.native.tsx`

- Use Pressable, Text, View from react-native
- Use `tw\`${$nameVariants({ ...variantProps })}\`` for styles
- All text via `<Typography>` — no bare `<Text>`
- No HTML elements, no cn(), no StyleSheet

```tsx
import { Pressable } from 'react-native'
import { tw } from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'
import { $nameVariants } from './$Name.variants'
import type { I$NameProps } from './$Name'

export function $Name({ onPress, variant, size, disabled }: I$NameProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={tw`${$nameVariants({ variant, size, disabled })}`}
    >
      <Typography variant="body">...</Typography>
    </Pressable>
  )
}
```

### 4. Create web implementation

`packages/ui/src/components/{level}/$Name/$Name.web.tsx`

- Use HTML semantic elements (button, div, span, etc.)
- Use `cn($nameVariants({ ...variantProps }), 'web-only-classes')`
- All text via `<Typography>` — no bare `<p>/<span>/<h1>`
- No RN imports, no StyleSheet, no tw``
- Web-only classes allowed here: hover:, focus:, transition-, cursor-, shadow-

```tsx
import { cn } from '../../../lib/cn'
import { Typography } from '../../atoms/Typography/Typography.web'
import { $nameVariants } from './$Name.variants'
import type { I$NameProps } from './$Name'

export function $Name({ onPress, variant, size, disabled }: I$NameProps) {
  return (
    <button
      onClick={onPress}
      disabled={!!disabled}
      className={cn($nameVariants({ variant, size, disabled }), 'hover:opacity-80 transition-opacity cursor-pointer')}
    >
      <Typography variant="body">...</Typography>
    </button>
  )
}
```

### 5. Create barrel files (TWO — one per platform)

ALL imports must use explicit paths — no ambiguous `./ComponentName`.

**`packages/ui/src/components/{level}/$Name/index.ts`** (Metro picks this)

```ts
export { $Name } from './$Name.native'
export type { I$NameProps } from './$Name.tsx'
```

**`packages/ui/src/components/{level}/$Name/index.web.ts`** (Vite picks this)

```ts
export { $Name } from './$Name.web'
export type { I$NameProps } from './$Name.tsx'
```

Variants are NEVER exported from barrel files.

### 6. Register in public API (BOTH top-level barrels)

**`packages/ui/src/index.ts`** (native)

```ts
export { $Name } from './components/{level}/$Name'
export type { I$NameProps } from './components/{level}/$Name'
```

**`packages/ui/src/index.web.ts`** (web)

```ts
export { $Name } from './components/{level}/$Name/index.web'
export type { I$NameProps } from './components/{level}/$Name/index.web'
```

Variants are NEVER exported from the package.

### 7. Optional files (create only if needed)

- **`$Name.styles.ts`** — plain object of Tailwind class strings for layout-only inner elements (margins, flex, gaps). Text classes belong in Typography props.
- **`$Name.constants.ts`** — shared runtime values (maps, helper functions) when duplicated between native/web. No renderer imports.

### 8. Run checks

```bash
pnpm type-check && pnpm lint && pnpm test
```

### 9. Create story

Invoke `/story $Name` after component creation.

## Validation Checklist

- [ ] Correct atomic level directory
- [ ] Variant file colocated in component folder (not in shared `variants/`)
- [ ] No renderer imports in variant file
- [ ] No JSX or runtime values in types file
- [ ] No HTML elements in .native.tsx
- [ ] No RN/StyleSheet imports in .web.tsx
- [ ] No web-only Tailwind classes in variant base or variants object
- [ ] All text uses `<Typography>` — no bare Text/p/span/h1
- [ ] TWO barrel files: index.ts + index.web.ts with explicit extensions
- [ ] Variants NOT exported from barrels or public API
- [ ] Component + type exported from BOTH src/index.ts and src/index.web.ts
- [ ] JSDocs on props interface properties
- [ ] Story created

## i18n — No Hardcoded User-Facing Text

Components are i18n-agnostic — they receive translated strings as props, never call `useTranslation()`.
But **every user-facing string** (labels, placeholders, aria-labels, button text like "Prev"/"Next") must:

1. Be exposed as a **prop** on the component interface (with a sensible English default if appropriate)
2. Have a corresponding **translation entry** in `packages/shared/src/i18n/locales/{en,fr}/translation.json`
3. Be passed via `i18n.t('key')` in Storybook stories and app-level consumers

Never hardcode visible text inside a component — even short labels like "OK", "Cancel", "Next".

## Gotchas

- Never use `React.FC` or `React.` prefix for types — import types directly from react
- Never use `console.log` — use `console.warn` or `console.error`
- Never use explicit `any` — strict TypeScript throughout
- The variant file must ONLY contain safe cross-platform classes (see styling rules)
- Each component owns its own variant — duplicate rather than share across components
- Exception: composition chains (e.g. PasswordInput) may import parent's variant
- `flex` means different things: twrnc = `{ flex: 1 }`, Tailwind = `display: flex`. Use `flex-row` in shared code.

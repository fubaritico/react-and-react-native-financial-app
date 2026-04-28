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

CVA handles the **root element** styling with classes safe for both platforms.

```ts
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the $Name component — controls [describe what it styles] */
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

export type $NameVariants = VariantProps<typeof $nameVariants>
```

FORBIDDEN in variants: `hover:*`, `focus:*`, `active:*`, `transition-*`, `cursor-*`, `shadow-*`, `ring-*`, `outline-*`, `animate-*`.

### 2. Create styles file

`packages/ui/src/components/{level}/$Name/$Name.styles.ts`

The styles file centralizes **all Tailwind class strings** that live outside CVA variants.
It has two named exports — `shared` and `web`:

- **`shared`** — layout classes identical in both native and web (flex, gap, margin, padding on inner elements). Both `.native.tsx` and `.web.tsx` import these.
- **`web`** — web-only classes that would break native (hover, focus-visible, transition, cursor, shadow, animate, ring, outline, overflow, sticky, z-index). Only `.web.tsx` imports these.

```ts
/** Shared layout classes for $Name inner elements (safe for both native and web) */
export const shared = {
  /** Wrapper around children content */
  childrenWrap: 'mt-3',
  /** Row layout for header area */
  header: 'flex-row items-center justify-between',
} as const

/** Web-only classes for $Name (hover, focus, transition, shadow, cursor, animate) */
export const web = {
  /** Shadow + hover feedback on root */
  root: 'shadow-md hover:shadow-lg transition-shadow',
  /** Focus-visible ring for keyboard navigation */
  focusRing: 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
} as const
```

**Rules:**
- Every key MUST have a JSDoc comment
- NEVER put text styling here — text classes belong in `<Typography>` props
- NEVER put renderer imports here (no react-native, no DOM types)
- NEVER import `shared` in `.web.tsx` via `#Atoms` barrel — use relative `./Component.styles`
- If a component has NO inner elements and NO web-only classes, skip this file
- `shared` can be empty if all shared classes are in CVA; `web` can be empty if no web-only behavior

**Canonical example — Card:**

```ts
/** Shared layout classes for Card inner elements (safe for both native and web) */
export const shared = {
  /** Spacing above children content area */
  childrenWrap: 'mt-3',
} as const

/** Web-only classes for Card (hover, focus, transition, shadow, cursor, animate) */
export const web = {
  /** Elevated shadow on card surface */
  root: 'shadow-md',
} as const
```

Native usage: `tw\`${shared.childrenWrap}\``
Web usage: `cn(cardVariants(), web.root)` and `className={shared.childrenWrap}`

### 3. Create types file

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

### 4. Create native implementation

`packages/ui/src/components/{level}/$Name/$Name.native.tsx`

- Use Pressable, Text, View from react-native
- Use `tw\`${$nameVariants({ ...variantProps })}\`` for root element
- Use `tw\`${shared.keyName}\`` for inner elements (from `.styles.ts`)
- All text via `<Typography>` — no bare `<Text>`
- No HTML elements, no cn(), no StyleSheet
- NEVER import `web` from `.styles.ts`

```tsx
import { Pressable } from 'react-native'
import tw from '#Lib/tw'
import { Typography } from '#Atoms'
import { shared } from './$Name.styles'
import { $nameVariants } from './$Name.variants'
import type { I$NameProps } from './$Name'

/** Native implementation of the $Name component. */
export function $Name({ onPress, variant, size, disabled }: Readonly<I$NameProps>) {
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

### 5. Create web implementation

`packages/ui/src/components/{level}/$Name/$Name.web.tsx`

- Use HTML semantic elements (button, div, span, etc.)
- Use `cn($nameVariants({ ...variantProps }), web.root)` for root element
- Use `shared.keyName` for inner elements, `web.keyName` for web-only behavior
- All text via `<Typography>` — no bare `<p>/<span>/<h1>`
- No RN imports, no StyleSheet, no tw``
- Web-only classes come from `web` in `.styles.ts` — NOT hardcoded inline

```tsx
import { cn } from '#Lib/cn'
import { Typography } from '#Atoms/index.web'
import { shared, web } from './$Name.styles'
import { $nameVariants } from './$Name.variants'
import type { I$NameProps } from './$Name'

/** Web implementation of the $Name component. */
export function $Name({ onPress, variant, size, disabled }: Readonly<I$NameProps>) {
  return (
    <button
      onClick={onPress}
      disabled={!!disabled}
      className={cn($nameVariants({ variant, size, disabled }), web.root, web.focusRing)}
    >
      <Typography variant="body">...</Typography>
    </button>
  )
}
```

### 6. Create barrel files (TWO — one per platform)

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

Variants and styles are NEVER exported from barrel files.

### 7. Register in public API (BOTH top-level barrels)

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

Variants and styles are NEVER exported from the package.

### 8. Optional files (create only if needed)

- **`$Name.constants.ts`** — shared runtime values (maps, helper functions) when duplicated between native/web. No renderer imports.

### 9. Run checks

```bash
pnpm type-check && pnpm lint && pnpm test
```

### 10. Create story

Invoke `/story $Name` after component creation.

## Validation Checklist

- [ ] Correct atomic level directory
- [ ] Variant file colocated in component folder (not in shared `variants/`)
- [ ] No renderer imports in variant file
- [ ] No JSX or runtime values in types file
- [ ] `.styles.ts` with `shared` + `web` named exports (skip only if no inner elements AND no web-only classes)
- [ ] Every key in `.styles.ts` has a JSDoc comment
- [ ] `.native.tsx` imports only `shared` from `.styles.ts` — never `web`
- [ ] `.web.tsx` imports both `shared` and `web` from `.styles.ts`
- [ ] No web-only classes hardcoded inline in `.web.tsx` — all in `web` export of `.styles.ts`
- [ ] No HTML elements in .native.tsx
- [ ] No RN/StyleSheet imports in .web.tsx
- [ ] No web-only Tailwind classes in variant base or variants object
- [ ] All text uses `<Typography>` — no bare Text/p/span/h1
- [ ] TWO barrel files: index.ts + index.web.ts with explicit extensions
- [ ] Variants and styles NOT exported from barrels or public API
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

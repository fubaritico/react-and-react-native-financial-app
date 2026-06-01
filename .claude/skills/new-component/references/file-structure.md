# File Structure — the 9 files of a component

Path prefix for every file: `packages/ui/src/components/{level}/$Name/`

Create in this order. Skip a file only when its "skip when" note applies.

---

## 1. `$Name.variants.ts` — CVA variant (root element)

CVA handles the **root element** styling with classes safe for both platforms.

```ts
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the $Name component — controls [describe what it styles] */
export const $nameVariants = cva('base-classes-safe-for-both-platforms', {
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
})

export type $NameVariants = VariantProps<typeof $nameVariants>
```

FORBIDDEN in variants: `hover:*`, `focus:*`, `active:*`, `transition-*`, `cursor-*`, `shadow-*`, `ring-*`, `outline-*`, `animate-*`.

---

## 2. `$Name.styles.ts` — class strings outside CVA

Centralizes **all Tailwind class strings** that live outside CVA variants. Three named exports:

- **`shared`** — layout classes identical in both native and web (flex, gap, margin, padding on inner elements). Imported by both `.native.tsx` and `.web.tsx`.
- **`web`** — web-only classes that would break native (hover, focus-visible, transition, cursor, shadow, animate, ring, outline, inline-block, fixed, sticky). Only `.web.tsx`.
- **`native`** — native-only classes that behave differently on web (RN-specific absolute positioning, etc.). Only `.native.tsx`.

```ts
/** Shared layout classes for $Name inner elements (safe for both native and web) */
export const shared = {
  /** Wrapper around children content */
  childrenWrap: 'mt-3',
} as const

/** Web-only classes for $Name (hover, focus, transition, shadow, cursor, animate) */
export const web = {
  /** Shadow + hover feedback on root */
  root: 'shadow-md hover:shadow-lg transition-shadow',
  /** Focus-visible ring for keyboard navigation */
  focusRing:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
} as const

/** Native-only classes for $Name (RN layout quirks, explicit flex-row, absolute positioning) */
export const native = {} as const
```

**Rules:**

- Every key MUST have a JSDoc comment
- NEVER put text styling here — text classes belong in `<Typography>` props
- NEVER put renderer imports here (no react-native, no DOM types)
- NEVER import styles via `#Atoms` barrel — use relative `./Component.styles`
- ALWAYS use the design system — NEVER code simple tags; ask if components exist, create them if not
- `.native.tsx` imports `shared` + `native` — never `web`
- `.web.tsx` imports `shared` + `web` — never `native`
- Any export can be empty if not needed (`shared`, `web`, or `native`)
- When a class doesn't work cross-platform, move it to the correct platform export instead of leaving it inline
- **Skip this file** ONLY if the component has NO inner elements AND NO platform-specific classes

Native usage: `tw\`${shared.childrenWrap}\``, `tw\`${native.keyName}\``. Web usage: `cn(cardVariants(), web.root)`and`className={shared.childrenWrap}`.

---

## 3. `$Name.tsx` — types only

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

If variants are computed internally (not consumer-facing props), the interface does NOT need to extend `VariantProps`.

---

## 4. `$Name.native.tsx` — React Native

- Use Pressable, Text, View from react-native
- Use `tw\`${$nameVariants({ ...variantProps })}\`` for root element
- Use `tw\`${shared.keyName}\`` and `tw\`${native.keyName}\`` for inner elements
- All text via `<Typography>` — no bare `<Text>`
- No HTML elements, no cn(), no `StyleSheet.create()` — never mix `tw` and `StyleSheet`
- Import `shared` + `native` from `.styles.ts` — NEVER import `web`
- **Conditional classes**: use `tw.style({ 'class-name': condition })` — NOT a ternary like `cond ? tw\`class\` : undefined`. `tw.style`is the native equivalent of the web`cn()`helper: it takes an object whose keys are class strings and values are booleans, and returns one merged style. Compose in a style array:`style={[tw\`${variants(...)}\`, tw.style({ 'opacity-50': disabled, 'flex-row-reverse': reversed }), { flex: 1 }]}`. (`cn()`itself is web-only — never import it in`.native.tsx`; reach for `tw.style` instead.)

```tsx
import { Pressable } from 'react-native'
import tw from '#Lib/tw'
import { Typography } from '#Atoms'
import { native, shared } from './$Name.styles'
import { $nameVariants } from './$Name.variants'
import type { I$NameProps } from './$Name'

/** Native implementation of the $Name component. */
export function $Name({
  onPress,
  variant,
  size,
  disabled,
}: Readonly<I$NameProps>) {
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

---

## 5. `$Name.web.tsx` — DOM

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
export function $Name({
  onPress,
  variant,
  size,
  disabled,
}: Readonly<I$NameProps>) {
  return (
    <button
      onClick={onPress}
      disabled={!!disabled}
      className={cn(
        $nameVariants({ variant, size, disabled }),
        web.root,
        web.focusRing
      )}
    >
      <Typography variant="body">...</Typography>
    </button>
  )
}
```

---

## 6. `index.ts` + `index.web.ts` — barrel files (TWO, one per platform)

ALL imports must use explicit paths — no ambiguous `./ComponentName`.

`index.ts` (Metro picks this):

```ts
export { $Name } from './$Name.native'
export type { I$NameProps } from './$Name.tsx'
```

`index.web.ts` (Vite picks this):

```ts
export { $Name } from './$Name.web'
export type { I$NameProps } from './$Name.tsx'
```

Variants and styles are NEVER exported from barrel files.

---

## 7. Register in public API — BOTH top-level barrels

`packages/ui/src/index.ts` (native):

```ts
export { $Name } from './components/{level}/$Name'
export type { I$NameProps } from './components/{level}/$Name'
```

`packages/ui/src/index.web.ts` (web):

```ts
export { $Name } from './components/{level}/$Name/index.web'
export type { I$NameProps } from './components/{level}/$Name/index.web'
```

Also register in the level barrels (`components/{level}/index.ts` + `index.web.ts`) to match siblings. Variants and styles are NEVER exported from the package.

---

## 8. Optional files (create only if needed)

- **`$Name.constants.ts`** — shared runtime constants ONLY (numeric values, string maps, enums, config objects). No functions, no types, no renderer imports.
- **`$Name.utils.ts`** — shared utility/helper functions when duplicated between native/web. May import from `.constants.ts` and `.tsx` (types). No renderer imports.

**Separation rule**: constants hold _values_, utils hold _logic_, the types file holds _all types/interfaces_. Never put functions or types in `.constants.ts`.

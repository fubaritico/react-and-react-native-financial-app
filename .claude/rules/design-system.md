# Rules — UI Package Components

## Atomic Design Structure (mandatory)

Components are organized using Atomic Design in `packages/ui/src/components/`:

```
components/
  atoms/          # indivisible elements, no internal UI dependency (Icon, Typography, Button, ColorDot, Divider, Avatar, LinkText)
  molecules/      # compose atoms (TextInput, PasswordInput, SectionLink, StatCard, BalanceCard, TransactionRow, SpendingSummaryRow, BillSummaryRow)
  organisms/      # autonomous sections, compose molecules (Card, AuthCard, Header, PotsOverview, TransactionsOverview, RecurringBillsOverview)
  templates/      # page layouts (AuthLayout)
```

Rules:
- Every new component MUST be placed in the correct atomic level
- Atoms NEVER import from molecules, organisms, or templates
- Molecules NEVER import from organisms or templates
- Organisms NEVER import from templates
- Cross-level imports use `#` aliases: `#Atoms`, `#Molecules`, `#Organisms`, `#Templates`, `#Lib/tw`, `#Lib/cn`
- Same-component imports use relative paths: `./Alert.styles`, `./Alert.variants`
- Same-level sibling imports use relative paths: `../TextInput/TextInput.native`
- **Sub-components within an organism** (e.g. DataTable cells) importing from OTHER atomic levels (atoms, molecules) MUST use relative paths (`../../../../atoms/Icon/Icon.native`), NOT `#` aliases — `#` aliases cause ESLint import/order conflicts in nested organism files
- Storybook titles follow the pattern: `'Web/Design System/Atoms/Button'`

## File Structure (mandatory for every component)

Every component follows this exact pattern inside its atomic directory:

```
ComponentName/
  ComponentName.tsx            # ALL types + interfaces ONLY — no JSX, no imports from renderers
  ComponentName.variants.ts    # CVA variant object — internal, never exported from package
  ComponentName.styles.ts      # shared + web-only Tailwind class strings (two named exports)
  ComponentName.constants.ts   # (optional) constants ONLY (numbers, strings, maps) — no functions, no types, no renderer imports
  ComponentName.utils.ts       # (optional) shared utility functions — imports from .constants.ts + .tsx, no renderer imports
  ComponentName.native.tsx     # React Native implementation
  ComponentName.web.tsx        # DOM/HTML implementation
  index.ts                     # native barrel — exports from .native (Metro uses this)
  index.web.ts                 # web barrel — exports from .web (Vite uses this)
```

## i18n — No Hardcoded User-Facing Text

Every user-facing string (labels, placeholders, aria-labels, button text, default prop values)
must have a corresponding translation entry in `packages/shared/src/i18n/locales/{en,fr}/translation.json`.
This includes default prop values like `editLabel = 'Edit Budget'` — the English default is an acceptable
fallback, but a translation key MUST exist so consumers can pass `i18n.t('key')`.

## ComponentName.tsx — Types File Rules

- Export ALL types and interfaces for the component (props, internal types, return types)
- This is the SINGLE source of truth for all types — `.constants.ts` and `.utils.ts` must NOT define types
- Extend VariantProps from the component's CVA variant object
- No JSX, no runtime code, no renderer imports
- **NEVER re-export variants** — variants are internal implementation details
- **NEVER export runtime values** (const, function, object) from this file —
  Vite resolves `./Component` to `Component.web.tsx` before `Component.tsx`
  (due to `.web.tsx` extension priority), causing a circular import.
  If a component needs shared runtime constants (e.g. size maps),
  put them in `ComponentName.constants.ts` and import from there in both
  `.native.tsx` and `.web.tsx`.

```ts
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './Button.variants';

export interface IButtonProps extends VariantProps<typeof buttonVariants> {
  label: string;
  onPress: () => void;
}
```

## ComponentName.variants.ts — Variant Rules

- Lives inside the component folder — never in a shared `variants/` directory
- Imported by `.native.tsx` and `.web.tsx` via `./ComponentName.variants`
- Imported by the types file (`.tsx`) as `type` only
- **Never exported from barrel files** (index.ts, index.web.ts, src/index.ts, src/index.web.ts)
- Each component owns its own variant — even if two variants look identical, duplicate
  rather than sharing (3 lines of CVA is better than a cross-component coupling)
- Exception: composition chains (e.g. PasswordInput composes TextInput) may import from
  the parent component's variant file

## ComponentName.styles.ts — Styles File Rules

Centralizes all Tailwind class strings that live outside CVA variants. Three named exports:

- **`shared`** — layout classes safe for both native and web (flex, gap, margin, padding on inner elements)
- **`web`** — web-only classes that would break native (hover, focus-visible, transition, cursor, shadow, animate, ring, outline, inline-block, fixed, sticky)
- **`native`** — native-only classes that are unnecessary or behave differently on web (e.g. explicit `flex-row` on View containers, absolute positioning patterns specific to RN layout)

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

/** Native-only classes for Card (RN layout quirks, explicit flex-row, absolute positioning) */
export const native = {} as const
```

Rules:
- Every key MUST have a JSDoc comment
- NEVER put text styling here — text classes belong in `<Typography>` props
- NEVER put renderer imports here (no react-native, no DOM types)
- `.native.tsx` imports `shared` and `native` — never `web`
- `.web.tsx` imports `shared` and `web` — never `native`
- **Never exported from barrel files** — internal to the component, like variants
- Skip this file ONLY if the component has no inner elements AND no web-only/native-only classes
- When a class doesn't work cross-platform, move it to the correct platform export (`web` or `native`) instead of leaving it inline

## ComponentName.native.tsx — Native Rules

- Import ONLY from react-native — no HTML elements ever
- Use `tw``...`` from shared tw instance for all styles — never mix with `StyleSheet.create()` in the same file
- Consume variants via: tw`${variantFn({ ...props })}`
- Import `shared` and `native` from `.styles.ts` for inner element classes — never import `web`
- Use Pressable over TouchableOpacity for new components
- All interactive elements (Pressable) MUST include `accessibilityState` matching their disabled/selected state
- Platform-specific additions (gesture, haptics) go here only

```tsx
import { Pressable } from 'react-native'

import tw from '#Lib/tw'

import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'

import { Typography } from '#Atoms'

export function Button({ label, onPress, variant, size, disabled }: Readonly<IButtonProps>) {
  return (
    <Pressable onPress={onPress} disabled={!!disabled}
      style={tw`${buttonVariants({ variant, size, disabled })}`}>
      <Typography variant="body">{label}</Typography>
    </Pressable>
  )
}
```

## ComponentName.web.tsx — Web Rules

- Use HTML semantic elements — no View, Text, or StyleSheet ever
- Use cn() for className composition (clsx + tailwind-merge)
- Import `shared` and `web` from `.styles.ts` — compose web-only classes from `web`, not hardcoded inline — never import `native`
- Web-only classes (`hover:`, `focus:`, `transition-`, `cursor-`, `shadow-`, `animate-`) MUST live in the `web` export of `.styles.ts`
- All interactive elements MUST have `focus-visible` styles for keyboard navigation:
  `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900`
- Never use Tailwind arbitrary values (`bg-[#1a1a2e]`, `text-[14px]`, `p-[12px]`) — always use classes that resolve to `@financial-app/tokens` values via the tailwind config

```tsx
import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { buttonVariants } from './Button.variants'
import { web } from './Button.styles'

import type { IButtonProps } from './Button'

export function Button({ label, onPress, variant, size, disabled }: Readonly<IButtonProps>) {
  return (
    <button onClick={onPress} disabled={!!disabled}
      className={cn(buttonVariants({ variant, size, disabled }), web.interactive)}>
      <Typography variant="body">{label}</Typography>
    </button>
  )
}
```

## #Alias Resolution + Import Order

### Alias resolution rule (CRITICAL)

tsconfig `#Atoms` → `components/atoms/index.ts` (the **native** barrel).
- `.native.tsx` → import from bare `#Atoms` (resolves to native barrel — correct)
- `.web.tsx` → import from `#Atoms/index.web` (explicit web barrel — MANDATORY)
- Same rule for `#Molecules`, `#Organisms`, `#Templates`
- `#Lib` has no platform split — bare `#Lib/cn` or `#Lib/tw` is fine everywhere

If a `.web.tsx` imports bare `#Atoms`, tsc pulls the native barrel → native code in the web bundle.

### ESLint `import/order` consequence

The root `eslint.config.js` has pathGroups for `#Atoms/**`, `#Molecules/**`, etc.
Bare `#Atoms` (no slash) does NOT match `#Atoms/**` — ESLint sorts it **after** the `type` group.
`#Atoms/index.web` (with slash) matches `#Atoms/**` — stays in the `internal` group.

Each group MUST be separated by a blank line (`'newlines-between': 'always'`).

### `.native.tsx` import order:
```ts
import { View } from 'react-native'          // 1. external

import tw from '#Lib/tw'                      // 2. #Lib (internal before)

import { shared } from './Alert.styles'       // 3. sibling (./)
import { alertVariants } from './Alert.variants'

import type { IAlertProps } from './Alert'    // 4. type

import { Icon, Typography } from '#Atoms'     // 5. bare #Atoms (after type)
```

### `.web.tsx` import order:
```ts
import { cn } from '#Lib/cn'                         // 1. #Lib (internal before)

import { Icon, Typography } from '#Atoms/index.web'  // 2. #Atoms/index.web (internal)

import { shared, web } from './Alert.styles'          // 3. sibling (./)

import type { IAlertProps } from './Alert'            // 4. type
```

## index.ts / index.web.ts — Re-export Rules

Two barrel files per component — one per platform:

**CRITICAL**: ALL imports in barrel files must use explicit paths — no ambiguous `./ComponentName`.
`@storybook/react-native-web-vite` adds `.native.tsx` to resolve.extensions, so `./Button`
resolves to `Button.native.tsx` instead of `Button.tsx`. Vite's import-analysis plugin scans
ALL specifiers (including `export type`) before type stripping.

Rules:
- Components: explicit platform extension (`./Button.native`, `./Button.web`)
- Types: explicit `.tsx` extension (`./Button.tsx`)
- **Never re-export variants** — they are internal to the component

```ts
// index.ts — Metro picks this (default entry)
export { Button } from './Button.native';
export type { IButtonProps } from './Button.tsx';
```

```ts
// index.web.ts — Vite picks this
export { Button } from './Button.web';
export type { IButtonProps } from './Button.tsx';
```

## Public API (src/index.ts + src/index.web.ts)

Two top-level barrels mirror the component pattern:
- `src/index.ts` — imports from component `index.ts` (native)
- `src/index.web.ts` — imports from component `index.web.ts` (web)

The `@financial-app/ui` package.json `exports` map routes each platform:
- `"react-native"` → `./src/index.ts`
- `"default"` → `./src/index.web.ts`

Every new component must be added to BOTH barrels with:
- Named component export
- Named type export

**Variants and styles are never exported from the package** — consumers use props, not internals.

## Callback Props — Memoization Rule (mandatory)

NEVER pass inline arrow functions as callback props:
```tsx
// BAD — new function reference every render, breaks memoization
<BudgetCategoryCard onEdit={() => handleEdit(budget)} />

// GOOD — stable reference via useCallback
const handleEditBudget = useCallback(() => {
  handleEdit(budget)
}, [budget, handleEdit])

<BudgetCategoryCard onEdit={handleEditBudget} />
```

Rules:
- Every handler passed as a prop MUST be declared as a `useCallback` expression
- This applies to ALL components — UI package, features, screens, pages
- If the callback needs dynamic data (e.g. a specific item from a list), create the callback
  inside a child wrapper component or use a memoized factory, never inline in JSX
- Exception: `onPress={() => modal.close()}` in one-shot modal config builders (not rendered in loops)

## Checklist for New Component

- [ ] Created ComponentName/ directory
- [ ] ComponentName.tsx — types only, no JSX, no runtime values
- [ ] ComponentName.variants.ts — CVA object, colocated in component folder
- [ ] ComponentName.styles.ts — `shared` + `web` named exports (skip only if no inner elements AND no web-only classes)
- [ ] ComponentName.constants.ts — (if needed) shared runtime constants, no renderer imports
- [ ] ComponentName.native.tsx — uses tw``, imports only `shared` from .styles.ts, no HTML
- [ ] ComponentName.web.tsx — uses cn(), imports `shared` + `web` from .styles.ts, no RN imports, no inline web-only classes
- [ ] index.ts — re-exports component + types only (no variants, no styles)
- [ ] index.web.ts — re-exports component + types only (no variants, no styles)
- [ ] JSDoc on EVERY interface property, EVERY function (with `@param` + `@returns`), EVERY hook, EVERY type with properties, EVERY `.styles.ts` key, EVERY `.constants.ts` value — no exception (QUAL-003/004/005 — global rules)
- [ ] src/index.ts — component + type exported (native barrel)
- [ ] src/index.web.ts — component + type exported (web barrel)

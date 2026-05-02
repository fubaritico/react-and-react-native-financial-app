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
- Cross-level imports use explicit relative paths: `../../atoms/Typography/Typography.native`
- Same-level imports use sibling paths: `../TextInput/TextInput.native`
- Storybook titles follow the pattern: `'Web/Design System/Atoms/Button'`

## File Structure (mandatory for every component)

Every component follows this exact pattern inside its atomic directory:

```
ComponentName/
  ComponentName.tsx            # types + props interface ONLY — no JSX, no imports from renderers
  ComponentName.variants.ts    # CVA variant object — internal, never exported from package
  ComponentName.styles.ts      # shared + web-only Tailwind class strings (two named exports)
  ComponentName.constants.ts   # (optional) shared runtime values (maps, defaults) — no renderer imports
  ComponentName.native.tsx     # React Native implementation
  ComponentName.web.tsx        # DOM/HTML implementation
  index.ts                     # native barrel — exports from .native (Metro uses this)
  index.web.ts                 # web barrel — exports from .web (Vite uses this)
```

## ComponentName.tsx — Types File Rules

- Export the Props interface and nothing else
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
import { Pressable, Text } from 'react-native';
import { tw } from '../../lib/tw';
import { buttonVariants } from './Button.variants';
import type { IButtonProps } from './Button';

export function Button({ label, onPress, variant, size, disabled }: IButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={!!disabled}
      style={tw`${buttonVariants({ variant, size, disabled })}`}>
      <Text>{label}</Text>
    </Pressable>
  );
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
import { cn } from '../../lib/cn';
import { buttonVariants } from './Button.variants';
import type { IButtonProps } from './Button';

export function Button({ label, onPress, variant, size, disabled }: IButtonProps) {
  return (
    <button onClick={onPress} disabled={!!disabled}
      className={cn(buttonVariants({ variant, size, disabled }), 'hover:opacity-80 transition-opacity cursor-pointer')}>
      {label}
    </button>
  );
}
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
- [ ] JSDocs for properties, functions, state variables, and every .styles.ts key
- [ ] src/index.ts — component + type exported (native barrel)
- [ ] src/index.web.ts — component + type exported (web barrel)

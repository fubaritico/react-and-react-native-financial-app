# Rules — UI Package Components

## File Structure (mandatory for every component)

Every component in packages/ui/src/components/ MUST follow this exact pattern:

```
ComponentName/
  ComponentName.tsx            # types + props interface ONLY — no JSX, no imports from renderers
  ComponentName.variants.ts    # CVA variant object — internal, never exported from package
  ComponentName.styles.ts      # (optional) inner element Tailwind class strings
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

## ComponentName.native.tsx — Native Rules

- Import ONLY from react-native — no HTML elements ever
- Use tw`...` from shared tw instance for all styles
- Consume variants via: tw`${variantFn({ ...props })}`
- Use Pressable over TouchableOpacity for new components
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
- Compose web-only classes ON TOP of shared variants
- Web-only classes allowed here: hover:, focus:, active:, transition-, cursor-, shadow-

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

**Variants are never exported from the package** — consumers use props, not internals.

## Checklist for New Component

- [ ] Created ComponentName/ directory
- [ ] ComponentName.tsx — types only, no JSX, no runtime values
- [ ] ComponentName.variants.ts — CVA object, colocated in component folder
- [ ] ComponentName.constants.ts — (if needed) shared runtime constants, no renderer imports
- [ ] ComponentName.native.tsx — uses tw``, no HTML
- [ ] ComponentName.web.tsx — uses cn(), no RN imports
- [ ] index.ts — re-exports component + types only (no variants)
- [ ] index.web.ts — re-exports component + types only (no variants)
- [ ] JSDocs for properties, functions, state variables
- [ ] src/index.ts — component + type exported (native barrel)
- [ ] src/index.web.ts — component + type exported (web barrel)

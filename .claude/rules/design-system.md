# Rules — UI Package Components

## File Structure (mandatory for every component)

Every component in packages/ui/src/components/ MUST follow this exact pattern:

```
ComponentName/
  ComponentName.tsx         # types + props interface ONLY — no JSX, no imports from renderers
  ComponentName.native.tsx  # React Native implementation
  ComponentName.web.tsx     # DOM/HTML implementation
  index.ts                  # native barrel — exports from .native (Metro uses this)
  index.web.ts              # web barrel — exports from .web (Vite uses this)
```

## ComponentName.tsx — Types File Rules

- Export the Props interface and nothing else
- Extend VariantProps from the component's CVA variant object
- No JSX, no runtime code, no renderer imports
- Re-export the variant object so consumers get one import

```ts
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '../../variants/button.variants';

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  label: string;
  onPress: () => void;
}

export { buttonVariants } from '../../variants/button.variants';
```

## ComponentName.native.tsx — Native Rules

- Import ONLY from react-native — no HTML elements ever
- Use tw`...` from shared tw instance for all styles
- Consume variants via: tw`${variantFn({ ...props })}`
- Use Pressable over TouchableOpacity for new components
- Platform-specific additions (gesture, haptics) go here only

```tsx
import { Pressable, Text } from 'react-native';
import { tw } from '../../lib/tw';
import { buttonVariants } from '../../variants/button.variants';
import type { ButtonProps } from './Button';

export function Button({ label, onPress, variant, size, disabled }: ButtonProps) {
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
import { buttonVariants } from '../../variants/button.variants';
import type { ButtonProps } from './Button';

export function Button({ label, onPress, variant, size, disabled }: ButtonProps) {
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

```ts
// index.ts — Metro picks this (default entry)
export { Button } from './Button.native';
export type { ButtonProps } from './Button';
```

```ts
// index.web.ts — Vite picks this (via resolve.extensions .web.ts priority)
export { Button } from './Button.web';
export type { ButtonProps } from './Button';
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
- Named variant export (so consumers can compose)

## Checklist for New Component

- [ ] Created ComponentName/ directory
- [ ] ComponentName.tsx — types only, no JSX
- [ ] ComponentName.native.tsx — uses tw``, no HTML
- [ ] ComponentName.web.tsx — uses cn(), no RN imports
- [ ] index.ts — re-exports from .native + types
- [ ] index.web.ts — re-exports from .web + types
- [ ] variants/[name].variants.ts — CVA object created
- [ ] JSDocs for properties, functions, state variables
- [ ] src/index.ts — component exported (native barrel)
- [ ] src/index.web.ts — component exported (web barrel)

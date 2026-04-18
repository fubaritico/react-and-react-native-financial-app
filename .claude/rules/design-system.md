# Rules — UI Package Components

## File Structure (mandatory for every component)

Every component in packages/ui/src/components/ MUST follow this exact pattern:

```
ComponentName/
  ComponentName.tsx         # types + props interface ONLY — no JSX, no imports from renderers
  ComponentName.native.tsx  # React Native implementation
  ComponentName.web.tsx     # DOM/HTML implementation
  index.ts                  # re-export (bundler overrides per platform)
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

## index.ts — Re-export Rules

```ts
// Target does not matter — Metro picks .native.tsx, Vite/webpack picks .web.tsx
export { Button } from './Button.native';
export type { ButtonProps } from './Button';
```

## Public API (src/index.ts)

Every new component must be added to src/index.ts with:
- Named component export
- Named type export
- Named variant export (so consumers can compose)

## Checklist for New Component

- [ ] Created ComponentName/ directory
- [ ] ComponentName.tsx — types only, no JSX
- [ ] ComponentName.native.tsx — uses tw``, no HTML
- [ ] ComponentName.web.tsx — uses cn(), no RN imports
- [ ] index.ts — re-exports component + types
- [ ] variants/[name].variants.ts — CVA object created
- [ ] src/index.ts — component exported publicly

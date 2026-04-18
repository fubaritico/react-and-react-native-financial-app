# Phase 3 — Design System Cross-Platform Refactor

## Goal

Refactor `@financial-app/ui` from a React Native-only package into a
cross-platform package using the file extension split pattern. After this phase,
the web app (Phase 4) can import components from @financial-app/ui and get
proper DOM implementations automatically.

## Status: TODO (requires Phase 2 complete)

---

## Step 3.1 — Install CVA

```bash
pnpm --filter @financial-app/ui add class-variance-authority
pnpm --filter @financial-app/ui add clsx tailwind-merge
```

---

## Step 3.2 — Create src/lib/cn.ts (web utility)

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Step 3.3 — Create src/variants/ Directory

Create one variant file per existing component.

### src/variants/button.variants.ts
```ts
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'rounded-lg font-semibold items-center justify-center',
  {
    variants: {
      variant: {
        primary:  'bg-primary text-white',
        secondary:'bg-secondary text-black',
        outline:  'bg-transparent border-2 border-primary text-primary',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      disabled: { true: 'opacity-50' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

### src/variants/card.variants.ts
```ts
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const cardVariants = cva('bg-white rounded-xl p-4', {
  variants: {
    elevated: { true: 'shadow-md' },
  },
  defaultVariants: { elevated: false },
});
export type CardVariants = VariantProps<typeof cardVariants>;
```

### src/variants/header.variants.ts
```ts
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const headerVariants = cva('py-4 px-5 bg-primary', {
  variants: {},
  defaultVariants: {},
});
export type HeaderVariants = VariantProps<typeof headerVariants>;
```

### src/variants/index.ts
```ts
export { buttonVariants } from './button.variants';
export type { ButtonVariants } from './button.variants';
export { cardVariants } from './card.variants';
export type { CardVariants } from './card.variants';
export { headerVariants } from './header.variants';
export type { HeaderVariants } from './header.variants';
```

---

## Step 3.4 — Refactor Button Component

### Move existing Button.tsx → Button.native.tsx
Rename current `src/components/Button.tsx` to `src/components/Button/Button.native.tsx`
and update it to use CVA:

```tsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import { tw } from '../../lib/tw';
import { buttonVariants } from '../../variants/button.variants';
import type { ButtonProps } from './Button';

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant, size, disabled, style,
}) => (
  <Pressable
    onPress={onPress}
    disabled={!!disabled}
    style={[tw`${buttonVariants({ variant, size, disabled })}`, style]}
  >
    <Text style={tw`text-base font-semibold`}>{label}</Text>
  </Pressable>
);
```

### Create Button.tsx (types only)
```ts
import type { VariantProps } from 'class-variance-authority';
import type { ViewStyle } from 'react-native';
import type { buttonVariants } from '../../variants/button.variants';

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  label: string;
  onPress: () => void;
  style?: ViewStyle | object;
}
export { buttonVariants } from '../../variants/button.variants';
```

### Create Button.web.tsx
```tsx
import { cn } from '../../lib/cn';
import { buttonVariants } from '../../variants/button.variants';
import type { ButtonProps } from './Button';

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant, size, disabled,
}) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    className={cn(
      buttonVariants({ variant, size, disabled }),
      'hover:opacity-80 transition-opacity cursor-pointer'
    )}
  >
    {label}
  </button>
);
```

### Create Button/index.ts
```ts
export { Button } from './Button.native';
export type { ButtonProps } from './Button';
```

---

## Step 3.5 — Repeat Pattern for Card and Header

Follow the same split for Card and Header:
- Create `Card/Card.tsx` (types), `Card/Card.native.tsx`, `Card/Card.web.tsx`, `Card/index.ts`
- Create `Header/Header.tsx` (types), `Header/Header.native.tsx`, `Header/Header.web.tsx`, `Header/index.ts`

Card.web.tsx note: `shadow-md` is web-only — keep it in `.web.tsx`, remove from shared variant.

---

## Step 3.6 — Update Metro Config for Extension Resolution

In `apps/mobile/metro.config.js`, add explicit native extension priority:

```js
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
];
```

---

## Step 3.7 — Update src/index.ts (Public API)

```ts
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { buttonVariants } from './variants/button.variants';
export type { ButtonVariants } from './variants/button.variants';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';
export { cardVariants } from './variants/card.variants';
export type { CardVariants } from './variants/card.variants';

export { Header } from './components/Header';
export type { HeaderProps } from './components/Header';
export { headerVariants } from './variants/header.variants';
export type { HeaderVariants } from './variants/header.variants';
```

---

## Step 3.8 — Verify Mobile App Still Works

```bash
pnpm --filter mobile-financial-app start
# All 3 components must render identically to before
```

---

## Completion Criteria

- [ ] CVA installed in @financial-app/ui
- [ ] src/variants/ with 3 variant files + index.ts
- [ ] src/lib/cn.ts exists (web only)
- [ ] All 3 components split into ComponentName/ directories
- [ ] Each has .tsx (types), .native.tsx, .web.tsx, index.ts
- [ ] Metro config resolves .native.tsx first
- [ ] src/index.ts exports components, types, AND variants
- [ ] apps/mobile boots and renders correctly
- [ ] No hardcoded colors in any component file

## Next

→ docs/plans/phase-4-web-app.md

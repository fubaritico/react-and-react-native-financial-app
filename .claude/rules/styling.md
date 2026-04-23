# Rules — Styling (CVA + Tailwind + twrnc)

## The Three Layers

```
Layer 1: tokens           packages/tokens/src/*.json          — designers edit this
Layer 2: tailwind-config  packages/tailwind-config/index.js   — consumes token build
Layer 3: variants         packages/ui/src/variants/ — CVA objects
Layer 4: components       *.native.tsx / *.web.tsx             — consume variants
```

Never skip layers. Never reference colors or spacing values that aren't from tokens.

## CVA Variant Rules

Variant files live inside each component folder: `ComponentName/ComponentName.variants.ts`
They are internal to the UI package — never exported to consumers.

### Safe classes for shared variants (both engines understand these)
```
bg-*  text-*  border-*  rounded-*
p-*   m-*     w-*       h-*
opacity-*     flex      flex-row
items-*       justify-* gap-*
font-*        text-sm   text-base  text-lg  leading-*
```

### FORBIDDEN in shared variants — web-only, will break native
```
hover:*     focus:*     active:*    focus-visible:*
group-*     peer-*
transition-* duration-* ease-*     animate-*
cursor-*    select-*    pointer-events-*
shadow-*    drop-shadow-*
ring-*      outline-*
```

### CVA file template
```ts
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const [name]Variants = cva(
  'base-classes-safe-for-both-platforms',
  {
    variants: {
      variant: { primary: '...', secondary: '...' },
      size:    { sm: '...', md: '...', lg: '...' },
      disabled: { true: 'opacity-50' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export type [Name]Variants = VariantProps<typeof [name]Variants>;
```

## twrnc Rules (native)

- tw instance is a singleton — import from packages/ui/src/lib/tw.ts
- tw is initialized with resolveConfig(@financial-app/tailwind-config) — never inline theme
- Use template literals: tw`bg-primary rounded-md px-4`
- Use CVA output: tw`${buttonVariants({ variant, size })}`
- Never combine StyleSheet.create() with tw — pick one per component

## Tailwind CSS Rules (web)

- cn() is the ONLY way to compose classNames — never string concatenation
- cn() lives in packages/ui/src/lib/cn.ts (clsx + tailwind-merge)
- Always start with CVA output, then add web-only classes:
  ```ts
  cn(buttonVariants({ variant, size }), 'hover:opacity-80 transition-opacity')
  ```
- Never import cn() in .native.tsx files

## tw.ts singleton template
```ts
import { create } from 'twrnc';
import resolveConfig from 'tailwindcss/resolveConfig';
import baseConfig from '@financial-app/tailwind-config';

export const tw = create(resolveConfig(baseConfig));
```

## cn.ts template
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

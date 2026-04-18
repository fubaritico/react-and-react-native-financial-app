# Command — new-component

Create a new cross-platform component in @financial-app/ui.

## Usage

```
/new-component [ComponentName]
```

## Steps Claude Code Must Follow

### 1. Create variant file
`packages/ui/src/variants/[name].variants.ts`

```ts
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const [name]Variants = cva(
  'rounded-md font-semibold items-center justify-center',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-black',
        outline: 'bg-transparent border border-primary text-primary',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      disabled: { true: 'opacity-50' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export type [Name]Variants = VariantProps<typeof [name]Variants>;
```

### 2. Create types file
`packages/ui/src/components/[Name]/[Name].tsx`

```ts
import type { [Name]Variants } from '../../variants/[name].variants';

export interface [Name]Props extends [Name]Variants {
  // add component-specific props here
  onPress: () => void;
}

export { [name]Variants } from '../../variants/[name].variants';
```

### 3. Create native implementation
`packages/ui/src/components/[Name]/[Name].native.tsx`

- Use Pressable, Text, View from react-native
- Use tw`${[name]Variants({ ...variantProps })}` for styles
- No HTML elements, no cn(), no StyleSheet

### 4. Create web implementation
`packages/ui/src/components/[Name]/[Name].web.tsx`

- Use HTML semantic elements (button, div, span, etc.)
- Use cn([name]Variants({ ...variantProps }), 'web-only-classes')
- No RN imports, no StyleSheet, no tw``

### 5. Create index
`packages/ui/src/components/[Name]/index.ts`

```ts
export { [Name] } from './[Name].native';
export type { [Name]Props } from './[Name]';
```

### 6. Register in public API
Add to `packages/ui/src/index.ts`:
```ts
export { [Name] } from './components/[Name]';
export type { [Name]Props } from './components/[Name]';
export { [name]Variants } from './variants/[name].variants';
export type { [Name]Variants } from './variants/[name].variants';
```

## Validation Checklist

- [ ] No renderer imports in variant file
- [ ] No JSX in types file
- [ ] No HTML elements in .native.tsx
- [ ] No RN/StyleSheet imports in .web.tsx
- [ ] No web-only Tailwind classes in variant base or variants object
- [ ] Component exported from src/index.ts

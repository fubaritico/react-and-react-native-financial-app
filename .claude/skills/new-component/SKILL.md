---
name: new-component
description: Create a new cross-platform component in @financial-app/ui following the file extension split pattern (types, native, web, variants, index). Use when creating a UI component, adding a design system component, or scaffolding a new component.
allowed-tools: Read Write Bash(pnpm:*)
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: "1.0"
---

# New Component

Create a cross-platform component in `packages/ui/src/components/`.

Before starting, read [the design system rules](../../../.claude/rules/design-system.md) and [the styling rules](../../../.claude/rules/styling.md).

## Arguments

`$ARGUMENTS` = ComponentName (PascalCase, e.g. `Button`, `Avatar`, `Card`)

## Steps

### 1. Create variant file

`packages/ui/src/variants/$name.variants.ts` (camelCase name)

```ts
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const $nameVariants = cva(
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
)

export type $NameVariants = VariantProps<typeof $nameVariants>
```

### 2. Create types file

`packages/ui/src/components/$Name/$Name.tsx`

```ts
import type { $NameVariants } from '../../variants/$name.variants'

export interface $NameProps extends $NameVariants {
  // add component-specific props here
  onPress: () => void
}

export { $nameVariants } from '../../variants/$name.variants'
```

### 3. Create native implementation

`packages/ui/src/components/$Name/$Name.native.tsx`

- Use Pressable, Text, View from react-native
- Use `tw\`${$nameVariants({ ...variantProps })}\`` for styles
- No HTML elements, no cn(), no StyleSheet

### 4. Create web implementation

`packages/ui/src/components/$Name/$Name.web.tsx`

- Use HTML semantic elements (button, div, span, etc.)
- Use `cn($nameVariants({ ...variantProps }), 'web-only-classes')`
- No RN imports, no StyleSheet, no tw``

### 5. Create index

`packages/ui/src/components/$Name/index.ts`

```ts
export { $Name } from './$Name.native'
export type { $NameProps } from './$Name'
```

### 6. Register in public API

Add to `packages/ui/src/index.ts`:

```ts
export { $Name } from './components/$Name'
export type { $NameProps } from './components/$Name'
export { $nameVariants } from './variants/$name.variants'
export type { $NameVariants } from './variants/$name.variants'
```

### 7. Run checks

```bash
pnpm type-check && pnpm lint && pnpm test
```

### 8. Create story

Invoke `/story $Name` after component creation.

## Validation Checklist

- [ ] No renderer imports in variant file
- [ ] No JSX in types file
- [ ] No HTML elements in .native.tsx
- [ ] No RN/StyleSheet imports in .web.tsx
- [ ] No web-only Tailwind classes (hover:, focus:, transition-, shadow-) in variant base or variants object
- [ ] Component exported from src/index.ts
- [ ] Story created

## Gotchas

- Never use `React.FC` or `React.` prefix for types — import types directly from react
- Never use `console.log` — use `console.warn` or `console.error`
- Never use explicit `any` — strict TypeScript throughout
- The variant file must ONLY contain safe cross-platform classes (see styling rules)

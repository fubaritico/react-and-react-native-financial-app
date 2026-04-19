---
name: cross-platform-component
description: Validate and fix cross-platform component architecture — ensure correct file extension split, variant safety, no renderer leaks between native and web implementations. Use when reviewing components, fixing cross-platform issues, or auditing the design system.
allowed-tools: Read Edit Grep Glob
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: "1.0"
---

# Cross-Platform Component Validation

Audit and fix cross-platform component architecture in @financial-app/ui.

## File Extension Split Pattern

Every component MUST have:

```
ComponentName/
  ComponentName.tsx         # types + props interface ONLY — no JSX
  ComponentName.native.tsx  # React Native implementation (twrnc)
  ComponentName.web.tsx     # DOM implementation (Tailwind CSS + cn())
  index.ts                  # re-export
```

## Validation Rules

### Types file (.tsx — no suffix)
- [ ] Exports Props interface only
- [ ] Extends VariantProps from CVA
- [ ] No JSX, no runtime code, no renderer imports
- [ ] Re-exports variant object

### Native file (.native.tsx)
- [ ] Imports ONLY from react-native
- [ ] No HTML elements (`div`, `span`, `button`, etc.)
- [ ] No `cn()` import
- [ ] No `className` prop
- [ ] Uses `tw\`...\`` for all styles
- [ ] Uses Pressable over TouchableOpacity for new components

### Web file (.web.tsx)
- [ ] Uses HTML semantic elements only
- [ ] No react-native imports (View, Text, StyleSheet, etc.)
- [ ] No `tw\`...\`` usage
- [ ] Uses `cn()` for className composition
- [ ] Web-only classes (hover:, focus:, transition-) added ON TOP of shared variants

### Variant file (variants/*.variants.ts)
- [ ] No renderer imports
- [ ] Only safe cross-platform classes in CVA object
- [ ] No hover:, focus:, active:, transition-, cursor-, shadow- classes

### Index file (index.ts)
- [ ] Re-exports component from .native.tsx
- [ ] Re-exports types from types file

## Safe Classes for Shared Variants

```
bg-*  text-*  border-*  rounded-*
p-*   m-*     w-*       h-*
opacity-*     flex      flex-row
items-*       justify-* gap-*
font-*        text-sm   text-base  text-lg  leading-*
```

## Forbidden in Shared Variants

```
hover:*  focus:*  active:*  focus-visible:*
group-*  peer-*
transition-*  duration-*  ease-*  animate-*
cursor-*  select-*  pointer-events-*
shadow-*  drop-shadow-*
ring-*  outline-*
```

## Audit Workflow

1. Glob for all component directories in `packages/ui/src/components/`
2. For each component, check all validation rules above
3. Report violations with file:line references
4. Propose fixes for each violation

## Gotchas

- Metro picks `.native.tsx`, Vite/webpack picks `.web.tsx` — the index.ts target doesn't matter at runtime
- `cn()` lives in `packages/ui/src/lib/cn.ts` — never string concatenation
- `tw` singleton lives in `packages/ui/src/lib/tw.ts` — never inline theme
- Never combine `StyleSheet.create()` with `tw` — pick one per component

---
title: icon-button-composition-pattern
type: note
permalink: financial-app/notes/icon-button-composition-pattern
tags:
- component
- atom
- composition
- solid
- ocp
---

# IconButton — Composition over Variant Explosion

## Overview

IconButton atom created to avoid OCP violation in Button (endless variants for icon-only use cases).

## Observations

- location: `packages/ui/src/components/atoms/IconButton/`
- pattern: composes Button internally, NOT a reimplementation
- renders `<Button size="icon" centered>` with own variant classes via `className` prop
- `cn()` / tailwind-merge resolves conflicts (e.g. Button's `rounded-md` overridden by IconButton's `rounded-full`)
- own CVA variants: circular shape, own sizes (sm/md/lg), own color variants (primary/secondary/ghost/destroy)
- required props: `icon: IconName`, `accessibilityLabel: string`
- NO title, NO children, NO fullWidth — simplified API for icon-only buttons
- native version: same composition via Button + className
- SOLID OCP lesson: adding `className="bg-white"` + `centered` + `size="icon"` to Button for every case violates Open/Closed Principle
- used in: CategoriesScreenView back button (replaced raw `<button>`)
- tests: pending (5-level policy)
- story: pending

## Relations

- composes [[component-design-lessons]]
- implements [[solid-react-principles]] OCP
- part of [[ui-package-architecture]]

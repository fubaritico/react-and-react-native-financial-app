---
title: semantic-color-system
type: note
permalink: financial-app/notes/semantic-color-system
tags:
- styling
- icon
- typography
- refactor
- architecture
---

# Shared Semantic Color System (Icon + Typography)

## Overview

Single source of truth for color tokens shared between Typography and Icon components.

## Observations

- location: `packages/ui/src/lib/semanticColors.ts`
- pattern: maps short semantic names to Tailwind token keys
- Typography uses `text-${token}` in CVA variants (generated from SEMANTIC_COLORS map)
- Icon web uses `var(--color-${token})` via `resolveCssColor()` in Icon.web.tsx
- Icon native uses `resolveColor(token)` via `resolveNativeColor()` in Icon.native.tsx
- consumer passes semantic name like `"muted"`, `"on-dark"`, platform resolution is internal
- replaced ~35 files: raw hex (`#FFFFFF`), `tw.color()`, `resolveColor()`, `var(--color-*)` all migrated to semantic tokens
- `"white"` / `"#FFFFFF"` mapped to `"on-dark"` (semantic equivalent for white icons on colored backgrounds)
- `tw.color('grey-100')` in dark BottomSheet mapped to `"on-dark-muted"`
- added `nav-accent` and `grey-300` to SEMANTIC_COLORS during migration
- Icon `color` prop type changed from `string` to `SemanticColor | 'currentColor'`
- ICON_COLOR_TOKEN in Button.constants.ts updated to use `IconColor` type instead of raw strings
- PasswordRulesList.web.tsx ICON_COLOR_MAP changed from `var(--color-*)` to semantic tokens
- Alert.constants.ts SEVERITY_TOKEN typed as `Record<AlertSeverity, SemanticColor>`

## Relations

- extends [[typography-component]]
- extends [[resolve-color-utility-pattern]]
- relates to [[styling-five-layers]]
- part of [[ui-package-architecture]]

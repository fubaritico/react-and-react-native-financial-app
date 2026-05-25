---
title: resolveColor utility pattern
type: note
permalink: financial-app/resolve-color-utility-pattern
tags:
- architecture
- styling
- debugging
- gotcha
---

# resolveColor utility pattern

## Context
Native components need resolved hex strings for Icon `color`, ActivityIndicator `color`, border colors, etc. `tw.color(token)` returns `string | undefined` — the undefined case means the token doesn't exist in the Tailwind config, which is a configuration bug.

## Problem
The codebase had 16 occurrences of `tw.color('token') ?? '#hardcoded'` — silently falling back to hardcoded hex values instead of surfacing the missing token error. This violates the "never fallback values" rule.

## Fix
`packages/ui/src/lib/resolveColor.ts` — throws if token doesn't resolve:
```ts
export function resolveColor(token: string): string {
  const color = tw.color(token)
  if (!color) throw new Error(`[resolveColor] Unknown color token "${token}".`)
  return color
}
```

Exported from `@financial-app/ui` native barrel. Used in:
- Icon.native.tsx (default color)
- Button.native.tsx (spinner + icon colors)
- NavItem.native.tsx (active/inactive colors)
- Tooltip.native.tsx (arrow color)
- BottomSheetHeader.native.tsx (close icon color)
- DatePicker.native.tsx (accent color)
- CategoryDropdown, BudgetCategoryCard, PotCard (feature components)

## Rules
- For `foreground` token: just omit the `color` prop — Icon defaults to foreground
- For other tokens: use `resolveColor('token-name')` at module level or in useMemo
- NEVER use `tw.color(...) ?? '#hex'` or `tw.color(...) as string`

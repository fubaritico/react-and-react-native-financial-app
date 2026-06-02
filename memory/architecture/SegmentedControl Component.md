---
title: SegmentedControl Component
type: note
permalink: financial-app/architecture/segmented-control-component
---

# SegmentedControl Component

Cross-platform molecule in `@financial-app/ui`: a single-choice radio button bar (e.g. expense vs income). Built as the UI brick for the transaction type toggle. Commit `ffecdac`.

## Observations

- [decision] It is semantically a **radio group** (single choice). If the choice were multiple, it would be checkboxes instead — that distinction drove the markup (real `<input type=radio>` on web, `accessibilityRole="radio"` on native).
- [decision] CVA variant models **state only** (`selected`: black fill+border / white fill+muted border). Positional styling (rounded end caps, closing right border) is NOT a variant — it derives from index, so it lives in `.styles.ts` (`firstSegment: 'rounded-l-md'`, `lastSegment: 'border-r rounded-r-md'`) and is applied per-segment via `cn()` (web) / `tw.style()` (native).
- [pattern] Border model: every segment draws `border-t border-b border-l`; only the last adds `border-r`. Collapses adjacent edges into single 1px dividers + a continuous frame. Colour follows selection (`border-foreground` selected, `border-border-muted` idle).
- [pattern] Idle fill = `bg-card` (white #fff), selected fill = `bg-foreground` (black). Selected text = Typography `on-dark` (white) `body-bold`; idle = `foreground` (black) `body`.
- [decision] Optional `label` prop renders a `Typography variant="label"` heading above the bar, linked to the radiogroup via `aria-labelledby` on web. This required adding an `id?: string` prop to **Typography web** (`ITypographyWebProps`). When `label` present → `aria-labelledby`; else → `aria-label={accessibilityLabel}`.
- [decision] `name` prop is optional (`name?: string`, web-only for radio grouping). When omitted, web generates a stable group name via `useId()` so keyboard arrow navigation still works. Native ignores `name`. Mirrors Button's optional web-only aria props (ISP).
- [pattern] Each segment is an internal child component (`NativeSegment`/`WebSegment`) that memoizes its own handler via `useCallback(onSelect, option.value)` — the parent map passes a stable `onSelect={onChange}` (REACT-001 compliant, no inline arrows).
- [gotcha] Native uses explicit `{ flex: 1 }` inline style for equal-width segments (mirrors NavItem precedent for the twrnc Pressable flex-propagation quirk).
- [tests] 16 tests (5-level) incl. an assertion that `aria-labelledby` (visible label) wins over `accessibilityLabel` for the radiogroup's accessible name. Web + native Storybook stories with `parameters: { backgrounds: 'white' }`.

## Relations
- part_of [[ui-package-architecture]]
- uses [[typography-component]]
- relates_to [[styling-five-layers]]

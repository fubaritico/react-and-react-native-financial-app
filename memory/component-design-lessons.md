---
title: Component Design Lessons
type: note
permalink: component-design-lessons
tags: [lesson, components, design-system]
---

# Component Design Lessons

## Observations

- [rule] Name props by what the user sees — if actions are on the right, the prop is `rightActions`, not `leftActions`
- [rule] Always use positive props — `showX` never `noX`. Double negation (`!noX`) is unreadable
- [rule] Web and native JSX must be structurally identical — only container elements differ (View->div, ScrollView->div)
- [rule] One shared interface per component — never separate `IFooWebProps` and `IFooNativeProps` when the contract is the same
- [rule] Sub-components receive primitives + callbacks, never parent state managers (e.g. ActionBar gets `globalFilterValue: string`, not a `Table<TData>` instance)
- [rule] Consumers provide content, not layout — DataTable owns ActionBar structure, consumer passes `rightActions` content
- [rule] Prefer `ReactElement` over `ReactElement[]` when consumer wraps in Fragment anyway
- [rule] Typography component handles ALL text — no bare `Text` (native) or `<p>/<h1>/<span>` (web)
- [rule] `data-name` attributes in `.native.tsx` are intentional — used for dev tools + future Appium e2e tests
- [lesson] Web-only Tailwind plugins go in app config only — twrnc only implements `addUtilities`, crashes on `theme()`, `matchUtilities()`, `addComponents()`
- [lesson] twrnc interprets `flex` as `{ flex: 1 }`, Tailwind interprets it as `display: flex` — use `flex-row` in shared `.styles.ts`
- [lesson] CSS custom properties are case-sensitive — `--color-base-green-DEFAULT` (uppercase) vs `-default` (lowercase) silently fails
- [lesson] In Tailwind arbitrary values, `_` is treated as space — `var(--_foo)` becomes `var(-- foo)`

## Relations

- learned_from [[User Corrections During Development]]
- applies_to [[Cross-Platform File Extension Split]]
- applies_to [[UI Package Components]]

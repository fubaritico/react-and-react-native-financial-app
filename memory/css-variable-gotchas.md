---
title: CSS Variable Gotchas (Tailwind v3)
type: note
permalink: css-variable-gotchas
tags: [gotcha, styling, tailwind, lesson]
---

# CSS Variable Gotchas (Tailwind v3)

## Observations

- [gotcha] CSS custom properties are case-sensitive — token output `--color-base-green-DEFAULT` (uppercase) vs `-default` (lowercase) silently fails with no error
- [gotcha] Underscore = space in Tailwind arbitrary values — `var(--_foo)` becomes `var(-- foo)` which is invalid CSS. Use `var(--foo)` without underscores
- [gotcha] Numeric suffix = opacity — `divide-grey-100` is parsed as `divide-grey` with opacity `/100`, not the `grey-100` color token. Use semantic tokens (`divide-border`) to avoid ambiguity
- [gotcha] `flex` in twrnc vs Tailwind — twrnc: `{ flex: 1 }`, Tailwind: `display: flex`. For shared `.styles.ts`, use `flex-row` which both engines understand as horizontal layout
- [pattern] Dynamic colors on web: static class `border-l-[var(--border-color)]` + dynamic `style={{ '--border-color': value } as CSSProperties}` — Tailwind CSS can't do dynamic class interpolation
- [pattern] Dynamic colors on native: twrnc supports it directly — `` tw`border-l-${color}` ``
- [consequence] Same visual effect requires different code paths on web vs native for dynamic values

## Relations

- affects [[Styling — The Five Layers]]
- affects [[Cross-Platform File Extension Split]]
- learned_in [[Component Design Lessons]]
- caused_by [[Why twrnc Over NativeWind]]

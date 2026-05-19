---
title: Why CVA for Variants
type: note
permalink: why-cva-for-variants
tags: [decision, styling, architecture]
---

# Why CVA for Variants

## Observations

- [decision] class-variance-authority (CVA) is the variant system for all UI components
- [reason] CVA produces plain class strings — consumed by BOTH twrnc (native via `tw\`\``) and Tailwind CSS (web via `cn()`)
- [reason] Platform-agnostic by nature — CVA doesn't know or care about the renderer, it just maps variant props to class strings
- [reason] Colocated with each component (`.variants.ts`) — no shared variant directory, no cross-component coupling
- [tradeoff] Each component owns its own variant file — even if two variants look identical, we duplicate rather than share (3 lines of CVA is better than a coupling)
- [exception] Composition chains are allowed — PasswordInput can import TextInput's variant since it's a true composition
- [rule] Variants handle the ROOT element only — inner elements get classes from `.styles.ts`
- [rule] Only cross-platform safe classes in CVA (bg, text, border, rounded, p, m, w, h, flex, gap, font)
- [rule] FORBIDDEN in CVA: hover, focus, transition, cursor, shadow, ring, animate — these are web-only, go in `.styles.ts` web export
- [rule] Variants are NEVER exported from the package — consumers use props, not internals

## Relations

- works_with [[Cross-Platform File Extension Split]]
- works_with [[Why twrnc Over NativeWind]]
- consumed_by [[UI Component Props Pattern]]

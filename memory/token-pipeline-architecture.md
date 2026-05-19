---
title: Token Pipeline Architecture
type: note
permalink: token-pipeline-architecture
tags: [decision, architecture, tokens, design-system]
---

# Token Pipeline Architecture

## Observations

- [decision] Style Dictionary with DTCG-compatible JSON as single source of truth for all design values
- [decision] Four build outputs: JS/TS (ui), Tailwind map (tailwind-config), CSS vars (web), RN native values (mobile)
- [reason] Single source prevents drift between platforms — change a color once, all platforms update
- [pattern] Base tokens (raw palette, spacing, radii) in `src/base/`, semantic aliases in `src/semantic/`
- [pattern] Semantic tokens use aliases `{category.name.scale}` — never raw hex values
- [pattern] Custom `size/native` transform strips "px" from spacing values for React Native (16px -> 16)
- [rule] NEVER hardcode colors/spacing in app configs — always from @financial-app/tokens
- [rule] `build/` is always gitignored — CI must run build step
- [rule] Rebrand = edit `base/color.json` only, then rebuild — everything else cascades
- [reference] Adapted from `vite-mf-monorepo/packages/tokens/` — proven DTCG setup, extended with native output and TW v3 JS map
- [layer-order] tokens -> tailwind-config -> ui -> apps — strict dependency chain, never skip

## Relations

- consumed_by [[Why twrnc Over NativeWind]]
- consumed_by [[Cross-Platform File Extension Split]]
- referenced_from [[vite-mf-monorepo Reference Project]]

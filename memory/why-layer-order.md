---
title: Why Strict Layer Order
type: note
permalink: why-layer-order
tags: [decision, architecture, monorepo]
---

# Why Strict Layer Order

## Observations

- [decision] Strict dependency chain: tokens -> tailwind-config -> ui -> apps
- [reason] Tokens are the single source of truth — if tokens depend on anything, the whole system becomes circular
- [reason] tailwind-config consumes token build output — it can't exist without tokens being built first
- [reason] UI consumes both tokens (for values) and tailwind-config (for consistent class names) — it sits above both
- [reason] Apps consume UI components — they never reach into lower layers directly for styling
- [consequence] Build order matters — Turborepo `dependsOn: ["^build"]` ensures correct order
- [consequence] CI must run `pnpm --filter @financial-app/tokens build` before anything else
- [rule] Apps NEVER import from @financial-app/tokens directly for styling — they get values through UI components
- [rule] NEVER create circular dependencies — shared packages NEVER import from apps
- [rule] @financial-app/shared depends on nothing — pure TS, no renderer, no UI imports

## Relations

- enforces [[Token Pipeline Architecture]]
- enforces [[Why Atomic Design]]
- configured_by [[Turborepo Pipeline]]

---
title: fix-web-settings-last-content-route
type: fix
permalink: financial-app/fixes/fix-web-settings-last-content-route
tags:
- web
- navigation
- settings
- react-router
---

# fix-web-settings-last-content-route

## Symptom
Web: `Home → Transactions → Settings → Categories → back → cancel` landed on **Categories** instead of returning to **Transactions** (the screen before Settings).

## Root cause
`settings.tsx` used `navigate(-1)`. `settings.categories.tsx` returns via `navigate('/settings')` (a **push**), so history becomes `[…, Settings, Categories, Settings]` → `navigate(-1)` from Settings steps back to Categories. `navigate(-1)` is intrinsically fragile for this.

## Fix (commit 25e083a)
Web mirror of the native `lastContentTab` mechanism (`apps/mobile-expo/app/(tabs)/_layout.tsx`):
- [location] `apps/web/app/lib/last-content-route.ts` — module-level `lastContentRoute`, `trackContentRoute(pathname)` (excludes `/settings*` via `pathname.startsWith('/settings')`), `getLastContentRoute()`.
- [pattern] The protected `layout.tsx` records the current route in a `useEffect` on `location.pathname`. `settings.tsx` submit/back call `navigate(getLastContentRoute())` instead of `navigate(-1)`.
- [gotcha] Module-level mutable is SSR-safe here: written only in a client `useEffect`, read only in click handlers — the server module instance stays at its `/` default and is never observed cross-request. Mirrors the native `let lastContentTab` pattern.
- [gotcha-test] Vitest **fails an empty `describe` block** — document N/A test levels (L3/L4) as floating comments, not empty `describe`s.

## Relations
- relates to [[ssr-hydration-architecture]]
- relates to [[Known Issues Registry]]

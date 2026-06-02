---
title: SSR to Client-Side Navigation Migration Options
type: note
permalink: financial-app/notes/ssr-to-client-side-navigation-migration-options
tags:
- performance
- ssr
- react-router
- navigation
- deferred
---

# SSR to Client-Side Navigation Migration Options

## Context

- [problem] React Router framework mode blocks navigation until server loaders complete (~400ms per click)
- [problem] `.data` requests go to Netlify SSR → Fly.io API → Supabase (2 hops)
- [decision] DEFERRED — SSR loaders kept for now, migration noted for later
- [current] `unstable_useTransitions` enabled on HydratedRouter but doesn't solve the blocking
- [current] `clientLoader` exists on child routes but `.data` requests still fire (server loader still runs)
- [insight] Auth stays server-side via layout middleware — only DATA loaders need migration

## Option A — Remove all loaders (simplest)

- [approach] Delete `loader` and `clientLoader` from 5 routes (home, transactions, budgets, pots, recurring)
- [approach] Remove `HydrationBoundary`, `dehydratedState`, server imports (`createServerHttpClient`, `createServerQueryClient`, `accessTokenContext`)
- [approach] `useQuery` in component handles everything — `isLoading` drives skeleton display
- [approach] `HydrateFallback` stays for SSR first render
- [tradeoff] First load (URL direct/refresh) shows skeleton then data instead of pre-filled page
- [tradeoff] No SEO impact — all pages behind auth
- [tradeoff] `staleTime: 60s` means revisits within 60s are instant from cache

## Option B — clientLoader + ensureQueryData + initialData (v6 pattern)

- [approach] Replace server `loader` with `clientLoader` that calls `queryClient.ensureQueryData(opts)`
- [approach] Pass result as `loaderData` to component
- [approach] Component uses `useQuery({ ...opts, initialData: loaderData })` — `isLoading` for skeleton
- [problem] QueryClient created in `root.tsx` via `useState` — not accessible from `clientLoader` (no hooks)
- [solution] Export module-level QueryClient singleton (safe for client-side, unlike SSR)
- [solution] OR pass QueryClient via loader context (React Router v6 had this, v7 has `getContext`)
- [tradeoff] More wiring but data served from cache instantly on revisit
- [tradeoff] `ensureQueryData` is async — still blocks if not cached (first visit)

## Files to modify (both options)

- `apps/web/app/routes/home.tsx`
- `apps/web/app/routes/transactions.tsx`
- `apps/web/app/routes/budgets.tsx`
- `apps/web/app/routes/pots.tsx`
- `apps/web/app/routes/recurring.tsx`
- `apps/web/app/root.tsx` (Option B only — export QueryClient)

## React Router source findings

- [source] `lib/router/router.ts` — navigation blocks until `completeNavigation()` after all loaders
- [source] `lib/components.tsx:536-544` — `useTransitions` wraps state updates in `React.startTransition()`
- [source] `useTransitions=true` makes `<Link>` use `startTransition` instead of `flushSync`
- [source] `unstable_useTransitions` in v7.14, stabilized as `useTransitions` in v7.15
- [source] `startTransition` keeps OLD page visible during load — doesn't show new page skeleton

## Related

- [[SSR clientLoader Fallback — Deferred Optimization]]
- [[ssr-hydration-architecture]]

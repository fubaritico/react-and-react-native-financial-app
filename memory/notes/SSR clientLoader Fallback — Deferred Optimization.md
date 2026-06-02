---
title: SSR clientLoader Fallback — Deferred Optimization
type: note
permalink: financial-app/notes/ssr-client-loader-fallback-deferred-optimization
tags:
- performance
- ssr
- react-router
- deferred
---


# SSR clientLoader Fallback — Deferred Optimization

If API hosting stays on Lambda (cold starts), apply this pattern to all authenticated routes
to make client-side navigation instant instead of blocking 3s on the server loader.

**Decision**: DEFERRED — try Fly.io first. If always-on hosting brings loaders under ~300ms,
this workaround is unnecessary.

## The Pattern

Add `clientLoader` to each route that has a server `loader`. On client navigations,
it returns an empty dehydrated state so `useQuery` fetches client-side with a loading state.

```ts
// Add to: home.tsx, transactions.tsx, budgets.tsx, pots.tsx, recurring.tsx

import { QueryClient } from '@tanstack/react-query'

/**
 * Client-side navigation: skip the server loader, return empty dehydrated state.
 * useQuery in the component will fetch data client-side with its own loading state,
 * allowing the page to render immediately instead of blocking on the server.
 */
export async function clientLoader() {
  return { dehydratedState: dehydrate(new QueryClient()) }
}
```

- `loader` (server) stays for SSR first load (URL direct, refresh)
- `clientLoader` takes over on client navigations (sidebar clicks)
- Each component already has `if (isLoading) { return <Spinner /> }` — no UI changes needed
- `HydrateFallback` only shows on initial SSR hydration, NOT on client navigations

## Why It Works

- React Router blocks navigation until loader completes (by design)
- On client navigations, there's no actual SSR (just JSON fetch via Lambda)
- App is behind auth — no SEO value for these pages
- Client HTTP client is already configured with auth token — can call API directly

## Routes to Modify

- `apps/web/app/routes/home.tsx`
- `apps/web/app/routes/transactions.tsx`
- `apps/web/app/routes/budgets.tsx`
- `apps/web/app/routes/pots.tsx`
- `apps/web/app/routes/recurring.tsx`

## Related

- [[SSR Navigation Latency Diagnosis]] — timing instrumentation
- [[Fly.io API Migration]] — if this resolves latency, clientLoader is unnecessary

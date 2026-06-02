---
title: ssr-hydration-architecture
type: note
permalink: financial-app/architecture/ssr-hydration-architecture
tags:
- ssr
- tanstack-query
- react-router
- performance
- netlify
---


# SSR Hydration Architecture

## Pattern — TanStack Query v5 + React Router v7

- **Server loaders** prefetch data via `dehydrate(queryClient)` — one disposable `QueryClient` per request
- **Per-route `HydrationBoundary`** wraps each route component — NOT root-level
- Component receives `loaderData` via `Route.ComponentProps`, passes `loaderData.dehydratedState` to `HydrationBoundary`
- `useQuery()` calls inside components pick up hydrated data instantly — no loading spinner on navigation

## Key Files

- `apps/web/app/lib/query-client.server.ts` — per-request disposable QueryClient (staleTime: 60s, gcTime: 2s)
- `apps/web/app/lib/http-client.server.ts` — per-request HeyAPI client with access token
- `apps/web/app/lib/route-context.ts` — typed RouterContext for accessToken + responseHeaders
- `apps/web/app/routes/layout.tsx` — server middleware (auth) + client middleware (splash + HeyAPI config)

## React Router v7 Middleware Context API

- `v8_middleware: true` uses `RouterContextProvider` with `.get()` / `.set()` — NOT plain object properties
- Create contexts with `createContext()` from `react-router` (similar to React's createContext)
- Middleware: `context.set(accessTokenContext, token)` — Loaders: `context.get(accessTokenContext)`
- Type-safe, no `as` casts needed

## staleTime Decision

- Both server and client QueryClient use `staleTime: 60 * 1000` (60s) per official TanStack Query SSR docs
- Prevents immediate refetch on client after hydration while keeping data reasonably fresh
- This value is in the SHARED `createAppQueryClient()` — affects web AND mobile

## Server Auth Flow

- Layout middleware creates per-request Supabase client from cookies via `@supabase/ssr`
- Validates JWT via `getUser()`, enforces AAL2/MFA, checks onboarding state
- Stores access token in RouterContext for child route loaders
- Child loaders create per-request HeyAPI client with the token to call the API

## HeyAPI Per-Request Client

- SDK functions accept `options.client` to override the singleton
- `@financial-app/http-client/client/factory` export path added for `createClient`/`createConfig`
- This path points to HeyAPI's internal client core — needed because the public barrel only exports the singleton

## Region Co-location

- Supabase: `eu-central-2` (Zurich)
- Netlify Functions: `eu-central-1` (Frankfurt) — set in `netlify.toml`
- ~300km / 2-3ms inter-region latency — optimal for Lambda → Supabase calls
- Netlify Functions region requires Pro plan ($20/month)

## Gotchas

- `throw redirect()` in React Router middleware triggers ESLint `only-throw-error` — needs inline disable comments
- React Router v7 generated types infer `context` from `RouterContextProvider` — property access (`context.foo`) fails type-check
- `useDehydratedState` (root-level merge pattern from v4 docs) is NOT needed with per-route HydrationBoundary
- Module-level `queryClient` singleton no longer needed — root uses `useState(() => createAppQueryClient())`

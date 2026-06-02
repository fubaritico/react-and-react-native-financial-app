---
title: SSR Query Refactoring — Unified HeyAPI Client
type: note
permalink: financial-app/notes/ssr-query-refactoring-unified-hey-api-client
tags:
- performance
- ssr
- react-router
- heyapi
- refactoring
- in-progress
---

# SSR Query Refactoring — Unified HeyAPI Client

## Context

- [problem] Navigation latency ~300ms ressentie entre les pages web
- [problem] Chaque route loader créait un `httpClient` per-request via `createServerHttpClient(accessToken)`, distinct du singleton `client` côté browser
- [problem] `queries/index.ts` avait des wrappers custom qui dupliquaient ce que HeyAPI génère déjà
- [problem] Les queryKeys pouvaient diverger entre SSR et client si les options n'étaient pas identiques
- [decision] API maintenant hébergée sur Fly.io (always-on), plus de Lambda cold starts

## Refactoring effectué (commits 06427bc + b20aa19)

### 1. Singleton `client` unifié SSR ↔ browser

- [change] Server middleware (`layout.tsx`) configure `client.setConfig({ baseUrl: API_URL, auth: () => accessToken })` après validation du token
- [change] Client middleware configure le même singleton avec `authClient.getSession()` pour le token
- [rationale] Lambda Netlify = 1 invocation = 1 requête → configurer le singleton est safe côté serveur
- [rationale] Même client → mêmes queryKeys → hydratation SSR peuple directement le cache browser

### 2. `queries/index.ts` simplifié

- [change] Plus de paramètre `httpClient` — les helpers appellent les options HeyAPI directement (identique aux composants)
- [change] `balanceQuery(queryClient)` au lieu de `balanceQuery(queryClient, httpClient)`

### 3. Route loaders nettoyés

- [change] Plus d'import `createServerHttpClient`, `accessTokenContext` dans les 5 routes data
- [change] Loaders ne prennent plus de `{ context }` — juste `createServerQueryClient()` + `ensureQueryData`
- [files] home.tsx, transactions.tsx, budgets.tsx, pots.tsx, recurring.tsx

### 4. `http-client.server.ts` devenu mort — à supprimer

### 5. Instrumentation timing déployée

- [change] `clientMiddleware` : timing config, `authClient.getSession()`, next()
- [change] Home loader : timing par query individuelle
- [change] Tous les loaders : timing TOTAL
- [rationale] Diagnostiquer les ~300ms de latence

## Prochaines étapes

- Analyser les logs de timing pour identifier le bottleneck
- Candidats : `useNavigation()` progress bar, `NavLink prefetch="intent"`, `shouldRevalidate` sur routes enfants
- Si latence inacceptable : Option A documentée dans [[SSR to Client-Side Navigation Migration Options]]

## Related

- [[SSR to Client-Side Navigation Migration Options]]
- [[React Router 7 — Unused Features Audit]]
- [[ssr-hydration-architecture]]


## Resolution (✅ RESOLVED, confirmed in prod)

The ~300ms navigation latency was decomposed and fixed on two axes:

- [point 1] **Auth**: `getUser()` (network ~350ms/nav) → local `getClaims()` (ES256/JWKS, ~2ms). Added `getClaims` to `IAuthClient` + the Supabase adapter; the web SSR middleware now derives identity from the `sub` claim — no network round-trip on navigations. Prereq: Supabase project uses **asymmetric JWT signing keys** (verified via `/.well-known/jwks.json` → ES256). Tradeoff: revocation only caught at next document load (~token TTL); the API `requireAuth` still validates per request.
- [point 2] **Loader**: `export const clientLoader = skipServerHop` on the 5 data routes — React Router **"Skip the Server Hop"** BFF pattern (docs/how-to/client-data.md). Client navigations no longer round-trip Netlify→Fly; the persistent browser QueryClient (60s staleTime) serves instantly on repeat, else fetches browser→Fly directly. SSR `loader` kept for first load. `skipServerHop` returns a fresh empty `DehydratedState` per call (no shared module-level QueryClient — the module is also imported server-side).
- [refactor] Split the layout god-component → `apps/web/app/routes/layout.server.ts` (`authenticateRequest`, server-only, build-verified no client-bundle leak). Extracted `useFormBridge<T>`, `TRANSACTION_FETCH_LIMIT`. Set up vitest for `apps/web`.
- [incident] Mid-rollout "all data fails" was the **Fly API down (trial expired)**, not the code — see [[fix-fly-api-econnreset-trial-ended-not-a-code-bug]].
- [cleanup] All `[SSR]` timing instrumentation removed after prod confirmation. `http-client.server.ts` still to delete.
- [relation] relates_to [[infra-hosting-regions]]

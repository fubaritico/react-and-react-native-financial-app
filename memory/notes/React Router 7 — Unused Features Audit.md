---
title: React Router 7 — Unused Features Audit
type: note
permalink: financial-app/notes/react-router-7-unused-features-audit
tags:
- react-router
- web
- architecture
- performance
- audit
---


# React Router 7 — Unused Features Audit

Audit of React Router 7 Framework Mode features available but not (or poorly) used in `apps/web/`.
Based on opensrc docs at `opensrc/repos/github.com/remix-run/react-router/docs/`.

## Key Doc Excerpts (from reactrouter.com/start/framework/data-loading)

- "Server Data Loading: loader is used for both initial page loads AND client navigations. Client navigations call the loader through an automatic fetch by React Router from the browser to your server."
- "Using Both Loaders: loader and clientLoader can be used together. The loader will be used on the server for initial SSR and the clientLoader will be used on subsequent client-side navigations."
- "HydrateFallback: On initial page load, the route component renders only after the client loader is finished. If exported, a HydrateFallback can render immediately in place of the route component."
- "You can force the client loader to run during hydration by setting the hydrate property on the function. In this situation you will want to render a HydrateFallback."

## Current Architecture

- Layout middleware handles auth SSR (getUser + getSession), sets context for child loaders
- `clientLoader.hydrate = true` on layout — forces splash animation before first render
- `shouldRevalidate(() => false)` on layout only — prevents re-running layout loader on nav
- Data routes (home, transactions, budgets, pots, recurring) have server loaders that prefetch into TanStack Query dehydrated state
- clientLoader on data routes returns empty dehydrated QueryClient (bypass server on client nav)
- Sidebar uses `useLocation()` + `useNavigate()` imperatively — NOT NavLink
- Branch `client` has SSR-removal commit (tag `[SSR-REMOVAL]`) for reference

## High Priority — Must Do

### 1. `useNavigation` → Global Loading Indicator
- `useNavigation().state === "loading"` in layout.tsx
- Render a thin progress bar (NProgress-style) at top of page
- Addresses the 2-4s blank freeze when navigating between pages with server loaders
- Currently NO visual feedback during navigation at all
- Relates to [[ssr-hydration-architecture]]

### 2. Per-Route `ErrorBoundary`
- Currently only root.tsx has ErrorBoundary
- If a child route loader throws, sidebar disappears — full-page error wipe
- Add ErrorBoundary on layout.tsx (catches auth/middleware failures, keeps sidebar)
- Add ErrorBoundary on each data route (localized error in content area)
- Use `useRouteError()` + `isRouteErrorResponse()` for proper 404 detection

### 3. Per-Route Page Titles (`meta` or React 19 `<title>`)
- Currently hardcoded "Financial App" on ALL pages
- Each route should have its own title: "Overview — Pouch", "Transactions — Pouch", etc.
- Either use `meta` route export or React 19 `<title>` directly in component JSX
- Low effort, big UX improvement (bookmarks, browser history, accessibility)

## Medium Priority — Should Do

### 4. `NavLink` Instead of `useNavigate()` in Sidebar
- Current: Sidebar uses `useLocation()` + `startsWith()` manual matching + `useNavigate()` imperative
- NavLink provides automatically:
  - `isActive` / `isPending` render props → per-link loading feedback
  - `aria-current="page"` → accessibility
  - `prefetch="intent"` → hover-prefetch route JS + loader data
- Requires evolving the `Navigation` component in `@financial-app/ui` web implementation
- The `PrefetchLink` component needs to evolve to support NavLink behavior
- Relates to [[ui-package-architecture]]

### 5. `prefetch="intent"` on Sidebar Links
- Hovering a sidebar link should prefetch that route's JS chunk AND loader data
- Would dramatically reduce perceived navigation latency (pre-warm ~2-4s server call)
- Depends on NavLink adoption (item 4)
- Need to prefetch BOTH the page modules AND the TanStack Query data
- PrefetchLink component needs to handle both concerns

### 6. `shouldRevalidate(() => false)` on Data Routes
- Already done on layout.tsx but NOT on any child data routes
- Without it, server loader still fires on navigation (Lambda invocation wasted)
- Even though clientLoader bypasses it, the server call happens and gets discarded
- Add to: home, transactions, budgets, pots, recurring

## Low Priority — Defer

### 7. `headers` — Cache Headers on SSR Responses
- No route exports `headers()` — no Cache-Control set
- Authenticated routes shouldn't be cached aggressively anyway
- Better handled at Netlify/Fly CDN layer (netlify.toml / fly.toml)

### 8. `handle` + `useMatches` — Route Metadata
- No breadcrumb UI exists today
- Would be useful if we add: page title in layout header, analytics route names, mobile back-button metadata
- Skip for now

### 9. View Transitions (`<NavLink viewTransition>`)
- Smooth cross-fade between pages
- Requires NavLink adoption first (item 4)
- Browser support ~75% (no Firefox stable mid-2025)
- Cosmetic gain — defer until NavLink refactor is done

### 10. `action` / `clientAction`
- Project routes mutations through TanStack Query → external Express API
- Using RR actions would be architectural regression
- Correct decision to skip

## SSR ↔ Client-Only Migration Context

- Branch `client` contains commit tagged `[SSR-REMOVAL]` — removes all server loaders from child routes
- Find it: `git log --all --oneline --grep="SSR-REMOVAL"`
- The SSR implementation is a reusable reference for other projects
- Two migration options documented in [[SSR to Client-Side Navigation Migration Options]]
- Option A (chosen for `client` branch): remove server loaders entirely, useQuery handles everything
- Option B (deferred): clientLoader + ensureQueryData + initialData pattern from v6

## What Works Well (No Changes Needed)

- `ScrollRestoration` — correctly rendered in root.tsx before Scripts
- `HydrateFallback` — well-implemented on all SSR routes
- `middleware` / `clientMiddleware` — sophisticated auth + splash + HTTP client setup in layout
- `clientLoader.hydrate = true` on layout — correct pattern for splash animation gate
- `shouldRevalidate` on layout — prevents redundant Lambda calls for auth re-check

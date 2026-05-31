import { QueryClient, dehydrate } from '@tanstack/react-query'

import type { DehydratedState } from '@tanstack/react-query'

/**
 * clientLoader body for SSR data routes that "skip the server hop" on client
 * navigations (React Router BFF pattern — see docs/how-to/client-data.md).
 *
 * Returns a fresh empty dehydrated state so HydrationBoundary is a no-op and the
 * component's `useQuery` drives data against the persistent browser QueryClient:
 * served from cache instantly within `staleTime` (60s), otherwise fetched directly
 * browser→Fly (one hop, skipping the Netlify SSR round-trip). The server `loader`
 * still runs for the initial document load / direct URL / refresh.
 *
 * Security: auth, AAL2/MFA, and onboarding are enforced server-side by the Fly API
 * (`requireAuth` → 401/403) on every data request, so bypassing the React Router
 * server guard on client navigations exposes no data — it only defers the MFA and
 * onboarding *redirects* to the next full document load.
 *
 * The empty state is built per call (no shared module-level QueryClient): this
 * module is also imported into the server bundle, so module-level construction
 * would share one instance across concurrent requests.
 * @returns An empty dehydrated state for the route's HydrationBoundary
 */
export function skipServerHop(): { dehydratedState: DehydratedState } {
  return { dehydratedState: dehydrate(new QueryClient()) }
}

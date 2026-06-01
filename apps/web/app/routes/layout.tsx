import { client } from '@financial-app/http-client/client'
import { userAtom } from '@financial-app/shared'
import { useHydrateAtoms } from 'jotai/utils'
import { Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, data, useLocation } from 'react-router'

import { Sidebar } from '../components/Sidebar'
import { trackContentRoute } from '../lib/last-content-route'
import {
  accessTokenContext,
  responseHeadersContext,
  userContext,
} from '../lib/route-context'
import { authClient } from '../lib/supabase'

import { authenticateRequest } from './layout.server'

import type { Route } from './+types/layout'

/** API base URL resolved from Vite env variable (inlined at build time) */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/** Animation duration: 119 frames @ 30fps = ~4000ms + 500ms buffer */
const SPLASH_DURATION_MS = 4500

/** Whether the user has requested reduced motion via OS accessibility settings */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Module-level flag — splash plays only once per tab session (survives navigations + refresh via sessionStorage) */
let splashShown =
  typeof window !== 'undefined' && sessionStorage.getItem('splashShown') === '1'

// ── Server middleware ─────────────────────────────────────────────────
// Runs on EVERY request (SSR + client navigations via fetch).
// Auth, MFA, and onboarding guards live in `authenticateRequest` (layout.server.ts);
// this orchestrates context, the next() chain, and the Set-Cookie header merge.

/**
 * Server-side auth guard middleware. Delegates session/JWT/MFA/onboarding validation
 * to authenticateRequest, stores the result in context for child loaders, runs the
 * downstream chain, then merges auth Set-Cookie headers into the final response.
 * @param args - Middleware args with the request and request-scoped context
 * @param next - Runs the downstream middleware/loaders and returns the Response
 * @returns The downstream Response with auth Set-Cookie headers merged in
 */
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    const { user, accessToken, headers } = await authenticateRequest(request)

    // Store access token, user, and headers in context for child loaders
    context.set(accessTokenContext, accessToken)
    context.set(userContext, user)
    context.set(responseHeadersContext, headers)

    const response = await next()

    // Merge Set-Cookie headers from auth into the final response
    headers.forEach((value, key) => {
      if (response instanceof Response) {
        response.headers.append(key, value)
      }
    })

    return response
  },
]

/**
 * Server loader — returns the authenticated user for client-side Jotai hydration.
 * Carries Set-Cookie headers from middleware. Child route loaders handle data prefetching.
 * @param args - Route loader args exposing the request-scoped context
 * @returns The authenticated user, with Set-Cookie headers forwarded from middleware
 */
export function loader({ context }: Route.LoaderArgs) {
  const headers = context.get(responseHeadersContext)
  const user = context.get(userContext)
  return data({ user }, { headers })
}

/**
 * Prevents React Router from re-fetching layout data on internal navigations.
 * The user object is hydrated once into Jotai — subsequent updates come from the
 * client-side auth listener, not from re-running the server loader.
 * Eliminates one full Lambda invocation (~2.8s) per client-side navigation.
 * @returns Always false — layout data never needs server revalidation
 */
export function shouldRevalidate() {
  return false
}

// ── Client middleware ─────────────────────────────────────────────────
// Handles splash animation + configures the browser HeyAPI client.
// Auth is already validated server-side — no auth checks here.

/**
 * Client-side middleware — splash animation + browser HTTP client setup.
 * Auth was already validated server-side; this only handles client concerns.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_, next) => {
    // On cold start, wait for the splash animation to complete
    const splashDelay =
      !splashShown && !prefersReducedMotion
        ? new Promise<void>((resolve) =>
            setTimeout(resolve, SPLASH_DURATION_MS)
          )
        : Promise.resolve()
    splashShown = true
    sessionStorage.setItem('splashShown', '1')

    await splashDelay

    // Configure browser HTTP client for subsequent client-side queries
    client.setConfig({
      baseUrl: API_URL,
      auth: async () => {
        const { session } = await authClient.getSession()
        return session?.access_token
      },
    })

    await next()
  },
]

/**
 * Forces client-side hydration — server renders HydrateFallback instead
 * of the layout, preventing a flash of authenticated UI before redirect.
 * Passes through server loader data (user) for Jotai hydration.
 * @param args - Client loader args exposing the bound server loader
 * @returns The server loader result (authenticated user) for Jotai hydration
 */
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return await serverLoader()
}
clientLoader.hydrate = true as const

/** Client-only DotLottie splash — code-split; cannot render during SSR (Canvas/WebGL) */
const DotLottieSplash = lazy(() => import('../components/DotLottieSplash'))

/**
 * Shown by the server (and during hydration) while clientMiddleware checks auth.
 * @returns The splash placeholder rendered until client-side hydration completes
 */
export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tl from-beige-200 to-beige-100">
      {prefersReducedMotion ? null : (
        <Suspense>
          <div data-splash aria-hidden="true">
            <DotLottieSplash />
          </div>
        </Suspense>
      )}
    </div>
  )
}

/**
 * Shell layout for authenticated routes — sidebar + scrollable main content.
 * Mobile/tablet: content fills viewport, bottom nav bar is fixed.
 * Desktop (lg+): sidebar on left, content on right.
 *
 * Hydrates `userAtom` synchronously during render from server loader data,
 * so AuthBootstrap's hooks (useConfigureHttpClient) see the authenticated user
 * immediately — eliminates the race condition where userAtom starts null
 * and the HTTP client fires without auth, triggering a false "session expired" modal.
 * @param props - Route component props including server loader data (user)
 * @returns The authenticated shell: sidebar + scrollable main content outlet
 */
export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const location = useLocation()
  useHydrateAtoms([[userAtom, loaderData.user]])

  // Remember the last content route so leaving Settings returns there (not to a
  // Settings sub-screen) — web mirror of the native lastContentTab mechanism.
  useEffect(() => {
    trackContentRoute(location.pathname)
  }, [location.pathname, trackContentRoute])

  return (
    <div className="flex min-h-screen bg-gradient-to-tl from-beige-200 to-beige-100">
      <a
        href="#main-content"
        className="sr-only text-grey-900 focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900"
      >
        {t('accessibility.skipToMain')}
      </a>
      <Sidebar />
      <main
        id="main-content"
        className="@container flex-1 overflow-y-auto pb-24 lg:pb-0"
      >
        <Outlet />
      </main>
    </div>
  )
}

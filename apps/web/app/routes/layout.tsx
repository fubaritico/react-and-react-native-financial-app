import { getUsersMePreferences } from '@financial-app/http-client'
import { client } from '@financial-app/http-client/client'
import { userAtom } from '@financial-app/shared'
import { createServerClient } from '@financial-app/shared/auth/client.server'
import { useHydrateAtoms } from 'jotai/utils'
import { Suspense, lazy } from 'react'
import { Outlet, data, redirect } from 'react-router'

import { Sidebar } from '../components/Sidebar'
import {
  accessTokenContext,
  responseHeadersContext,
  userContext,
} from '../lib/route-context'
import { authClient } from '../lib/supabase'

import type { Route } from './+types/layout'

/** API base URL resolved from Vite env variable (inlined at build time) */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/** Animation duration: 119 frames @ 30fps = ~4000ms + 500ms buffer */
const SPLASH_DURATION_MS = 4500

/** DotLottie animation canvas size (px) */
const SPLASH_SIZE = 300

/** Whether the user has requested reduced motion via OS accessibility settings */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Module-level flag — splash plays only once per tab session (survives navigations + refresh via sessionStorage) */
let splashShown =
  typeof window !== 'undefined' && sessionStorage.getItem('splashShown') === '1'

// ── Server middleware ─────────────────────────────────────────────────
// Runs on EVERY request (SSR + client navigations via fetch).
// Validates auth, enforces MFA, checks onboarding state.

/**
 * Server-side auth guard middleware.
 * Creates a per-request Supabase client from cookies, validates JWT via getUser(),
 * enforces AAL2 when MFA enrolled, checks onboarding state.
 * Forwards Set-Cookie headers for token refresh.
 */
/** Cookie name for onboarding state cache (avoids 1-2s API call per navigation) */
const ONBOARDING_COOKIE = 'onboarding'

/**
 * Extracts a cookie value from the request Cookie header.
 * @param request - Incoming HTTP request
 * @param name - Cookie name to extract
 * @returns Cookie value or null if not found
 */
function getCookieValue(request: Request, name: string): string | null {
  const cookies = request.headers.get('cookie')
  if (!cookies) return null
  const match = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`).exec(cookies)
  return match ? decodeURIComponent(match[1]) : null
}

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    const url = new URL(request.url)
    const route = url.pathname
    const t0 = performance.now()
    const { authClient: serverAuth, headers } = createServerClient(request)

    // A: Parallelize getUser (network call ~500ms) + getSession (cookie read ~0ms)
    const tAuth = performance.now()
    const [userResult, sessionResult] = await Promise.all([
      serverAuth.getUser(),
      serverAuth.getSession(),
    ])
    const authMs = performance.now() - tAuth

    const { user, error } = userResult
    if (error || !user) {
      console.warn(
        `[SSR] middleware (${route}) auth=${authMs.toFixed(0)}ms → redirect /login`
      )
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/login', { headers })
    }

    const accessToken = sessionResult.session?.access_token
    if (!accessToken) {
      console.warn(
        `[SSR] middleware (${route}) auth=${authMs.toFixed(0)}ms → redirect /login (no token)`
      )
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/login', { headers })
    }

    // Configure the HeyAPI singleton for this request — same client used by
    // child loaders and later hydrated into the browser
    client.setConfig({
      baseUrl: API_URL,
      auth: () => accessToken,
    })

    // SEC-002: Enforce AAL2 when MFA is enrolled (reads local session, ~3ms)
    const { hasMfaEnrolled, currentLevel } =
      await serverAuth.getAssuranceLevel()
    if (hasMfaEnrolled && currentLevel === 'aal1') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/totp-challenge', { headers })
    }

    // B: Cookie cache for onboarding — skip the 1-2s API call if cookie matches current user
    const onboardingCookie = getCookieValue(request, ONBOARDING_COOKIE)
    const onboardingCached = onboardingCookie === user.id
    let prefsMs = 0

    if (!onboardingCached) {
      const tPrefs = performance.now()
      const { data: prefs } = await getUsersMePreferences({
        throwOnError: true,
      })
      prefsMs = performance.now() - tPrefs

      if (prefs.mode == null) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
        throw redirect('/mode-choice', { headers })
      }
      if (prefs.mode === 'manual' && !prefs.initial_balance_set) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
        throw redirect('/initial-balance', { headers })
      }
      if (!prefs.has_seen_onboarding) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
        throw redirect('/welcome', { headers })
      }

      // Onboarding complete — cache per-user to skip this API call on future navigations
      headers.append(
        'Set-Cookie',
        `${ONBOARDING_COOKIE}=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
      )
    }

    // Store access token, user, and headers in context for child loaders
    context.set(accessTokenContext, accessToken)
    context.set(userContext, user)
    context.set(responseHeadersContext, headers)

    const tLoader = performance.now()
    const response = await next()
    const loaderMs = performance.now() - tLoader

    // Merge Set-Cookie headers from auth into the final response
    headers.forEach((value, key) => {
      if (response instanceof Response) {
        response.headers.append(key, value)
      }
    })

    const totalMs = performance.now() - t0
    console.warn(
      `[SSR] middleware (${route}) TOTAL=${totalMs.toFixed(0)}ms | auth=${authMs.toFixed(0)}ms prefs=${prefsMs.toFixed(0)}ms(${onboardingCached ? 'cached' : 'api'}) loader=${loaderMs.toFixed(0)}ms`
    )
    return response
  },
]

/**
 * Server loader — returns the authenticated user for client-side Jotai hydration.
 * Carries Set-Cookie headers from middleware. Child route loaders handle data prefetching.
 */
export function loader({ context }: Route.LoaderArgs) {
  const headers = context.get(responseHeadersContext)
  const user = context.get(userContext)
  return data({ user }, { headers })
}

/**
 * C: Prevents React Router from re-fetching layout data on internal navigations.
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
    const t0 = performance.now()

    // On cold start, wait for splash animation to complete
    const tSplash = performance.now()
    const splashDelay =
      !splashShown && !prefersReducedMotion
        ? new Promise<void>((resolve) =>
            setTimeout(resolve, SPLASH_DURATION_MS)
          )
        : Promise.resolve()
    splashShown = true
    sessionStorage.setItem('splashShown', '1')

    await splashDelay
    const splashMs = performance.now() - tSplash

    // Configure browser HTTP client for subsequent client-side queries
    client.setConfig({
      baseUrl: API_URL,
      auth: async () => {
        const { session } = await authClient.getSession()
        return session?.access_token
      },
    })

    const tNext = performance.now()
    await next()
    const nextMs = performance.now() - tNext

    console.warn(
      `[Client] clientMiddleware TOTAL=${(performance.now() - t0).toFixed(0)}ms | splash=${splashMs.toFixed(0)}ms next=${nextMs.toFixed(0)}ms`
    )
  },
]

/**
 * Forces client-side hydration — server renders HydrateFallback instead
 * of the layout, preventing a flash of authenticated UI before redirect.
 * Passes through server loader data (user) for Jotai hydration.
 */
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return await serverLoader()
}
clientLoader.hydrate = true as const

/** Client-only DotLottie — cannot render during SSR (requires Canvas/WebGL) */
const DotLottieSplash = lazy(() =>
  import('@lottiefiles/dotlottie-react').then((mod) => ({
    default: () => (
      <mod.DotLottieReact
        src="/splash-animation.lottie"
        autoplay
        loop={false}
        style={{ width: SPLASH_SIZE, height: SPLASH_SIZE }}
      />
    ),
  }))
)

/** Shown by the server (and during hydration) while clientMiddleware checks auth. */
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
 */
export default function AppLayout({ loaderData }: Route.ComponentProps) {
  useHydrateAtoms([[userAtom, loaderData.user]])

  return (
    <div className="flex min-h-screen bg-gradient-to-tl from-beige-200 to-beige-100">
      <Sidebar />
      <main className="@container flex-1 overflow-y-auto pb-24 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

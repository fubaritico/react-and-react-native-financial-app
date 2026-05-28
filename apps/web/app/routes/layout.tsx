import { getUsersMePreferences } from '@financial-app/http-client'
import { client } from '@financial-app/http-client/client'
import { userAtom } from '@financial-app/shared'
import { createServerClient } from '@financial-app/shared/auth/client.server'
import { useHydrateAtoms } from 'jotai/utils'
import { Suspense, lazy } from 'react'
import { Outlet, data, redirect } from 'react-router'

import { Sidebar } from '../components/Sidebar'
import { createServerHttpClient } from '../lib/http-client.server'
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
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    const { authClient: serverAuth, headers } = createServerClient(request)

    // Validate JWT server-side (network call to Supabase Auth)
    const { user, error } = await serverAuth.getUser()
    if (error || !user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/login', { headers })
    }

    // SEC-002: Enforce AAL2 when MFA is enrolled
    const { hasMfaEnrolled, currentLevel } =
      await serverAuth.getAssuranceLevel()
    if (hasMfaEnrolled && currentLevel === 'aal1') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/totp-challenge', { headers })
    }

    // Get access token for API calls in child loaders
    const { session } = await serverAuth.getSession()
    const accessToken = session?.access_token
    if (!accessToken) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
      throw redirect('/login', { headers })
    }

    // Check onboarding state
    const httpClient = createServerHttpClient(accessToken)
    const { data: prefs } = await getUsersMePreferences({
      client: httpClient,
      throwOnError: true,
    })
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
 */
export function loader({ context }: Route.LoaderArgs) {
  const headers = context.get(responseHeadersContext)
  const user = context.get(userContext)
  return data({ user }, { headers })
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
    // On cold start, wait for splash animation to complete
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

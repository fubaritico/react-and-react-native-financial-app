import { getUsersMePreferences } from '@financial-app/http-client'
import { client } from '@financial-app/http-client/client'
import { requireAuth } from '@financial-app/shared'
import { Suspense, lazy } from 'react'
import { Outlet, redirect } from 'react-router'

import { Sidebar } from '../components/Sidebar'
import { authClient } from '../lib/supabase'

import type { Route } from './+types/layout'

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

/**
 * Auth guard middleware — runs sequentially BEFORE child loaders.
 * On first load, waits for splash animation to finish before proceeding.
 * Redirects to /login if not authenticated.
 * Enforces AAL2 when MFA is enrolled (redirects to /totp-challenge).
 * Configures the HTTP client with the current access token so child
 * clientLoaders can call ensureQueryData with valid credentials.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_, next) => {
    // On cold start, wait for splash animation to complete before navigating.
    // Skip delay when user prefers reduced motion.
    const splashDelay =
      !splashShown && !prefersReducedMotion
        ? new Promise<void>((resolve) =>
            setTimeout(resolve, SPLASH_DURATION_MS)
          )
        : Promise.resolve()
    splashShown = true
    sessionStorage.setItem('splashShown', '1')

    const result = await requireAuth(authClient)

    // Wait for animation to finish regardless of auth result
    await splashDelay

    if ('message' in result) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect('/login')
    }

    // SEC-002: Enforce AAL2 when MFA is enrolled.
    // Supabase returns an aal1 session after password login even with TOTP enrolled.
    // Without this check, a user with MFA could access protected routes at aal1,
    // defeating the purpose of 2FA. OWASP A07:2021 — Identification and Authentication Failures.
    const { hasMfaEnrolled, currentLevel } =
      await authClient.getAssuranceLevel()
    if (hasMfaEnrolled && currentLevel === 'aal1') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect('/totp-challenge')
    }

    // Configure HTTP client before child loaders run
    client.setConfig({
      baseUrl: API_URL,
      auth: async () => {
        const { session } = await authClient.getSession()
        return session?.access_token
      },
    })

    // Check onboarding state — redirect if mode not chosen or initial balance not set
    const { data: prefs } = await getUsersMePreferences({ throwOnError: true })
    if (prefs.mode == null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect('/mode-choice')
    }
    if (prefs.mode === 'manual' && !prefs.initial_balance_set) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect('/initial-balance')
    }
    if (!prefs.has_seen_onboarding) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect('/welcome')
    }

    await next()
  },
]

/**
 * Forces client-side hydration — server renders HydrateFallback instead
 * of the layout, preventing a flash of authenticated UI before redirect.
 */
export function clientLoader() {
  return null
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
    <div className="flex min-h-screen items-center justify-center bg-beige-100">
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
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-beige-100">
      <Sidebar />
      <main className="@container flex-1 overflow-y-auto pb-24 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

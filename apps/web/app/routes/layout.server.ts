import { getUsersMePreferences } from '@financial-app/http-client'
import { client } from '@financial-app/http-client/client'
import { createServerClient } from '@financial-app/shared/auth/client.server'
import { redirect } from 'react-router'

import type { IUser } from '@financial-app/shared'

/** API base URL resolved from Vite env variable (inlined at build time) */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/** Cookie name for onboarding state cache (avoids the prefs API call per navigation) */
export const ONBOARDING_COOKIE = 'onboarding'

/** Per-request auth timing, surfaced so the middleware can emit one aggregate log. */
export interface IAuthTiming {
  /** ms spent on getSession + local getClaims signature/expiration verification */
  authMs: number
  /** ms spent fetching user preferences (0 when served from the onboarding cookie) */
  prefsMs: number
  /** Whether onboarding state was read from the cookie cache (no prefs API call) */
  onboardingCached: boolean
}

/** Result of a successful auth guard pass. */
export interface IAuthResult {
  /** Authenticated user — identity derived from the verified JWT claims */
  user: IUser
  /** Raw access token for child loaders and the HeyAPI client */
  accessToken: string
  /** Response headers carrying Set-Cookie directives (token refresh + onboarding cache) */
  headers: Headers
  /** Timing breakdown for instrumentation */
  timing: IAuthTiming
}

/**
 * Extracts a cookie value from the request Cookie header.
 * @param request - Incoming HTTP request
 * @param name - Cookie name to extract
 * @returns The decoded cookie value, or null if absent or malformed
 */
function getCookieValue(request: Request, name: string): string | null {
  const cookies = request.headers.get('cookie')
  if (!cookies) return null
  const match = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`).exec(cookies)
  if (!match) return null
  // A malformed percent-encoding (e.g. an attacker-set `%zz`) would otherwise throw
  // a URIError and crash the middleware on every request for that session.
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

/**
 * Validates the session and enforces access requirements for an authenticated request.
 *
 * getSession reads the cookie (and refreshes if expired) → raw token for the HeyAPI
 * client + child loaders. getClaims verifies the token's signature and expiration
 * LOCALLY (asymmetric signing keys) and yields identity from the `sub` claim — no
 * network round-trip to Supabase on navigations. Tradeoff (accepted): local
 * verification does NOT detect server-side token revocation before expiry (~1h TTL);
 * local signout clears the cookie, a global revocation is bounded by the token lifetime.
 *
 * Also configures the HeyAPI singleton, enforces AAL2 when MFA is enrolled, and checks
 * onboarding state (cached per-user via cookie to skip the prefs API call on navigations).
 * @param request - Incoming HTTP request with auth cookies
 * @param route - Request pathname, used only for instrumentation logs
 * @returns The authenticated user, access token, response headers, and timing breakdown
 * @throws A redirect Response when auth, MFA, or onboarding requirements are not met
 */
export async function authenticateRequest(
  request: Request,
  route: string
): Promise<IAuthResult> {
  const { authClient: serverAuth, headers } = createServerClient(request)

  const tAuth = performance.now()
  const { session } = await serverAuth.getSession()
  const sessionMs = performance.now() - tAuth
  const accessToken = session?.access_token
  if (!accessToken) {
    console.warn(
      `[SSR] middleware (${route}) auth=${(performance.now() - tAuth).toFixed(0)}ms → redirect /login (no token)`
    )
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
    throw redirect('/login', { headers })
  }

  // DEBUG (temporary): decode the JWT header to learn whether the token is signed
  // with an asymmetric key (ES256 → local verification) or the legacy HS256 secret
  // (→ getClaims falls back to a network getUser call). Remove once latency confirmed.
  let alg = 'unknown'
  try {
    const decoded = JSON.parse(
      Buffer.from(accessToken.split('.')[0], 'base64url').toString()
    ) as { alg?: string }
    alg = decoded.alg ?? 'none'
  } catch {
    // malformed header — leave alg as 'unknown'
  }

  const tClaims = performance.now()
  const { claims, error } = await serverAuth.getClaims(accessToken)
  const claimsMs = performance.now() - tClaims
  const authMs = performance.now() - tAuth
  console.warn(
    `[SSR] auth breakdown (${route}) alg=${alg} getSession=${sessionMs.toFixed(0)}ms getClaims=${claimsMs.toFixed(0)}ms`
  )
  if (error || !claims) {
    console.warn(
      `[SSR] middleware (${route}) auth=${authMs.toFixed(0)}ms → redirect /login`
    )
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
    throw redirect('/login', { headers })
  }

  const user: IUser = {
    id: claims.sub,
    email: claims.email,
    user_metadata: claims.user_metadata,
  }

  // Configure the HeyAPI singleton for this request — same client used by
  // child loaders and later hydrated into the browser
  client.setConfig({
    baseUrl: API_URL,
    auth: () => accessToken,
  })

  // SEC-002: Enforce AAL2 when MFA is enrolled (reads local session, ~3ms)
  const { hasMfaEnrolled, currentLevel } = await serverAuth.getAssuranceLevel()
  if (hasMfaEnrolled && currentLevel === 'aal1') {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
    throw redirect('/totp-challenge', { headers })
  }

  // Cookie cache for onboarding — skip the prefs API call if the cookie matches the user
  const onboardingCached =
    getCookieValue(request, ONBOARDING_COOKIE) === user.id
  let prefsMs = 0

  if (!onboardingCached) {
    const tPrefs = performance.now()
    const { data: prefs } = await getUsersMePreferences({ throwOnError: true })
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
      `${ONBOARDING_COOKIE}=${user.id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
    )
  }

  return {
    user,
    accessToken,
    headers,
    timing: { authMs, prefsMs, onboardingCached },
  }
}

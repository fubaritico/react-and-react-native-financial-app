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

/** Result of a successful auth guard pass. */
export interface IAuthResult {
  /** Authenticated user — identity derived from the verified JWT claims */
  user: IUser
  /** Raw access token for child loaders and the HeyAPI client */
  accessToken: string
  /** Response headers carrying Set-Cookie directives (token refresh + onboarding cache) */
  headers: Headers
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
 * @returns The authenticated user, access token, and response headers
 * @throws A redirect Response when auth, MFA, or onboarding requirements are not met
 */
export async function authenticateRequest(
  request: Request
): Promise<IAuthResult> {
  const { authClient: serverAuth, headers } = createServerClient(request)

  const { session } = await serverAuth.getSession()
  const accessToken = session?.access_token
  if (!accessToken) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router redirect pattern
    throw redirect('/login', { headers })
  }

  const { claims, error } = await serverAuth.getClaims(accessToken)
  if (error || !claims) {
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

  if (!onboardingCached) {
    const { data: prefs } = await getUsersMePreferences({ throwOnError: true })

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

  return { user, accessToken, headers }
}

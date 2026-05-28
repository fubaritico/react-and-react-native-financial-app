import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'

import { isHttpClientReadyAtom, userAtom } from '../atoms/auth.atom'

import type { IAuthClient } from '../auth/types'

/** Minimal interface for the HeyAPI client — duck-typed to avoid a build dependency */
interface IHttpClient {
  /** Applies base URL and auth callback to the client singleton */
  setConfig: (config: {
    baseUrl?: string
    auth?:
      | ((auth: unknown) => Promise<string | undefined> | string | undefined)
      | string
      | undefined
  }) => unknown
  /** Interceptor registry for response/error hooks */
  interceptors: {
    response: {
      use: (fn: (response: Response) => Response) => void
      eject: (fn: (response: Response) => Response) => void
    }
  }
}

/**
 * Configures the HeyAPI HTTP client with baseUrl and auth token.
 *
 * The auth callback always delegates to `authClient.getSession()` — it never
 * conditionally sets `auth: undefined`. This prevents a race condition on web
 * where `clientMiddleware` configures a working auth callback, but this effect
 * fires before Jotai hydration completes and would overwrite it with `undefined`,
 * causing API calls to go out without a token (→ 401 → false "session expired" modal).
 *
 * Re-runs whenever userAtom changes (login, logout, token refresh) to reset
 * the sign-out guard for the 401 interceptor.
 *
 * Also registers a response interceptor that detects 401 responses
 * and calls `onSessionExpired` to trigger a user-facing modal.
 *
 * @param httpClient - The HeyAPI client singleton (from @financial-app/http-client/client)
 * @param authClient - Vendor-agnostic auth client (browser or native)
 * @param apiUrl - Base URL for the API server (e.g. http://localhost:3001)
 * @param onSessionExpired - Callback when a 401 is received (opens the session expired modal)
 */
export function useConfigureHttpClient(
  httpClient: IHttpClient,
  authClient: IAuthClient,
  apiUrl: string,
  onSessionExpired?: () => void
) {
  /** Current authenticated user (null when signed out) */
  const user = useAtomValue(userAtom)
  const setHttpClientReady = useSetAtom(isHttpClientReadyAtom)

  /** Guards against firing the expired modal twice during sign-out */
  const signingOutRef = useRef(false)

  /**
   * Stable ref to the latest `user` value.
   * The 401 interceptor is registered once (empty deps) but needs to read
   * the current auth state — a ref avoids re-registering the interceptor
   * on every user change while still seeing the latest value.
   */
  const userRef = useRef(user)
  userRef.current = user

  /**
   * Stable ref to the latest `onSessionExpired` callback.
   * Same pattern: the interceptor captures this ref once, but always
   * calls the most recent version of the callback.
   */
  const onSessionExpiredRef = useRef(onSessionExpired)
  onSessionExpiredRef.current = onSessionExpired

  useEffect(() => {
    httpClient.setConfig({
      baseUrl: apiUrl,
      // Always provide the auth callback — never set auth to undefined.
      // On web, clientMiddleware sets a working auth callback before this effect runs.
      // Setting auth: undefined when user is null would overwrite it, causing
      // API calls to fire without a token before hydration completes.
      auth: async () => {
        const { session } = await authClient.getSession()
        return session?.access_token
      },
    })
    // Always true — the auth callback is always present (delegates to getSession).
    // On mobile, useAuthRedirect waits for this before navigating.
    setHttpClientReady(true)

    // Reset the sign-out guard when a new user logs in,
    // so the 401 interceptor can fire again on the next session expiry.
    if (user) {
      signingOutRef.current = false
    }
  }, [user, httpClient, authClient, apiUrl, setHttpClientReady])

  // Register 401 interceptor — show session expired modal
  useEffect(() => {
    /** Intercepts 401 responses and triggers session expiry flow.
     *  Only fires when the user IS authenticated — a 401 without
     *  an active session is expected (e.g. visiting /login) and must
     *  not show the "session expired" modal. */
    const handle401 = (response: Response) => {
      if (
        response.status === 401 &&
        !signingOutRef.current &&
        userRef.current
      ) {
        signingOutRef.current = true
        onSessionExpiredRef.current?.()
      }
      return response
    }

    httpClient.interceptors.response.use(handle401)
    return () => {
      httpClient.interceptors.response.eject(handle401)
    }
  }, [httpClient])
}

/**
 * Builds the sign-out handler for the session expired modal OK button.
 * Clears the user atom and signs out locally (no network call with expired token).
 */
export function useSessionExpiredHandler(authClient: IAuthClient) {
  const setUser = useSetAtom(userAtom)

  return useCallback(() => {
    setUser(null)
    void authClient.signOut({ scope: 'local' })
  }, [authClient, setUser])
}

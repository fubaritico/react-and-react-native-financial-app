import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'

import { isHttpClientReadyAtom, userAtom } from '../atoms/auth.atom'

// ── Debug tracer (remove after fix confirmed) ────────────────────────
const T0 = typeof performance !== 'undefined' ? performance.now() : 0
let STEP = 0
/** Logs a numbered step with ms since module load */
function dbg(tag: string, ...args: unknown[]) {
  const ms = (performance.now() - T0).toFixed(1)
  console.warn(`[AUTH-FLOW] #${String(++STEP)} +${ms}ms [${tag}]`, ...args)
}

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
 * Re-runs whenever userAtom changes (login, logout, token refresh)
 * so the client always has the latest credentials.
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
    dbg('HTTP-CLIENT:effect', 'user:', user ? user.id : null)
    httpClient.setConfig({
      baseUrl: apiUrl,
      auth: user
        ? async () => {
            const { session } = await authClient.getSession()
            dbg(
              'HTTP-CLIENT:auth-cb',
              'token:',
              session?.access_token ? 'present' : 'missing'
            )
            return session?.access_token
          }
        : undefined,
    })
    setHttpClientReady(!!user)

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
      if (response.status === 401) {
        dbg(
          'HTTP-CLIENT:401',
          'userRef:',
          userRef.current?.id ?? null,
          'signingOut:',
          signingOutRef.current,
          'url:',
          response.url
        )
      }
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

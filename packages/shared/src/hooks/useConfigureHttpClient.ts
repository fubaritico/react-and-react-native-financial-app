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
  const user = useAtomValue(userAtom)
  const setHttpClientReady = useSetAtom(isHttpClientReadyAtom)
  const signingOutRef = useRef(false)
  const onSessionExpiredRef = useRef(onSessionExpired)
  onSessionExpiredRef.current = onSessionExpired

  useEffect(() => {
    httpClient.setConfig({
      baseUrl: apiUrl,
      auth: user
        ? async () => {
            const { session } = await authClient.getSession()
            return session?.access_token
          }
        : undefined,
    })
    setHttpClientReady(!!user)
  }, [user, httpClient, authClient, apiUrl, setHttpClientReady])

  // Register 401 interceptor — show session expired modal
  useEffect(() => {
    /** Intercepts 401 responses and triggers session expiry flow */
    const handle401 = (response: Response) => {
      if (response.status === 401 && !signingOutRef.current) {
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

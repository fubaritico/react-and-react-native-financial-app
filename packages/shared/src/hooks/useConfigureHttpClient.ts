import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { userAtom } from '../atoms/auth.atom'

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
}

/**
 * Configures the HeyAPI HTTP client with baseUrl and auth token.
 * Re-runs whenever userAtom changes (login, logout, token refresh)
 * so the client always has the latest credentials.
 *
 * @param httpClient - The HeyAPI client singleton (from @financial-app/http-client/client)
 * @param authClient - Vendor-agnostic auth client (browser or native)
 * @param apiUrl - Base URL for the API server (e.g. http://localhost:3001)
 */
export function useConfigureHttpClient(
  httpClient: IHttpClient,
  authClient: IAuthClient,
  apiUrl: string
) {
  const user = useAtomValue(userAtom)

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
  }, [user, httpClient, authClient, apiUrl])
}

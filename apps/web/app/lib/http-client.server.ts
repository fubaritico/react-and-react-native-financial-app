import {
  createClient,
  createConfig,
} from '@financial-app/http-client/client/factory'

import type { Client } from '@financial-app/http-client/client/factory'

/** API base URL resolved from Vite env variable (inlined at build time) */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/**
 * Creates a per-request HeyAPI client configured with the given access token.
 * Used in server loaders to call the API on behalf of the authenticated user.
 * @param accessToken - Supabase JWT access token from the request cookies
 * @returns Configured HeyAPI Client instance
 */
export function createServerHttpClient(accessToken: string): Client {
  return createClient(
    createConfig({
      baseUrl: API_URL,
      auth: () => accessToken,
    })
  )
}

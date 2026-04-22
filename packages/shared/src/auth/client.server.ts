import {
  createServerClient as createSupaServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'

import { createSupabaseAuthAdapter } from './adapter.supabase'

import type { IAuthClient } from './types'

/**
 * Creates an auth client for server-side rendering (SSR) loaders.
 * Reads session from request cookies, writes refreshed tokens to response headers.
 * @param request - Incoming HTTP request with cookies
 * @throws Error if VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars are missing
 * @returns Object with vendor-agnostic `authClient` and `headers` containing Set-Cookie directives
 */
export function createServerClient(request: Request): {
  authClient: IAuthClient
  headers: Headers
} {
  const headers = new Headers()

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      '[auth] Missing env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set server-side. ' +
        'Check apps/web/.env against .env.example.'
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- uses getAll/setAll (non-deprecated overload), lint false positive
  const supabase = createSupaServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '')
      },
      setAll(
        cookiesToSet: {
          name: string
          value: string
          options: Record<string, unknown>
        }[]
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          headers.append(
            'Set-Cookie',
            serializeCookieHeader(name, value, options)
          )
        })
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- @supabase/ssr factory returns wider generic than SupabaseClient default
  return { authClient: createSupabaseAuthAdapter(supabase), headers }
}

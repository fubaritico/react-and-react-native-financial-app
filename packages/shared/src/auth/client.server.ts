import {
  createServerClient as createSupaServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'

/**
 * Creates a Supabase client for server-side rendering (SSR) loaders.
 * Reads session from request cookies, writes refreshed tokens to response headers.
 * @param request - Incoming HTTP request with cookies
 * @returns Object with `supabase` client and `headers` containing Set-Cookie directives
 */
export function createServerClient(request: Request) {
  const headers = new Headers()

  const url = process.env.VITE_SUPABASE_URL ?? ''
  const key = process.env.VITE_SUPABASE_ANON_KEY ?? ''

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

  return { supabase, headers }
}

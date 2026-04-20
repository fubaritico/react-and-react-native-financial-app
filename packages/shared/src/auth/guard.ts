import { redirect } from 'react-router'

import { createServerClient } from './client.server'

/**
 * Server loader guard that enforces authentication.
 * Redirects to /login if no valid session exists.
 * @param request - Incoming HTTP request
 * @returns Object with `supabase` client, `user`, `headers`, and `accessToken` for API calls.
 *   accessToken is empty string if session exists but token is unavailable (API call will 401).
 */
export async function requireAuth(request: Request) {
  const { supabase, headers } = createServerClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router convention: throw Response for redirects
    throw redirect('/login', { headers })
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token ?? ''

  return { supabase, user, headers, accessToken }
}

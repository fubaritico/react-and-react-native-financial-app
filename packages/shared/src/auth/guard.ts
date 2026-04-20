import { redirect } from 'react-router'

import { createServerClient } from './client.server'

/**
 * Server loader guard that enforces authentication.
 * Redirects to /login if no valid session exists or if auth calls fail.
 * @param request - Incoming HTTP request
 * @returns Object with `authClient`, `user`, `headers`, and `accessToken` for API calls.
 */
export async function requireAuth(request: Request) {
  const { authClient, headers } = createServerClient(request)
  const { user, error: userError } = await authClient.getUser()

  if (userError || !user) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router convention: throw Response for redirects
    throw redirect('/login', { headers })
  }

  const { session, error: sessionError } = await authClient.getSession()

  if (sessionError || !session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router convention: throw Response for redirects
    throw redirect('/login', { headers })
  }

  return { authClient, user, headers, accessToken: session.access_token }
}

import type { IAuthClient, IAuthError, IUser } from './types'

/** Successful auth verification result */
export interface IAuthResult {
  /** Authenticated user */
  user: IUser
  /** JWT access token for forwarding to the Express API as Bearer token */
  accessToken: string
}

/**
 * Verifies the current session is authenticated.
 * Returns user + accessToken if valid, IAuthError otherwise.
 * The caller decides what to do on failure (redirect, navigate, show error, etc.)
 * @param authClient - Vendor-agnostic auth client
 * @returns IAuthResult if authenticated, IAuthError if not
 */
export async function requireAuth(
  authClient: IAuthClient
): Promise<IAuthResult | IAuthError> {
  const { user, error: userError } = await authClient.getUser()
  if (userError) return userError
  if (!user) return { message: 'No authenticated user', status: 401 }

  const { session, error: sessionError } = await authClient.getSession()
  if (sessionError) return sessionError
  if (!session) return { message: 'No active session', status: 401 }

  return { user, accessToken: session.access_token }
}

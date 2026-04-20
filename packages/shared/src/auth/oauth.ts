import type { IAuthClient } from './types'

/**
 * Initiates Google OAuth sign-in via redirect flow (web only).
 * The auth provider validates redirectTo against configured Site URLs.
 * @param authClient - Browser auth client
 * @param redirectTo - URL to redirect to after successful authentication
 * @returns Promise resolving to `{ url: string | null; error: IAuthError | null }`
 */
export async function signInWithGoogle(
  authClient: IAuthClient,
  redirectTo: string
) {
  return authClient.signInWithOAuth('google', { redirectTo })
}

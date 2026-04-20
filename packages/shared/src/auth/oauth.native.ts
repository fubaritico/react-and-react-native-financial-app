import type { IAuthClient } from './types'

/**
 * Signs in with Google on native platforms.
 * The caller is responsible for obtaining the idToken via
 * @react-native-google-signin/google-signin at the app level.
 * @param authClient - Native auth client
 * @param idToken - Google ID token obtained from the native sign-in flow
 * @returns Promise resolving to `{ user: IUser | null; error: IAuthError | null }`
 */
export async function signInWithGoogle(
  authClient: IAuthClient,
  idToken: string
) {
  return authClient.signInWithIdToken('google', idToken)
}

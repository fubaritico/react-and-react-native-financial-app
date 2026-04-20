import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Signs in with Google on native platforms.
 * The caller is responsible for obtaining the idToken via
 * @react-native-google-signin/google-signin at the app level.
 */
export async function signInWithGoogle(
  supabase: SupabaseClient,
  idToken: string
) {
  return supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  })
}

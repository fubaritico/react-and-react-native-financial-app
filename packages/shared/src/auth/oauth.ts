import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Initiates Google OAuth sign-in via Supabase redirect flow (web only).
 * Supabase validates redirectTo against configured Site URLs in the dashboard.
 * @param supabase - Browser Supabase client
 * @param redirectTo - URL to redirect to after successful authentication
 * @returns OAuth response with redirect URL
 */
export async function signInWithGoogle(
  supabase: SupabaseClient,
  redirectTo: string
) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}

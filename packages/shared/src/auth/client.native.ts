import { createClient } from '@supabase/supabase-js'

import { createSupabaseAuthAdapter } from './adapter.supabase'
import type { IAuthClient, IAuthStorage } from './types'

/**
 * Creates an auth client for React Native apps with pluggable storage.
 * @param storage - Secure storage adapter (e.g., expo-secure-store or encrypted AsyncStorage).
 *   Must use encrypted storage — plain AsyncStorage leaks tokens.
 * @throws Error if EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY env vars are missing
 * @returns Vendor-agnostic auth client configured for native with auto-refresh and session persistence
 */
export function createNativeClient(storage: IAuthStorage): IAuthClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      '[auth] Missing env vars: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set. ' +
        'Check your app .env file against .env.example.'
    )
  }

  const supabase = createClient(url, key, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
  return createSupabaseAuthAdapter(supabase)
}

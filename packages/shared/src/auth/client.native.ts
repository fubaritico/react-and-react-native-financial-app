import { createClient } from '@supabase/supabase-js'

import type { IAuthStorage } from './types'

/**
 * Creates a Supabase client for React Native apps with pluggable storage.
 * @param storage - Secure storage adapter (e.g., expo-secure-store or encrypted AsyncStorage).
 *   Must use encrypted storage — plain AsyncStorage leaks tokens.
 * @returns Supabase client configured for native with auto-refresh and session persistence
 */
export function createNativeClient(storage: IAuthStorage) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

  return createClient(url, key, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}

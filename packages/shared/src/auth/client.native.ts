import { createClient } from '@supabase/supabase-js'

import { createSupabaseAuthAdapter } from './adapter.supabase'
import type { IAuthClient, IAuthStorage } from './types'

/** Optional config for non-Expo environments where EXPO_PUBLIC_* env vars are unavailable */
export interface INativeClientConfig {
  /** Supabase project URL */
  url: string
  /** Supabase anonymous key */
  anonKey: string
}

/**
 * Creates an auth client for React Native apps with pluggable storage.
 * @param storage - Secure storage adapter (e.g., expo-secure-store or encrypted AsyncStorage).
 *   Must use encrypted storage — plain AsyncStorage leaks tokens.
 * @param config - Optional URL/key override for bare RN CLI (where EXPO_PUBLIC_* env vars are unavailable).
 *   If omitted, reads from EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
 * @throws Error if neither config params nor env vars provide URL and anon key
 * @returns Vendor-agnostic auth client configured for native with auto-refresh and session persistence
 */
export function createNativeClient(
  storage: IAuthStorage,
  config?: INativeClientConfig
): IAuthClient {
  const url = config?.url ?? process.env.EXPO_PUBLIC_SUPABASE_URL
  const key = config?.anonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      '[auth] Missing Supabase credentials. Either pass { url, anonKey } config or set ' +
        'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars. ' +
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

import { createBrowserClient as createSupaBrowserClient } from '@supabase/ssr'

import { createSupabaseAuthAdapter } from './adapter.supabase'

import type { IAuthClient } from './types'

/**
 * Creates an auth client for browser-side (client component) usage.
 * Uses HTTP-only cookies managed by @supabase/ssr for session persistence.
 * @throws Error if VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars are missing
 * @returns Vendor-agnostic auth client
 */
export function createBrowserClient(): IAuthClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  if (!url || !key) {
    throw new Error(
      '[auth] Missing env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. ' +
        'Check apps/web/.env against .env.example.'
    )
  }

  const supabase = createSupaBrowserClient(url, key)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- @supabase/ssr factory returns wider generic than SupabaseClient default
  return createSupabaseAuthAdapter(supabase)
}

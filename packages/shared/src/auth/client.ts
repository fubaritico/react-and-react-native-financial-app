import { createBrowserClient as createSupaBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for browser-side (client component) usage.
 * Uses HTTP-only cookies managed by @supabase/ssr for session persistence.
 * @returns Supabase browser client instance
 */
export function createBrowserClient() {
  return createSupaBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

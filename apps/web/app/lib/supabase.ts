import { createBrowserClient } from '@financial-app/shared'

/**
 * Singleton auth client for the web app (cookie-based browser client).
 * Guarded by `typeof document` to prevent instantiation during SSR —
 * `createBrowserClient()` calls Supabase's token refresh on construction,
 * which requires browser APIs (cookies, fetch with credentials).
 * During SSR, no code calls methods on `authClient` (hooks use useEffect,
 * which doesn't execute server-side).
 */
export const authClient =
  typeof document !== 'undefined'
    ? createBrowserClient()
    : (({} as unknown) as ReturnType<typeof createBrowserClient>)

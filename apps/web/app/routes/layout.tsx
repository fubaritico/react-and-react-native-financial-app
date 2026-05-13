import { client } from '@financial-app/http-client/client'
import { requireAuth } from '@financial-app/shared'
import { Outlet, redirect } from 'react-router'

import { Sidebar } from '../components/Sidebar'
import { authClient } from '../lib/supabase'

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/**
 * Protects all child routes — redirects to /login if not authenticated.
 * Also eagerly configures the HTTP client with the current access token
 * so child clientLoaders can call ensureQueryData immediately.
 */
export async function clientLoader() {
  const result = await requireAuth(authClient)
  if ('message' in result) {
    // React Router loaders use throw redirect() — it throws a Response, not an Error
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect('/login')
  }

  // Eagerly configure HTTP client before child loaders run
  client.setConfig({
    baseUrl: API_URL,
    auth: async () => {
      const { session } = await authClient.getSession()
      return session?.access_token
    },
  })

  return null
}

/**
 * Shell layout for authenticated routes — sidebar + scrollable main content.
 * Mobile/tablet: content fills viewport, bottom nav bar is fixed.
 * Desktop (lg+): sidebar on left, content on right.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-beige-100">
      <Sidebar />
      <main className="@container flex-1 overflow-y-auto pb-24 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

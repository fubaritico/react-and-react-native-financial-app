import { Outlet } from 'react-router'

import { Sidebar } from '../components/Sidebar'

// TODO (Phase 8): wire requireAuth in a parent loader to protect all child routes
// import { redirect } from 'react-router'
// import { createServerClient, requireAuth } from '@financial-app/shared/auth/client.server'
//
// export async function loader({ request }: Route.LoaderArgs) {
//   const { authClient, headers } = createServerClient(request)
//   const result = await requireAuth(authClient)
//   if ('message' in result) throw redirect('/login', { headers })
//   return Response.json({ user: result.user }, { headers })
// }

/**
 * Shell layout for authenticated routes — sidebar + scrollable main content.
 * Mobile/tablet: content fills viewport, bottom nav bar is fixed.
 * Desktop (lg+): sidebar on left, content on right.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-beige-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

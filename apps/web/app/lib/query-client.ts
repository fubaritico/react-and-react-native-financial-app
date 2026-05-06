import { createAppQueryClient } from '@financial-app/shared'

/**
 * Module-level QueryClient singleton for the web app.
 * Accessible from React Router `clientLoader` functions (outside React tree).
 */
export const queryClient = createAppQueryClient()

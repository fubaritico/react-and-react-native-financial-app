import { createBrowserClient } from '@financial-app/shared'

/** Singleton auth client for the web app (cookie-based browser client) */
export const authClient = createBrowserClient()

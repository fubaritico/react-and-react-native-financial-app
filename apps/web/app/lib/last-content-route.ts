/**
 * Tracks the last "content" route the user visited so that leaving Settings returns
 * to where they came from — not to a Settings sub-screen. Web mirror of the native
 * `lastContentTab` mechanism in apps/mobile-expo/app/(tabs)/_layout.tsx.
 *
 * Module-level + client-only: written from the layout's location effect, read from
 * Settings navigation handlers. Never touched during SSR (the effect runs on the
 * client, the read happens in a click handler), so the shared module instance on the
 * server stays at its constant default and is never observed cross-request.
 */

/**
 * Last content route visited. Mutable module singleton — written only from a
 * client-side `useEffect` (never during SSR) and read only from click handlers,
 * so the server module instance stays at its `/` default and is never observed
 * cross-request. Defaults to the overview (`/`) so Settings always has a target.
 */
let lastContentRoute = '/'

/**
 * Records `pathname` as the last content route unless it is a Settings screen
 * (`/settings` or any `/settings/*` sub-route). The prefix check excludes future
 * settings sub-routes automatically.
 * @param pathname - The current location pathname
 * @returns void
 */
export function trackContentRoute(pathname: string): void {
  if (!pathname.startsWith('/settings')) {
    lastContentRoute = pathname
  }
}

/**
 * Returns the last visited content route — the screen to return to when leaving Settings.
 * @returns The last content route pathname (defaults to `/`)
 */
export function getLastContentRoute(): string {
  return lastContentRoute
}

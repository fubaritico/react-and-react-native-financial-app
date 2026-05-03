import type { ReactNode } from 'react'

/**
 * PortalProvider — web pass-through.
 * On web, portals use DOM createPortal directly, so no provider is needed.
 * This exists to satisfy imports in cross-platform code (e.g. Storybook native stories).
 */
export function PortalProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}

import { createContext, useContext } from 'react'

import type { ReactNode } from 'react'

/** Context for the native Portal system — renders content above the app in an absolute layer. */
export const PortalContext = createContext<{
  /** Set portal content for a given key. Pass null to clear. */
  setContent: (key: string, content: ReactNode | null) => void
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContent: () => {},
})

/** Hook to access the portal context. */
export function usePortal() {
  return useContext(PortalContext)
}

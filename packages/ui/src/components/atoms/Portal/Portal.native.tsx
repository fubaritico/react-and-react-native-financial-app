import { useEffect, useId } from 'react'

import { usePortal } from './PortalContext'

import type { IPortalProps } from './Portal'

/**
 * Native Portal — renders children into the PortalProvider's absolute layer.
 * Each Portal instance gets a unique key via useId() so multiple portals can coexist.
 */
export function Portal({ children }: Readonly<IPortalProps>) {
  const portalKey = useId()
  const { setContent } = usePortal()

  useEffect(() => {
    setContent(portalKey, children)
    return () => {
      setContent(portalKey, null)
    }
  }, [portalKey, setContent, children])

  return null
}

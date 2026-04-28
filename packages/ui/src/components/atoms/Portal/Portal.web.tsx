import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { IPortalProps } from './Portal'

/**
 * Web Portal — renders children into a detached DOM node appended
 * to a shared `#portal` root. Creates the root lazily if it does not exist.
 */
export function Portal({ children, id }: Readonly<IPortalProps>) {
  const [container] = useState(() => {
    const el = document.createElement('div')
    if (id) el.id = id
    return el
  })

  useEffect(() => {
    let portalRoot = document.getElementById('portal')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'portal'
      document.body.appendChild(portalRoot)
    }

    portalRoot.appendChild(container)

    return () => {
      container.remove()
      if (portalRoot.childNodes.length === 0) {
        portalRoot.remove()
      }
    }
  }, [container, id])

  return createPortal(children, container)
}

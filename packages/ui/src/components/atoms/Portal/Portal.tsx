import type { ReactNode } from 'react'

/** Props for the Portal component. */
export interface IPortalProps {
  /** Content to render in the portal */
  children: ReactNode
  /** Optional id for the portal container element (web only) */
  id?: string
}

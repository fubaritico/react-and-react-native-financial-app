import type { ReactNode } from 'react'

/** Props for the ModalRenderer wrapper */
export interface IModalRendererProps {
  /** App content — rendered as-is, Modal overlays on top when config is non-null */
  children: ReactNode
}

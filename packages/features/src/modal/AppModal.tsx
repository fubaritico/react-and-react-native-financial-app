import type { ReactNode } from 'react'

/** Props for the ModalProvider wrapper */
export interface IModalProviderProps {
  /** App content — rendered as-is, Modal overlays on top when config is non-null */
  children: ReactNode
}

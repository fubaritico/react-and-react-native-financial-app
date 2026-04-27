import { createContext, useContext } from 'react'

interface IModalContext {
  /** Called when the modal should close */
  onClose: () => void
}

export const ModalContext = createContext<IModalContext | null>(null)

/** Access the Modal compound context — must be used within a Modal root */
export function useModalContext(): IModalContext {
  const ctx = useContext(ModalContext)
  if (!ctx) {
    throw new Error(
      'Modal compound components must be used within a <Modal> root'
    )
  }
  return ctx
}

import type { IModalConfig } from '@financial-app/shared'

import type { ReactNode } from 'react'

/** Modal control interface (subset of useModal return) */
export interface IModalHandle {
  /** Opens a modal with the given config */
  open: (config: IModalConfig) => void
  /** Closes the current modal */
  close: () => void
  /** Sets the submitting state on the current modal */
  setSubmitting: (isSubmitting: boolean) => void
}

/** Return type of useFeedbackModals */
export interface IFeedbackModals {
  /** Opens a brief confirmation modal after a successful mutation */
  showSuccess: (message: string) => void
  /** Opens an error modal after a failed mutation */
  showError: (err: unknown) => void
}

/** Return type of useDeleteBodyRenderer */
export interface IDeleteBodyRenderer {
  /** Renders a delete confirmation description as a Typography body */
  renderDeleteBody: (description: string) => ReactNode
}

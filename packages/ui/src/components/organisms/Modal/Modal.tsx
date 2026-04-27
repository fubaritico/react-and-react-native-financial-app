import type { ReactNode } from 'react'

/** Props for the Modal root component (compound provider) */
export interface IModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Called when the modal should close (close button, Escape, backdrop, cancel) */
  onClose: () => void
  /** Compound children: Modal.Header, Modal.Body, Modal.Footer */
  children: ReactNode
  /** Accessible label for the modal dialog (falls back to the header title) */
  accessibilityLabel?: string
}

/** Props for Modal.Header */
export interface IModalHeaderProps {
  /** Modal title text */
  title: string
  /** Close button accessible label (i18n — pass translated string) */
  closeLabel?: string
}

/** Props for Modal.Body */
export interface IModalBodyProps {
  /** Body content — any React component injected dynamically */
  children: ReactNode
}

/** Button variant for modal footer actions */
export type ModalActionVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destroy'

/** Configuration for a single action button in the modal footer */
export interface IModalFooterAction {
  /** Button label text (i18n — pass translated string) */
  label: string
  /** Button visual variant */
  variant: ModalActionVariant
  /** Callback fired when the action button is pressed */
  onPress: () => void
  /** Whether the button is disabled */
  disabled?: boolean
}

/** Props for Modal.Footer */
export interface IModalFooterProps {
  /** Action buttons rendered above the cancel button */
  actions: IModalFooterAction[]
  /** Cancel button label (i18n — pass translated string, defaults to "Cancel") */
  cancelLabel?: string
}

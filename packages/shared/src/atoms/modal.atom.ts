import { atom } from 'jotai'

import type { ReactNode } from 'react'

/** Button variant for modal actions */
export type ModalActionVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destroy'

/** Configuration for a single action button in the modal footer */
export interface IModalAction {
  /** Button label text (i18n — pass translated string) */
  label: string
  /** Button visual variant */
  variant: ModalActionVariant
  /** Callback fired when the action button is pressed */
  onPress: () => void
  /** Whether the button is disabled */
  disabled?: boolean
}

/** Full configuration for the modal content */
export interface IModalConfig {
  /** Modal title displayed in the header */
  title: string
  /** Optional description text below the title */
  description?: string
  /** Dynamic body content — any React component */
  body?: ReactNode
  /** Action buttons rendered in the footer (above the cancel button) */
  actions: IModalAction[]
  /** Custom cancel button label (i18n — defaults to "Cancel") */
  cancelLabel?: string
}

/** Modal state atom — null means closed, IModalConfig means open */
export const modalConfigAtom = atom<IModalConfig | null>(null)

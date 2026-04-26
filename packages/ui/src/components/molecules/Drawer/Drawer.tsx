import type { ListboxVariant } from '../Listbox/Listbox'
import type { ReactNode } from 'react'

/** Props for the Drawer root component */
export interface IDrawerProps {
  /** Whether the drawer is visible */
  open: boolean
  /** Called when the drawer should close (close button, Escape, overlay tap) */
  onClose: () => void
  /** Color scheme matching Menu/Listbox conventions */
  variant?: ListboxVariant
  /** Show a backdrop overlay behind the drawer */
  overlay?: boolean
  /** Compound children: Drawer.Header, Drawer.Body */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Accessible label for the drawer dialog */
  accessibilityLabel?: string
}

/** Props for Drawer.Header */
export interface IDrawerHeaderProps {
  /** Header content (typically a title) */
  children?: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Close button accessible label */
  closeLabel?: string
}

/** Props for Drawer.Body */
export interface IDrawerBodyProps {
  /** Body content */
  children?: ReactNode
  /** Additional CSS class (web) */
  className?: string
}

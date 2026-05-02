import type { ListboxVariant } from '../Listbox/Listbox'
import type { ReactNode } from 'react'

/** Props for the BottomSheet root component */
export interface IBottomSheetProps {
  /** Whether the bottom sheet is visible */
  open: boolean
  /** Called when the bottom sheet should close (close button, Escape, overlay tap) */
  onClose: () => void
  /** Color scheme matching Menu/Listbox conventions */
  variant?: ListboxVariant
  /** Show a backdrop overlay behind the bottom sheet */
  overlay?: boolean
  /** Compound children: BottomSheet.Header, BottomSheet.Body */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Accessible label for the bottom sheet dialog */
  accessibilityLabel?: string
}

/** Props for BottomSheet.Header */
export interface IBottomSheetHeaderProps {
  /** Header content (typically a title) */
  children?: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Close button accessible label */
  closeLabel?: string
}

/** Props for BottomSheet.Body */
export interface IBottomSheetBodyProps {
  /** Body content */
  children?: ReactNode
  /** Additional CSS class (web) */
  className?: string
}

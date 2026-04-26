import type { ReactNode } from 'react'

/** Color scheme for listbox components */
export type ListboxVariant = 'light' | 'dark'

/** Props for the ListboxList container */
export interface IListboxListProps {
  /** Color scheme */
  variant?: ListboxVariant
  /** List content (ListboxItem children) */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Accessible label for the listbox */
  accessibilityLabel?: string
}

/** Props for individual ListboxItem */
export interface IListboxItemProps {
  /** Color scheme */
  variant?: ListboxVariant
  /** Whether this item has keyboard/hover focus */
  isActive?: boolean
  /** Whether this item is the persistently selected value */
  isSelected?: boolean
  /** Whether the item is non-interactive */
  disabled?: boolean
  /** Item content */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Callback when the item is pressed */
  onPress?: () => void
  /** Unique DOM id for aria-activedescendant (web) */
  id?: string
}

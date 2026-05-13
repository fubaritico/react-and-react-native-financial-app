import { listboxListVariants } from '#Molecules/Listbox/Listbox.variants'

import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

/** Color scheme for listbox components */
export type ListboxVariant = 'light' | 'dark'
export type ListboxVariantProps = VariantProps<typeof listboxListVariants>

/** Props for the ListboxList container */
export interface IListboxListProps extends ListboxVariantProps {
  /** List content (ListboxItem children) */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Accessible label for the listbox */
  accessibilityLabel?: string
}

/** Props for individual ListboxItem */
export interface IListboxItemProps extends ListboxVariantProps {
  /** Whether this item has keyboard/hover focus */
  isActive?: boolean
  /** Whether this item is the persistently selected value */
  isSelected?: boolean
  /** Whether the item is non-interactive */
  disabled?: boolean
  /** Whether the item uses destructive (red) styling */
  destructive?: boolean
  /** Item content */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Callback when the item is pressed */
  onPress?: () => void
  /** Unique DOM id for aria-activedescendant (web) */
  id?: string
  /** When true, children are rendered directly without a Typography wrapper */
  rawContent?: boolean
}

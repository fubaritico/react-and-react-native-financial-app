import type { ListboxVariant } from '../Listbox/Listbox'
import type { ReactNode } from 'react'

/** Props for the Menu compound component */
export interface IMenuProps {
  /** Currently selected item value (controls bold highlight) */
  selectedValue?: string
  /** Color scheme: light (default) or dark */
  variant?: ListboxVariant
  /** Called when an item is selected via click or keyboard */
  onSelect?: (value: string) => void
  /** Called when Escape is pressed or menu should close */
  onClose?: () => void
  /** Menu items (Menu.Item children) */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** Accessible label for the menu */
  accessibilityLabel?: string
}

/** Props for Menu.Item */
export interface IMenuItemProps {
  /** Unique value identifying this item, passed to onSelect */
  value: string
  /** Position index for keyboard navigation ordering */
  index: number
  /** Whether the item is non-interactive */
  disabled?: boolean
  /** Item label */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
}

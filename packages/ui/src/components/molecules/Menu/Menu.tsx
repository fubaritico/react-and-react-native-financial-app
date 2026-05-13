import type { ListboxVariantProps } from '../Listbox/Listbox'
import type { ReactNode } from 'react'

/** Props for the Menu compound component */
export interface IMenuProps extends ListboxVariantProps {
  /** Currently selected item value (controls bold highlight) */
  selectedValue?: string
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
  /** Whether the item uses destructive (red) styling */
  destructive?: boolean
  /** Item label */
  children: ReactNode
  /** Additional CSS class (web) */
  className?: string
  /** When true, children are rendered directly without a Typography wrapper */
  rawContent?: boolean
}

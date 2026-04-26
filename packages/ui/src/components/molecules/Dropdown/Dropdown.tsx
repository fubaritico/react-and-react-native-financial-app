import type { ReactNode } from 'react'

/** Single option in the dropdown */
export interface IDropdownOption {
  /** Unique value for this option */
  value: string
  /** Display label for this option */
  label: string
  /** Whether this option is non-interactive */
  disabled?: boolean
}

/** Props for the Dropdown component */
export interface IDropdownProps {
  /** Label displayed before the trigger button (e.g. "Sort by", "Category") */
  label?: string
  /** List of selectable options */
  options: IDropdownOption[]
  /** Currently selected value */
  selectedValue: string
  /** Called when an option is selected */
  onSelect: (value: string) => void
  /** Accessible label for the trigger button */
  accessibilityLabel?: string
  /** Accessible label for the menu/drawer */
  menuAccessibilityLabel?: string
  /** Drawer header title (shown in mobile/tablet drawer mode) */
  drawerTitle?: string
  /** Close button label for drawer (a11y) */
  drawerCloseLabel?: string
  /** Render the floating menu inside a Portal (web desktop only). Useful when the dropdown is inside an overflow-hidden container. */
  withPortal?: boolean
  /** Custom trigger content — overrides default button rendering */
  trigger?: (props: { isOpen: boolean; selectedLabel: string }) => ReactNode
}

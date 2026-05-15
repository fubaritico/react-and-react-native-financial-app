import type { ReactNode } from 'react'

/** Single option in the dropdown */
export interface IDropdownOption {
  /** Unique value for this option */
  value: string
  /** Display label for this option */
  label: string
  /** Whether this option is non-interactive */
  disabled?: boolean
  /** Renders a Divider before this item */
  dividerBefore?: boolean
  /** Renders in destructive (red) styling */
  destructive?: boolean
}

/** Button variant for the dropdown trigger */
export type DropdownButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destroy'
  | 'outline'

/** Button size for the dropdown trigger */
export type DropdownButtonSize = 'lg' | 'md' | 'sm' | 'nav'

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
  /** Accessible label for the menu/bottom sheet */
  menuAccessibilityLabel?: string
  /** BottomSheet header title (shown in mobile/tablet bottom sheet mode) */
  bottomSheetTitle?: string
  /** Close button label for bottom sheet (a11y) */
  bottomSheetCloseLabel?: string
  /** Render the floating menu inside a Portal (web desktop only). Useful when the dropdown is inside an overflow-hidden container. */
  withPortal?: boolean
  /** Custom trigger content — replaces default label + caret inside the button */
  trigger?: (props: { isOpen: boolean; selectedLabel: string }) => ReactNode
  /** Button variant for the trigger (default: 'outline') */
  buttonVariant?: DropdownButtonVariant
  /** Button size for the trigger (default: 'md') */
  buttonSize?: DropdownButtonSize
  /** Additional className for the trigger button */
  buttonClassName?: string
  /** Whether the trigger button takes full width (default: true when no trigger) */
  buttonFullWidth?: boolean
  /** Whether the trigger button centers its content */
  buttonCentered?: boolean
  /** Horizontal alignment of the floating menu relative to the trigger. 'left' aligns the menu's left edge with the trigger's left edge (default). 'right' aligns the menu's right edge with the trigger's right edge. */
  position?: 'left' | 'right'
  /** Custom renderer for each menu item — replaces the default label text. When provided, items use rawContent (no Typography wrapper). */
  renderItem?: (
    option: IDropdownOption,
    context: { isSelected: boolean }
  ) => ReactNode
}

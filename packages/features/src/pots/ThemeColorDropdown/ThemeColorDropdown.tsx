import type { IDropdownOption } from '@financial-app/ui'

/** Props for the ThemeColorDropdown component */
export interface IThemeColorDropdownProps {
  /** Theme color options with labels */
  options: IDropdownOption[]
  /** Currently selected theme value (token name) */
  selectedValue: string
  /** Called when a theme is selected */
  onSelect: (value: string) => void
  /** Accessible label for the dropdown */
  accessibilityLabel?: string
  /** BottomSheet header title */
  bottomSheetTitle?: string
  /** Label shown for already-used themes (default: "Already used") */
  alreadyUsedLabel: string
  /** Placeholder text shown when no color is selected */
  placeholder?: string
  /** Additional className for the trigger button */
  buttonClassName?: string
}

import type { IDropdownOption } from '@financial-app/ui'

/** Props for the BudgetThemeDropdown component */
export interface IBudgetThemeDropdownProps {
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
  alreadyUsedLabel?: string
}

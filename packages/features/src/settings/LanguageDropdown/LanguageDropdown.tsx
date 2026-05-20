/** Props for the LanguageDropdown component */
export interface ILanguageDropdownProps {
  /** Currently selected language code ('en' | 'fr') */
  selectedValue: string
  /** Called when a language is selected */
  onSelect: (value: string) => void
  /** Accessible label for the dropdown */
  accessibilityLabel?: string
  /** BottomSheet header title */
  bottomSheetTitle?: string
}

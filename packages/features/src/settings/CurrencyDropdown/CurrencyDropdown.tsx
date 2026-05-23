import type { SupportedCurrency } from '@financial-app/shared'

/** Props for the CurrencyDropdown component */
export interface ICurrencyDropdownProps {
  /** Currently selected currency code ('USD' | 'EUR' | 'GBP') */
  selectedValue: SupportedCurrency
  /** Called when a currency is selected */
  onSelect: (value: SupportedCurrency) => void
  /** Accessible label for the dropdown */
  accessibilityLabel: string
  /** BottomSheet header title */
  bottomSheetTitle: string
}

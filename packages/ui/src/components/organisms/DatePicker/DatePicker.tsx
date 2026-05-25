import type { datePickerVariants } from './DatePicker.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the DatePicker component */
export interface IDatePickerProps extends VariantProps<
  typeof datePickerVariants
> {
  /** Selected date as ISO string (e.g. "2024-07-29") or null */
  value: string | null
  /** Callback with the selected date as ISO string */
  onChange: (isoDate: string) => void
  /** Label displayed above the field */
  label?: string
  /** Placeholder when no date is selected */
  placeholder?: string
  /** Minimum selectable date (ISO string) */
  min?: string
  /** Maximum selectable date (ISO string) */
  max?: string
  /** Error message displayed below the field */
  helperText?: string
  /** Disables the field */
  disabled?: boolean
  /** Accessible label when no visible label is present */
  accessibilityLabel?: string
  /** Title displayed in the BottomSheet header (mobile). Falls back to `label`. */
  bottomSheetTitle?: string
  /** Close button label for BottomSheet (mobile a11y). */
  bottomSheetCloseLabel?: string
}

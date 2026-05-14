import type { checkboxVariants } from './Checkbox.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the Checkbox component */
export interface ICheckboxProps extends VariantProps<typeof checkboxVariants> {
  /** Whether the checkbox is checked */
  checked: boolean
  /** Callback when the checkbox value changes */
  onChange: (checked: boolean) => void
  /** Label text displayed next to the checkbox */
  label?: string
  /** Disables the checkbox */
  disabled?: boolean
  /** Whether the checkbox is in an indeterminate (mixed) state */
  indeterminate?: boolean
  /** Error message displayed below the checkbox */
  error?: string
  /** Accessible label (overrides label for screen readers) */
  accessibilityLabel?: string
}

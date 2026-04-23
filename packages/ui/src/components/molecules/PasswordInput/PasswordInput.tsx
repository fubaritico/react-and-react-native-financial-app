import type { textInputVariants } from '../TextInput/TextInput.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the PasswordInput component. */
export interface IPasswordInputProps extends VariantProps<
  typeof textInputVariants
> {
  /** Label displayed above the input. */
  label: string
  /** Current input value. */
  value: string
  /** Callback fired when the input value changes. */
  onChangeText: (text: string) => void
  /** Placeholder text shown when empty. */
  placeholder?: string
  /** Helper text displayed below the input. */
  helperText?: string
  /** Whether to show the visibility toggle button. */
  showToggle?: boolean
}

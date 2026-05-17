import type { otpCellVariants } from './OtpInput.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the OtpInput component */
export interface IOtpInputProps extends VariantProps<typeof otpCellVariants> {
  /** Number of OTP digit cells (default: 6) */
  length?: number
  /** Current OTP value string */
  value: string
  /** Callback fired when the OTP value changes */
  onChangeText: (value: string) => void
  /** Callback fired when all digits are filled */
  onComplete?: (code: string) => void
  /** Whether the input is in an error state */
  hasError?: boolean
  /** Whether the input is disabled */
  disabled?: boolean
  /** Accessible label for the OTP input group */
  accessibilityLabel: string
}

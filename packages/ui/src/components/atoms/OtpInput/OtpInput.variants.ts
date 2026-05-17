import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for each OTP cell — controls size, focus, error, and disabled states */
export const otpCellVariants = cva(
  'items-center justify-center rounded-lg border-2 text-center',
  {
    variants: {
      size: {
        sm: 'h-10 w-10',
        md: 'h-12 w-12',
        lg: 'h-14 w-14',
      },
      focused: {
        true: 'border-grey-900',
        false: 'border-beige-500',
      },
      hasError: {
        true: 'border-destructive',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: {
      size: 'md',
      focused: false,
      hasError: false,
      disabled: false,
    },
  }
)

export type OtpCellVariants = VariantProps<typeof otpCellVariants>

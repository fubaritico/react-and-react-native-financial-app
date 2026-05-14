import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the DatePicker trigger — mirrors TextInput styling */
export const datePickerVariants = cva(
  'rounded-md border border-input bg-card px-5 py-3 text-sm text-foreground',
  {
    variants: {
      error: {
        true: 'border-destructive',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: { error: false, disabled: false },
  }
)

export type DatePickerVariants = VariantProps<typeof datePickerVariants>

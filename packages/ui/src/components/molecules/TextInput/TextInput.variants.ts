import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the TextInput component — controls border color based on error state */
export const textInputVariants = cva(
  'h-12 rounded-md border border-input bg-card px-5 text-sm text-foreground',
  {
    variants: {
      error: {
        true: 'border-destructive',
      },
    },
    defaultVariants: { error: false },
  }
)

export type TextInputVariants = VariantProps<typeof textInputVariants>

import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const textInputVariants = cva(
  'rounded-md border border-input bg-card px-5 py-3 text-sm text-foreground',
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

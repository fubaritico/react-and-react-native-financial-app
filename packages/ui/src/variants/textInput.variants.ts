import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const textInputVariants = cva(
  'rounded-md border border-grey-500 bg-white px-5 py-3 text-sm text-grey-900',
  {
    variants: {
      error: {
        true: 'border-red',
      },
    },
    defaultVariants: { error: false },
  }
)

export type TextInputVariants = VariantProps<typeof textInputVariants>

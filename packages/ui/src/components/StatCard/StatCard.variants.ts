import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const statCardVariants = cva(
  'rounded-lg flex-col gap-1 py-2 px-4 border-l-4',
  {
    variants: {},
    defaultVariants: {},
  }
)

export type StatCardVariants = VariantProps<typeof statCardVariants>

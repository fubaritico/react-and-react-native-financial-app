import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the StatCard component — controls base layout, padding, and left accent border */
export const statCardVariants = cva(
  'rounded-lg flex-col gap-1 py-2 px-4 border-l-4',
  {
    variants: {},
    defaultVariants: {},
  }
)

export type StatCardVariants = VariantProps<typeof statCardVariants>

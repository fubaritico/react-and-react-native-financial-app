import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const cardVariants = cva('bg-card rounded-xl p-4 shadow-md', {
  variants: {},
  defaultVariants: {},
})

export type CardVariants = VariantProps<typeof cardVariants>

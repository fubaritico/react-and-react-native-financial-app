import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const cardVariants = cva('bg-white rounded-xl p-4', {
  variants: {},
  defaultVariants: {},
})

export type CardVariants = VariantProps<typeof cardVariants>

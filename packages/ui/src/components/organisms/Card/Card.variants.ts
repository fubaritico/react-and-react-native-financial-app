import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Card organism — controls base surface color, border radius, padding, and shadow */
export const cardVariants = cva('bg-card rounded-xl p-4 shadow-md', {
  variants: {},
  defaultVariants: {},
})

export type CardVariants = VariantProps<typeof cardVariants>

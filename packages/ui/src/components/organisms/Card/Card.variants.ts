import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Card organism — surface color and border radius only, padding is responsive per platform */
export const cardVariants = cva('bg-card rounded-md', {
  variants: {},
  defaultVariants: {},
})

export type CardVariants = VariantProps<typeof cardVariants>

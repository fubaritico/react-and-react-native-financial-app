import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Skeleton component — controls root container */
export const skeletonVariants = cva('relative overflow-hidden bg-muted', {
  variants: {},
  defaultVariants: {},
})

export type SkeletonVariants = VariantProps<typeof skeletonVariants>

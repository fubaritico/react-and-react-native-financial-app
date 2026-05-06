import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Alert component — controls root container shape and layout */
export const alertVariants = cva('relative overflow-hidden rounded-md p-4', {
  variants: {},
  defaultVariants: {},
})

export type AlertVariants = VariantProps<typeof alertVariants>

import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Header organism — controls padding and primary background color */
export const headerVariants = cva('py-4 px-5 bg-primary', {
  variants: {},
  defaultVariants: {},
})

export type HeaderVariants = VariantProps<typeof headerVariants>

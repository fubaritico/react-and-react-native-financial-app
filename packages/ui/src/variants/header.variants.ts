import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const headerVariants = cva('py-4 px-5 bg-primary', {
  variants: {},
  defaultVariants: {},
})

export type HeaderVariants = VariantProps<typeof headerVariants>

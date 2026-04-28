import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the BillSummaryRow component — controls base layout, padding, background, and left accent border */
export const billSummaryRowVariants = cva(
  'rounded-lg flex-row items-center justify-between py-4 px-4 bg-beige-100 border-l-4',
  {
    variants: {},
    defaultVariants: {},
  }
)

export type BillSummaryRowVariants = VariantProps<typeof billSummaryRowVariants>

import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const coloredBorderItemVariants = cva('rounded-lg', {
  variants: {
    layout: {
      stacked: 'flex-col gap-1 py-2 px-4',
      row: 'flex-row items-center justify-between py-4 px-4',
    },
  },
  defaultVariants: { layout: 'stacked' },
})

export type ColoredBorderItemVariants = VariantProps<
  typeof coloredBorderItemVariants
>

import { cva } from 'class-variance-authority'

export const dataTableRowVariants = cva('', {
  variants: {
    divider: {
      true: 'border-b border-border',
    },
  },
  defaultVariants: { divider: true },
})

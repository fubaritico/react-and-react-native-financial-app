import { cva } from 'class-variance-authority'

/** CVA variants for the DataTable row — controls optional bottom divider between rows */
export const dataTableRowVariants = cva('', {
  variants: {
    divider: {
      true: 'border-b border-border',
    },
  },
  defaultVariants: { divider: true },
})

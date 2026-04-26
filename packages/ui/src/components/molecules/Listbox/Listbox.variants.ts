import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** Variants for the ListboxList container */
export const listboxListVariants = cva('rounded-lg p-1', {
  variants: {
    variant: {
      light: 'bg-white border border-border',
      dark: 'bg-grey-900 border border-grey-500',
    },
  },
  defaultVariants: { variant: 'light' },
})

/** Variants for individual ListboxItem */
export const listboxItemVariants = cva('rounded-md px-5 py-3 text-sm', {
  variants: {
    variant: {
      light: 'text-foreground',
      dark: 'text-white',
    },
    isActive: {
      true: '',
    },
    isSelected: {
      true: 'font-bold',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: { variant: 'light' },
})

export type ListboxListVariants = VariantProps<typeof listboxListVariants>
export type ListboxItemVariants = VariantProps<typeof listboxItemVariants>

import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Tooltip bubble — controls visual style and max dimensions. */
export const tooltipVariants = cva('rounded-lg px-4 py-3 text-sm', {
  variants: {
    variant: {
      dark: 'bg-grey-900 text-white',
      light: 'bg-white text-grey-900',
    },
  },
  defaultVariants: { variant: 'dark' },
})

export type TooltipVariants = VariantProps<typeof tooltipVariants>

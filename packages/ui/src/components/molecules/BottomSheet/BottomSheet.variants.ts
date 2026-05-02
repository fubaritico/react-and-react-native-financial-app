import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** Variants for the BottomSheet root container */
export const bottomSheetVariants = cva('rounded-t-xl', {
  variants: {
    variant: {
      light: 'bg-white text-foreground',
      dark: 'bg-grey-900 text-white',
    },
  },
  defaultVariants: { variant: 'dark' },
})

export type BottomSheetVariants = VariantProps<typeof bottomSheetVariants>

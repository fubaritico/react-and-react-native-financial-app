import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the ProgressBar track — controls height, padding, and rounding via size variant */
export const progressBarVariants = cva('w-full bg-beige-100 overflow-hidden', {
  variants: {
    size: {
      thick: 'h-8 p-1 rounded-md',
      thin: 'h-2 rounded-lg',
    },
  },
  defaultVariants: { size: 'thick' },
})

/** CVA variant props for ProgressBar. */
export type ProgressBarVariants = VariantProps<typeof progressBarVariants>

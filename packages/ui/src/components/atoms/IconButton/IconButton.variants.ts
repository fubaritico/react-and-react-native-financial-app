import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the IconButton component — circular icon-only button */
export const iconButtonVariants = cva(
  'items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-white text-foreground',
        ghost: 'bg-transparent text-foreground',
        destroy: 'bg-destructive text-destructive-foreground',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  }
)

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>

import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'rounded-md items-center justify-center py-3 px-5 text-sm font-bold',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        tertiary: 'bg-transparent text-foreground-muted',
        destroy: 'bg-destructive text-destructive-foreground',
      },
      fullWidth: {
        true: 'w-full',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

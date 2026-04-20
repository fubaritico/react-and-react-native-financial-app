import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'rounded-lg items-center justify-center py-3 px-6',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-foreground',
        outline: 'bg-transparent border-2 border-primary text-primary',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

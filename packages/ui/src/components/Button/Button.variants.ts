import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'rounded-md items-center justify-center py-3 px-5 text-sm font-bold',
  {
    variants: {
      variant: {
        primary: 'bg-grey-900 text-white',
        secondary: 'bg-beige-100 text-grey-900',
        tertiary: 'bg-transparent text-grey-500',
        destroy: 'bg-red text-white',
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

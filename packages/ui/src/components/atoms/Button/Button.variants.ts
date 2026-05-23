import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Button component — controls visual style (variant), size, full-width layout, and disabled state */
export const buttonVariants = cva(
  'items-center justify-between rounded-md font-sans text-sm font-bold leading-normal',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        tertiary: 'bg-transparent text-foreground-muted',
        ghost: 'bg-transparent',
        destroy: 'bg-destructive text-destructive-foreground',
        outline: 'border border-border-muted bg-transparent text-beige-500',
      },
      size: {
        lg: 'h-[53px] px-5 gap-2',
        md: 'py-3 px-5 gap-1.5',
        sm: 'h-10 w-10 px-4 gap-1',
        icon: 'h-10 w-10',
        nav: 'h-10 px-4',
      },
      fullWidth: {
        true: 'w-full',
      },
      centered: {
        true: 'justify-center',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

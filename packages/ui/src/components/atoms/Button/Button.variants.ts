import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const buttonVariants = cva('items-center justify-center rounded-md', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      tertiary: 'bg-transparent text-foreground-muted',
      destroy: 'bg-destructive text-destructive-foreground',
      outline: 'border border-border-muted bg-transparent text-foreground',
    },
    size: {
      md: 'py-3 px-5',
      sm: 'h-10 w-10',
      nav: 'h-10 px-4',
    },
    fullWidth: {
      true: 'w-full',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>

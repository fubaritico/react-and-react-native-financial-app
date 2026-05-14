import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the Checkbox box element — controls size, checked/error visual state, and disabled opacity */
export const checkboxVariants = cva(
  'flex items-center justify-center rounded-sm border-2',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
      },
      checked: {
        true: 'bg-grey-900 border-grey-900',
        false: 'bg-white border-beige-500',
      },
      hasError: {
        true: 'border-destructive',
      },
      disabled: {
        true: 'opacity-50',
      },
    },
    compoundVariants: [
      {
        checked: true,
        hasError: true,
        className: 'bg-destructive border-destructive',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
      disabled: false,
    },
  }
)

export type CheckboxVariants = VariantProps<typeof checkboxVariants>

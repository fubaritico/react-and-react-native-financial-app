import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const typographyVariants = cva('font-sans', {
  variants: {
    /** Visual style mapping to Figma text presets. */
    variant: {
      'page-title': 'text-4xl font-bold leading-tight',
      display: 'text-4xl font-bold leading-tight',
      'section-title': 'text-xl font-bold leading-tight',
      'subsection-title': 'text-base font-bold leading-normal',
      body: 'text-sm font-normal leading-normal',
      'body-bold': 'text-sm font-bold leading-normal',
      label: 'text-xs font-bold leading-normal',
      caption: 'text-xs font-normal leading-normal',
      'caption-bold': 'text-xs font-bold leading-normal',
    },
    /** Text color — maps to semantic tokens. */
    color: {
      foreground: 'text-foreground',
      muted: 'text-foreground-muted',
      success: 'text-success',
      destructive: 'text-destructive',
      inverse: 'text-primary-foreground',
    },
    /** Text alignment. */
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'foreground',
    align: 'left',
  },
})

export type TypographyVariants = VariantProps<typeof typographyVariants>

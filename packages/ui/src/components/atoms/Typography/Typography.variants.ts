import { cva } from 'class-variance-authority'

import { SEMANTIC_COLORS } from '#Lib/semanticColors'

import type { VariantProps } from 'class-variance-authority'

/** Build CVA color map from shared semantic tokens: { foreground: 'text-foreground', ... } */
const colorVariants = Object.fromEntries(
  Object.entries(SEMANTIC_COLORS).map(([key, token]) => [
    key,
    token === 'inherit' ? 'text-inherit' : `text-${token}`,
  ])
) as Record<keyof typeof SEMANTIC_COLORS, string>

export const typographyVariants = cva('font-sans', {
  variants: {
    /** Visual style mapping to Figma text presets. */
    variant: {
      'page-title': 'text-4xl font-bold leading-tight',
      'display-lg': 'text-5xl font-bold leading-tight',
      display: 'text-4xl font-bold leading-tight',
      'heading-xl': 'text-3xl font-bold leading-tight',
      'heading-lg': 'text-2xl font-bold leading-tight',
      'heading-md': 'text-xl font-bold leading-tight',
      'section-title': 'text-xl font-bold leading-tight',
      'subsection-title': 'text-base font-bold leading-normal',
      body: 'text-sm font-normal leading-normal',
      'body-bold': 'text-sm font-bold leading-normal',
      label: 'text-xs font-bold leading-normal',
      caption: 'text-xs font-normal leading-normal',
      'caption-bold': 'text-xs font-bold leading-normal',
    },
    /** Text color — maps to semantic tokens. */
    color: colorVariants,
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
  },
})

export type TypographyVariants = VariantProps<typeof typographyVariants>

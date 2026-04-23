import { createElement } from 'react'

import { cn } from '../../lib/cn'

import { VARIANT_TO_TAG } from './Typography.constants'
import { typographyVariants } from './Typography.variants'

import type { ITypographyWebProps } from './Typography.tsx'

/**
 * Typography — web implementation.
 * Renders a semantic HTML element using Figma text presets.
 */
export function Typography({
  variant,
  color,
  align,
  as,
  numberOfLines,
  children,
}: ITypographyWebProps) {
  const resolvedVariant = variant ?? 'body'
  const tag = as ?? VARIANT_TO_TAG[resolvedVariant]

  return createElement(
    tag,
    {
      className: cn(
        typographyVariants({ variant, color, align }),
        numberOfLines === 1 && 'truncate',
        numberOfLines &&
          numberOfLines > 1 &&
          `line-clamp-${String(numberOfLines)}`
      ),
    },
    children
  )
}

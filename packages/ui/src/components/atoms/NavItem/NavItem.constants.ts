import type { TypographyVariants } from '../Typography/Typography.variants'

/** Typography variant for nav labels per orientation */
export const NAV_LABEL_VARIANT: Record<
  string,
  NonNullable<TypographyVariants['variant']>
> = {
  row: 'body-bold',
  column: 'caption-bold',
} as const

/** Typography color for nav labels per active state */
export const NAV_LABEL_COLOR: Record<
  string,
  NonNullable<TypographyVariants['color']>
> = {
  true: 'nav-active',
  false: 'nav-text',
} as const

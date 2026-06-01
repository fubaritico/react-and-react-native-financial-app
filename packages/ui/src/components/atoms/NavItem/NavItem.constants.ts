import type { TypographyVariants } from '../Typography/Typography.variants'

/** Typography variant for nav labels per orientation */
export const NAV_LABEL_VARIANT: Record<
  string,
  NonNullable<TypographyVariants['variant']>
> = {
  /** Sidebar (row) label — bold body text */
  row: 'body-bold',
  /** Bottom bar (column) label — bold caption text */
  column: 'caption-bold',
} as const

/** Typography color for nav labels per active state */
export const NAV_LABEL_COLOR: Record<
  string,
  NonNullable<TypographyVariants['color']>
> = {
  /** Active label color */
  true: 'nav-active',
  /** Inactive label color */
  false: 'nav-text',
} as const

import type { TypographyVariants } from '../../atoms/Typography/Typography.variants'

/** Props for the ColorBarItem molecule. */
export interface IColorBarItemProps {
  /** Display label (e.g. "Savings", "Entertainment"). */
  label: string
  /** Primary amount to display. */
  amount: number
  /** Token color name for the left border (e.g. "green", "cyan"). */
  color: string
  /** BCP 47 locale tag (defaults to 'en-US'). */
  locale?: string
  /** ISO 4217 currency code (defaults to 'USD'). */
  currency?: string
  /** Secondary amount displayed as "of $X" context (e.g. budget maximum). */
  secondaryAmount?: number
  /** Label between amounts (e.g. "of"). */
  secondaryLabel?: string
  /** Typography variant for the primary amount (defaults to 'body-bold'). */
  amountVariant?: TypographyVariants['variant']
}

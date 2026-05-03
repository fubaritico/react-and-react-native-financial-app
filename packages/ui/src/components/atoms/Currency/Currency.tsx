import type { CurrencySign } from './Currency.utils'
import type { TypographyVariants } from '../Typography/Typography.variants'

/** Props for the Currency atom. */
export interface ICurrencyProps {
  /** Numeric amount to format and display. */
  amount: number
  /** BCP 47 locale tag (defaults to 'en-US'). */
  locale?: string
  /** ISO 4217 currency code (defaults to 'USD'). */
  currency?: string
  /** Number of fraction digits (defaults to 2). */
  digits?: number
  /** Sign display: 'auto' (default), 'always' (+$75), 'never' ($75). */
  sign?: CurrencySign
  /** Typography visual variant (defaults to 'body-bold'). */
  variant?: TypographyVariants['variant']
  /** Typography color (defaults to 'foreground'). */
  color?: TypographyVariants['color']
}

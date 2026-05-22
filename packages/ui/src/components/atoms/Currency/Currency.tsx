import type { CurrencySign } from '../../../lib/CurrencyContext'

/** Props for the Currency atom. */
export interface ICurrencyProps {
  /** Numeric amount (in base currency USD) to convert, format, and display. */
  children: number
  /** Sign display: 'auto' (default), 'always' (+$75), 'never' ($75). */
  sign?: CurrencySign
}

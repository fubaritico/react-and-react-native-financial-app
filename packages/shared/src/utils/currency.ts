/** ISO 4217 currency codes supported by the app. */
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP'

/** Sign display mode for currency formatting. */
export type CurrencySign = 'auto' | 'always' | 'never'

/** Options for {@link formatCurrency}. */
export interface IFormatCurrencyOptions {
  /** BCP 47 locale tag (defaults to 'en-US'). */
  locale?: string
  /** ISO 4217 currency code (defaults to 'USD'). */
  currency?: string
  /** Number of fraction digits (defaults to 2). */
  digits?: number
  /** Sign display: 'auto' (default), 'always' (+$75), 'never' ($75). */
  sign?: CurrencySign
}

/**
 * Formats a numeric amount as a localized currency string.
 * @param amount - Numeric value to format
 * @param options - Formatting options (locale, currency, digits, sign)
 * @returns Formatted string (e.g., "$1,234.56", "+$75.50")
 */
export function formatCurrency(
  amount: number,
  options: IFormatCurrencyOptions = {}
): string {
  const {
    locale = 'en-US',
    currency = 'USD',
    digits = 2,
    sign = 'auto',
  } = options

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount))

  if (sign === 'never') return formatted
  if (sign === 'always') return amount >= 0 ? `+${formatted}` : `-${formatted}`
  // 'auto': negative gets minus, positive gets nothing
  return amount < 0 ? `-${formatted}` : formatted
}

/** Static exchange rate map (base: USD). Replaced by live rates when API is wired. */
const STATIC_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
}

/**
 * Converts an amount from one currency to another using static rates.
 * @param amount - Value in the source currency
 * @param from - Source currency code
 * @param to - Target currency code
 * @returns Converted amount (numeric)
 */
export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount
  // Convert to USD first, then to target
  const inUsd = amount / STATIC_RATES[from]
  return inUsd * STATIC_RATES[to]
}

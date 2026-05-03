/** Sign display mode for currency rendering. */
export type CurrencySign = 'auto' | 'always' | 'never'

/**
 * Formats a numeric amount as a localized currency string using Intl.NumberFormat.
 * @param amount - Numeric value to format
 * @param locale - BCP 47 locale tag (e.g. 'en-US', 'fr-FR')
 * @param currency - ISO 4217 currency code (e.g. 'USD', 'EUR')
 * @param digits - Number of fraction digits
 * @param sign - Sign display: 'auto' (negative only), 'always' (+/-), 'never'
 * @returns Formatted string (e.g. "$1,234.56", "+$75.50")
 */
export function formatCurrency(
  amount: number,
  locale: string,
  currency: string,
  digits: number,
  sign: CurrencySign
): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount))

  if (sign === 'never') return formatted
  if (sign === 'always') return amount >= 0 ? `+${formatted}` : `-${formatted}`
  return amount < 0 ? `-${formatted}` : formatted
}

/** Default currency format options. */
const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}

/**
 * Formats an amount with explicit sign: "+$75.50" / "-$55.50".
 * Intl.NumberFormat handles the minus sign, but not the plus.
 * @param amount - numeric amount
 * @param locale - BCP 47 locale tag (defaults to 'en-US')
 */
export function formatSignedCurrency(amount: number, locale = 'en-US'): string {
  const formatted = new Intl.NumberFormat(
    locale,
    CURRENCY_FORMAT_OPTIONS
  ).format(Math.abs(amount))
  return amount >= 0 ? `+${formatted}` : `-${formatted}`
}

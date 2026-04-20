/**
 * Formats a numeric amount as a localized currency string.
 * @param amount - Numeric value to format
 * @param currency - ISO 4217 currency code (defaults to USD)
 * @returns Formatted string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

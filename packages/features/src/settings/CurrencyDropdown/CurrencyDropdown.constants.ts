import type { SupportedCurrency } from '@financial-app/shared'

/** Map currency code to its short symbol (e.g. USD → $) */
export const CURRENCY_SYMBOL_MAP: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

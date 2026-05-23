import { Convert } from 'easy-currencies'

/** ISO 4217 currency codes supported by the app. */
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP'

/** Sign display mode for currency formatting. */
export type CurrencySign = 'auto' | 'always' | 'never'

/** Short currency symbols — never ISO codes ($US, £GB). */
const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
}

/** Options for {@link formatCurrency}. */
export interface IFormatCurrencyOptions {
  /** BCP 47 locale tag — drives number format AND symbol position (defaults to 'en-US'). */
  locale?: string
  /** ISO 4217 currency code (defaults to 'USD'). */
  currency?: SupportedCurrency
  /** Sign display: 'auto' (default), 'always' (+$75), 'never' ($75). */
  sign?: CurrencySign
}

// ---------------------------------------------------------------------------
// Rate cache (module-level, private)
// ---------------------------------------------------------------------------

/** Cached exchange rates (base: USD). Populated by {@link initRates}. */
let rates: Record<SupportedCurrency, number> | null = null

// ---------------------------------------------------------------------------
// Rate management
// ---------------------------------------------------------------------------

/**
 * Fetches live USD→EUR and USD→GBP rates via easy-currencies.
 * Must be called once at app boot before any conversion.
 * Throws if the fetch fails — no fallback, no silent degradation.
 * @throws {Error} If live rates cannot be fetched
 */
export async function initRates(): Promise<void> {
  const eurRate = await Convert(1).from('USD').to('EUR')
  const gbpRate = await Convert(1).from('USD').to('GBP')
  rates = { USD: 1, EUR: eurRate, GBP: gbpRate }
}

/** Re-fetches live rates. Semantic alias for {@link initRates}. */
export const refreshRates = initRates

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Returns the exchange rate between two currencies.
 * Requires {@link initRates} to have been called first.
 * @param from - Source currency code
 * @param to - Target currency code
 * @returns Multiplier to apply to the source amount
 * @throws {Error} If rates have not been initialized
 */
export function getRate(
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return 1
  if (!rates) {
    throw new Error('[currency] Rates not initialized — call initRates() first')
  }
  const inUsd = 1 / rates[from]
  return inUsd * rates[to]
}

/**
 * Converts an amount from one currency to another.
 * Requires {@link initRates} to have been called first.
 * @param amount - Value in the source currency
 * @param from - Source currency code
 * @param to - Target currency code
 * @returns Converted amount (numeric, not rounded)
 * @throws {Error} If rates have not been initialized
 */
export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount
  return amount * getRate(from, to)
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Formats a numeric amount as a currency string.
 *
 * Number format (thousand separators, decimal) follows the **locale** (app language).
 * Symbol position follows the **locale** (EN: `$10,000` / FR: `10 000 $`).
 * Symbol is always the short form (`$`, `£`, `€`) — never ISO codes.
 * Decimals are shown only when the amount is not a whole number.
 *
 * @param amount - Numeric value to format
 * @param options - Formatting options (locale, currency, sign)
 * @returns Formatted string (e.g. "$10,000", "10 000,50 €", "+$75")
 */
export function formatCurrency(
  amount: number,
  options: IFormatCurrencyOptions = {}
): string {
  const { locale = 'en-US', currency = 'USD', sign = 'auto' } = options

  const abs = Math.abs(amount)
  const hasDecimals = abs % 1 !== 0

  const number = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(abs)

  const symbol = CURRENCY_SYMBOLS[currency]
  const isFrench = locale.startsWith('fr')
  const withSymbol = isFrench ? `${number}${symbol}` : `${symbol}${number}`

  if (sign === 'never') return withSymbol
  if (sign === 'always') {
    return amount >= 0 ? `+${withSymbol}` : `-${withSymbol}`
  }
  return amount < 0 ? `-${withSymbol}` : withSymbol
}

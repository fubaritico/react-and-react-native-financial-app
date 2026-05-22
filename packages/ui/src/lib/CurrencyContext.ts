import { createContext, useContext } from 'react'

/** Sign display mode for currency rendering. */
export type CurrencySign = 'auto' | 'always' | 'never'

/** Shape of the currency context value. */
export interface ICurrencyConfig {
  /**
   * Formats a base-currency amount as a localized currency string.
   * @param amount - Value in base currency (USD)
   * @param sign - Sign display mode (defaults to 'auto')
   * @returns Formatted string (e.g. "$1,234.56", "1 234,56 €")
   */
  format: (amount: number, sign?: CurrencySign) => string
}

/**
 * Default format — plain USD, EN locale. Used if no CurrencyContext.Provider is mounted.
 * @param amount - Numeric value to format
 * @param sign - Sign display mode (defaults to 'auto')
 * @returns Formatted currency string (e.g. "$1,234.56")
 */
const defaultFormat = (amount: number, sign: CurrencySign = 'auto'): string => {
  const abs = Math.abs(amount)
  const hasDecimals = abs % 1 !== 0
  const number = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(abs)
  const withSymbol = `$${number}`

  if (sign === 'never') return withSymbol
  if (sign === 'always') {
    return amount >= 0 ? `+${withSymbol}` : `-${withSymbol}`
  }
  return amount < 0 ? `-${withSymbol}` : withSymbol
}

/**
 * React context providing currency formatting to UI components.
 * Apps mount a provider at their root that connects useCurrency().format to this context.
 */
export const CurrencyContext = createContext<ICurrencyConfig>({
  format: defaultFormat,
})

/**
 * Reads the current currency formatter from context.
 * @returns Currency config provided by the nearest CurrencyContext.Provider
 */
export function useCurrencyFormat(): ICurrencyConfig {
  return useContext(CurrencyContext)
}

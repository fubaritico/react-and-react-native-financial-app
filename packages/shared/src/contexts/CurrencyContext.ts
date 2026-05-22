import { createContext, useContext } from 'react'

import type { SupportedCurrency } from '../utils/currency'

/** Shape of the currency context value. */
export interface ICurrencyConfig {
  /** User's preferred currency code (e.g. 'EUR'). Defaults to 'USD'. */
  currency: SupportedCurrency
  /** Current i18n language code (e.g. 'fr', 'en'). Defaults to 'en'. */
  language: string
}

/** Default currency configuration. */
const DEFAULT_CONFIG: ICurrencyConfig = {
  currency: 'USD',
  language: 'en',
}

/**
 * React context providing currency configuration to the component tree.
 * Apps wrap their root with {@link CurrencyContext.Provider} to inject
 * the user's preferred currency and language.
 */
export const CurrencyContext = createContext<ICurrencyConfig>(DEFAULT_CONFIG)

/**
 * Reads the current currency configuration from context.
 * @returns Currency config provided by the nearest CurrencyContext.Provider
 */
export function useCurrencyConfig(): ICurrencyConfig {
  return useContext(CurrencyContext)
}

import { useMemo } from 'react'

import { useCurrencyConfig } from '../contexts/CurrencyContext'
import { convertCurrency, formatCurrency } from '../utils/currency'

import type { CurrencySign, SupportedCurrency } from '../utils/currency'

/** Locale map from i18n language to BCP 47 locale tag. */
const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
}

/** Decimal separator by app language. */
const DECIMAL_SEPARATOR_MAP: Record<string, string> = {
  en: '.',
  fr: ',',
}

/** Return type of {@link useCurrency}. */
export interface IUseCurrencyReturn {
  /** User's preferred currency code (e.g. 'EUR'). */
  currency: SupportedCurrency
  /** BCP 47 locale tag derived from i18n language (e.g. 'fr-FR'). */
  locale: string
  /** Decimal separator for the current locale ('.' or ','). */
  decimalSeparator: string
  /** Regex pattern for numeric input filtering (allows digits, minus, and locale decimal separator). */
  numericFilterPattern: RegExp
  /**
   * Converts an amount between user currency and base currency (USD).
   * @param amount - Numeric value to convert
   * @param direction - 'toBase' (user→USD for storage) or 'fromBase' (USD→user for display)
   * @returns Converted amount
   */
  convert: (amount: number, direction: 'toBase' | 'fromBase') => number
  /**
   * Formats a base (USD) amount as a localized currency string in the user's preferred currency.
   * @param amount - Value in USD (base currency)
   * @param sign - Sign display mode (defaults to 'auto')
   * @returns Formatted string (e.g. "1 234,56 €")
   */
  format: (amount: number, sign?: CurrencySign) => string
  /**
   * Parses a locale-aware numeric string into a number.
   * Handles comma decimal separator for French locale.
   * @param text - User input string (e.g. "50,35" or "50.35")
   * @returns Parsed number (e.g. 50.35)
   */
  parseAmount: (text: string) => number
  /**
   * Sanitizes a raw input string, keeping only digits, minus sign, and the locale-appropriate decimal separator.
   * @param value - Raw input string
   * @returns Sanitized string safe for numeric input
   */
  sanitizeInput: (value: string) => string
}

/**
 * Provides currency conversion, formatting, and input parsing.
 * Reads currency and language from {@link CurrencyContext} — no params needed.
 * @returns Currency utilities and metadata
 */
export function useCurrency(): IUseCurrencyReturn {
  const { currency, language } = useCurrencyConfig()

  const lang = language.slice(0, 2)
  const locale = LOCALE_MAP[lang] ?? 'en-US'
  const decimalSeparator = DECIMAL_SEPARATOR_MAP[lang] ?? '.'

  const numericFilterPattern = useMemo(
    () => (decimalSeparator === ',' ? /[^0-9,-]/g : /[^0-9.-]/g),
    [decimalSeparator]
  )

  const convert = useMemo(
    () => (amount: number, direction: 'toBase' | 'fromBase') => {
      if (currency === 'USD') return amount
      return direction === 'toBase'
        ? convertCurrency(amount, currency, 'USD')
        : convertCurrency(amount, 'USD', currency)
    },
    [currency]
  )

  const format = useMemo(
    () =>
      (amount: number, sign: CurrencySign = 'auto') => {
        const converted =
          currency === 'USD' ? amount : convertCurrency(amount, 'USD', currency)
        return formatCurrency(converted, {
          locale,
          currency,
          sign,
        })
      },
    [currency, locale]
  )

  const parseAmount = useMemo(
    () => (text: string) => {
      const normalized =
        decimalSeparator === ',' ? text.replace(',', '.') : text
      const parsed = parseFloat(normalized)
      return Number.isNaN(parsed) ? 0 : parsed
    },
    [decimalSeparator]
  )

  const sanitizeInput = useMemo(
    () => (value: string) => value.replace(numericFilterPattern, ''),
    [numericFilterPattern]
  )

  return {
    currency,
    locale,
    decimalSeparator,
    numericFilterPattern,
    convert,
    format,
    parseAmount,
    sanitizeInput,
  }
}

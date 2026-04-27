import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the AmountCell factory. */
export type AmountCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

/**
 * Formats an amount with explicit sign: "+$75.50" / "-$55.50".
 * Intl.NumberFormat handles the minus sign, but not the plus.
 */
export function formatSignedCurrency(amount: number): string {
  const formatted = currencyFormatter.format(Math.abs(amount))
  return amount >= 0 ? `+${formatted}` : `-${formatted}`
}

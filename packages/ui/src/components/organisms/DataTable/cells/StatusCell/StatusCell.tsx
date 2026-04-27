import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Bill payment status. */
export type BillStatus = 'paid' | 'upcoming' | 'due-soon'

/** Return type of the StatusCell factory. */
export type StatusCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

/**
 * Extracts the ordinal day suffix from an ISO date string.
 * "2024-08-02T..." → "2nd", "2024-08-11T..." → "11th"
 */
export function getOrdinalDay(dateString: string): string {
  const day = new Date(dateString).getDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  return `${String(day)}${suffix}`
}

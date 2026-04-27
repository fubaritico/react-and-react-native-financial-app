import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the DateCell factory. */
export type DateCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * Formats an ISO date string to human-readable: "19 Aug 2024".
 */
export function formatDisplayDate(dateString: string): string {
  return dateFormatter.format(new Date(dateString))
}

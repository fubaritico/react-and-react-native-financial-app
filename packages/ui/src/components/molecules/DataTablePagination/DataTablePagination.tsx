import type { Table } from '@tanstack/react-table'

export interface IDataTablePaginationProps {
  /** TanStack Table instance for reading and controlling page state */
  table: Table<unknown>
  /** Label for the previous button (desktop). Defaults to "Prev". */
  prevLabel?: string
  /** Label for the next button (desktop). Defaults to "Next". */
  nextLabel?: string
  /** Accessible label for the previous button. Defaults to "Previous page". */
  prevAriaLabel?: string
  /** Accessible label for the next button. Defaults to "Next page". */
  nextAriaLabel?: string
  /** Factory for per-page accessible labels. Receives 1-based page number. Defaults to "Page {n}". */
  pageAriaLabel?: (page: number) => string
  /** If true, the pagination takes the full available width of its container */
  fullWidth?: boolean
}

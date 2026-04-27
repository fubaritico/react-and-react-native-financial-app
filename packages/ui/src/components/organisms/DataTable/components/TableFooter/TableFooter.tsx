import type { Table } from '@tanstack/react-table'

export interface ITableFooterProps {
  /** TanStack Table instance — used to read/control pagination state */
  table: Table<unknown>
  /** Available page size options (e.g. [10, 25, 50]) */
  rowsPerPageOptions: number[]
  /** Label displayed next to the rows-per-page selector */
  rowsPerPageLabel?: string
  /** Accessible label for the rows-per-page dropdown */
  rowsPerPageAccessibilityLabel?: string
  /** Drawer header title for the rows-per-page selector (mobile) */
  rowsPerPageDrawerTitle?: string
  /** Label for the previous button (desktop) */
  prevLabel?: string
  /** Label for the next button (desktop) */
  nextLabel?: string
  /** Accessible label for the previous button */
  prevAriaLabel?: string
  /** Accessible label for the next button */
  nextAriaLabel?: string
  /** Factory for per-page accessible labels. Receives 1-based page number. */
  pageAriaLabel?: (page: number) => string
}

import type { Row, Table } from '@tanstack/react-table'
import type { ComponentType, ReactElement } from 'react'

/** Shared props between web and native DataTable implementations. */
export interface BaseDataTableProps<TData> {
  /** TanStack Table instance — consumer owns all state (sorting, filtering, pagination) */
  tableStateManager: Table<TData>
  /** When true, renders skeleton rows instead of data rows */
  loading?: boolean
  /** Skeleton row component rendered during loading */
  rowsSkeleton?: ComponentType
  /** Array of filter/action elements for the ActionBar */
  leftActions?: ReactElement[]
  /** Custom ActionBar component that fully replaces the default one */
  actionBar?: ReactElement
  /** Hide the ActionBar entirely */
  noActionBar?: boolean
  /** Hide pagination */
  noPagination?: boolean
  /** Shows the rows per page dropdown */
  showRowsPerPage?: boolean
  /** Global filter change callback */
  onGlobalFilterChange?: (value: string) => void
  /** Row click/press handler */
  onRowClick?: (row: Row<TData>) => void
  /** Jump to specific page index on mount */
  initTableAt?: number
  /** Test identifier */
  dataTestId?: string
}

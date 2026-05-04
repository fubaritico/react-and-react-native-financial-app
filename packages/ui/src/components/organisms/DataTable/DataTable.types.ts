import type { IActionBarProps } from '#Organisms/DataTable/components/ActionBar'

import type { Row, Table } from '@tanstack/react-table'
import type { ComponentType } from 'react'

/** Shared props between web and native DataTable implementations. */
export interface BaseDataTableProps<TData> extends IActionBarProps {
  /** TanStack Table instance */
  tableStateManager: Table<TData>
  /** When true, renders skeleton rows instead of data rows */
  loading?: boolean
  /** Skeleton row component rendered during loading */
  rowsSkeleton?: ComponentType
  /** Shows the ActionBar */
  showActionBar?: boolean
  /** Hide pagination */
  noPagination?: boolean
  /** Shows the rows per page dropdown */
  showRowsPerPage?: boolean
  /** Row click/press handler */
  onRowClick?: (row: Row<TData>) => void
  /** Jump to specific page index on mount */
  initTableAt?: number
  /** Test identifier */
  dataTestId?: string
}

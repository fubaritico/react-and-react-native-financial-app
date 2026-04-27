import type { Row, Table } from '@tanstack/react-table'
import type { ComponentType, ReactElement } from 'react'

export interface IDataTableProps<TData> {
  /** TanStack Table instance — consumer owns all state (sorting, filtering, pagination) */
  table: Table<TData>

  // --- Loading & empty states ---

  /** When true, renders skeleton rows instead of data rows */
  loading?: boolean
  /** Skeleton row component rendered `pageSize` times when loading.
   *  Consumer provides it so it matches the table's column layout. */
  rowsSkeleton?: ComponentType
  /** Message shown when !loading && rows.length === 0.
   *  Defaults to "No results." */
  emptyMessage?: string

  // --- Pagination ---

  /** Show DataTablePagination below the table.
   *  Only rendered when !loading && rowCount > pageSize. */
  pagination?: boolean
  /** Label for the previous button (desktop). */
  paginationPrevLabel?: string
  /** Label for the next button (desktop). */
  paginationNextLabel?: string
  /** Available page size options (e.g. [10, 25, 50]).
   *  When provided, a rows-per-page Dropdown is shown alongside pagination. */
  rowsPerPageOptions?: number[]
  /** Label displayed before the rows-per-page selector (e.g. "Rows per page") */
  rowsPerPageLabel?: string

  // --- Row interaction ---

  /** Row press/click handler — receives the Row object */
  onRowPress?: (row: Row<TData>) => void

  // --- Responsive rendering ---

  /** Custom row renderer for phone/compact layout.
   *  When provided and screen width < compactBreakpoint, this replaces columnar rendering.
   *  Used on BOTH web (responsive) and native (phone vs tablet). */
  renderCompactRow?: (info: { row: Row<TData>; index: number }) => ReactElement
  /** Width threshold below which compact mode activates (default: 768).
   *  Applies to both platforms. */
  compactBreakpoint?: number

  // --- ActionBar props ---

  /** Custom component that fully replaces the default ActionBar.
   *  When provided, leftActions and onSearchChange are ignored. */
  actionBar?: ReactElement
  /** Hide the ActionBar entirely (no search, no filters) */
  noActionBar?: boolean
  /** Array of React elements rendered on the left side of the ActionBar
   *  (dropdowns, filter buttons, icon toggles, etc.). */
  leftActions?: ReactElement[]
  /** Callback when the built-in search input value changes.
   *  Typically wired to table.setGlobalFilter(). */
  onSearchChange?: (value: string) => void
  /** Placeholder text for the built-in search input */
  searchPlaceholder?: string
  /** Label for the search input (accessibility). Defaults to "Search". */
  searchLabel?: string
}

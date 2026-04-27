import type { Table } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** ActionBar props (web) — reads filter state from table instance. */
export interface IActionBarProps {
  /** TanStack Table instance */
  tableConfiguration: Table<unknown>
  /** Extra CSS classes */
  className?: string
  /** Filter/action elements rendered on the left side */
  leftActions?: ReactElement[]
  /** When enabled, makes the bar sticky */
  stickyHeader?: boolean
  /** Global filter change callback */
  onGlobalFilterChange?: (value: string) => void
}

/** ActionBar props (native) — controlled search state. */
export interface IActionBarNativeProps {
  /** Filter/action elements rendered on the left side */
  leftActions?: ReactElement[]
  /** Current search input value */
  searchValue: string
  /** Search input change callback */
  onSearchChange: (value: string) => void
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Label for the search input (accessibility). Defaults to "Search". */
  searchLabel?: string
}

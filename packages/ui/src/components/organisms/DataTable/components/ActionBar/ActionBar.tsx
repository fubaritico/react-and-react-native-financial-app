import type { ReactElement } from 'react'

/** ActionBar props (native) — controlled search state. */
export interface IActionBarProps {
  /** Extra CSS classes */
  className?: string
  /** Filter/action elements rendered on the left side */
  rightActions?: ReactElement
  /** When enabled, makes the bar sticky */
  stickyHeader?: boolean
  /** Value of the global filter (quick filter) shown in the quick filter text input */
  globalFilterValue?: string
  /** Global filter change callback */
  onGlobalFilterChange?: (value: string) => void
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Label for the search input (accessibility). Defaults to "Search". */
  searchLabel?: string
}

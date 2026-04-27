import type { ReactElement } from 'react'

/** Props for the ActionBar sub-component (internal — not exported from package). */
export interface IActionBarProps {
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

import type { IDropdownOption } from '#Molecules/Dropdown/Dropdown.tsx'

import type { ColumnFiltersState } from '@tanstack/react-table'

export interface IDropdownFilterProps {
  /** Default label shown when no filter is active (also the toggling value that clears the filter) */
  buttonLabel: string
  /** Filter options */
  options: IDropdownOption[]
  /** Currently enabled column filters */
  filters: ColumnFiltersState
  /** Column ID this dropdown controls */
  filterId: string
  /** Called when the filter state changes */
  onFiltersChange: (filters: ColumnFiltersState) => void
  /** Accessible label for the dropdown trigger */
  accessibilityLabel?: string
  /** Drawer header title (mobile) */
  drawerTitle?: string
}

/**
 * Toggle a column filter value.
 * If the selected value equals the toggling value, the filter is removed.
 * Otherwise the filter is added or updated.
 * Toggles a column filter value in the filters array.
 */
export function combineColumnFilters(
  prev: ColumnFiltersState,
  filterName: string,
  value: string,
  togglingValue: string
): ColumnFiltersState {
  if (value === togglingValue) {
    return prev.filter((filter) => filter.id !== filterName)
  }

  const columnFilter = prev.find((filter) => filter.id === filterName)

  if (columnFilter) {
    columnFilter.value = value
  } else {
    prev.push({ id: filterName, value })
  }
  return [...prev]
}

import type { FilterFn, Row } from '@tanstack/react-table'

/**
 * Filter that checks a numeric cell value against a threshold.
 * filterValue: { type: 'over' | 'under', value: string }
 * Copied from Odaseva DataTable assertNumberFilter.
 */
export const assertNumberFilter: FilterFn<unknown> = (
  row: Row<unknown>,
  columnId: string,
  filterValue: { type: 'over' | 'under'; value: string }
) => {
  const cellValue = row.getValue<string | number>(columnId)
  const threshold = parseInt(filterValue.value, 10)

  if (isNaN(threshold)) {
    return false
  }

  const numericValue = parseInt(String(cellValue), 10)

  return filterValue.type === 'over'
    ? numericValue >= threshold
    : numericValue < threshold
}

/**
 * Filter that checks if the cell value does NOT contain any of the strings in the list.
 * Copied from Odaseva DataTable doesNotContainString.
 */
export const doesNotContainString: FilterFn<unknown> = (
  row: Row<unknown>,
  columnId: string,
  filterValue?: string[]
) => {
  if (!filterValue) return true

  const cellValue = row.getValue<string>(columnId)

  for (const value of filterValue) {
    if (cellValue.includes(value)) {
      return false
    }
  }

  return true
}

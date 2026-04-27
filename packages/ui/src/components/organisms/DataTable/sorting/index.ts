import type { Row, RowData, SortingFn } from '@tanstack/react-table'

/**
 * Sort values as numbers. Parses strings if needed, falls back to 0.
 * Copied from Odaseva DataTable sortNumbers.
 */
export const sortNumbers =
  <T extends RowData>(): SortingFn<T> =>
  (rowA: Row<T>, rowB: Row<T>, columnId: string): number => {
    const valueA = rowA.getValue<T>(columnId)
    const valueB = rowB.getValue<T>(columnId)

    const numA = valueA
      ? isNaN(Number(valueA))
        ? parseInt(String(valueA).replace(/[,.\s]/g, ''), 10)
        : Number(valueA)
      : 0

    const numB = valueB
      ? isNaN(Number(valueB))
        ? parseInt(String(valueB).replace(/[,.\s]/g, ''), 10)
        : Number(valueB)
      : 0

    return numA < numB ? 1 : -1
  }

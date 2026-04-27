import type { Column } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the SortableHeader factory. */
export type HeaderCellFn = <TData>(props: {
  column: Column<TData>
}) => ReactElement

/** Text alignment for the header label. */
export type HeaderAlign = 'left' | 'right'

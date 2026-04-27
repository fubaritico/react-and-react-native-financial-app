import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the BillTitleCell factory. */
export type BillTitleCellFn = <TData>(props: {
  row: Row<TData>
}) => ReactElement

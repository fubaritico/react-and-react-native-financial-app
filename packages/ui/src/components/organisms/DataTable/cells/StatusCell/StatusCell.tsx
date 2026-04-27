import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Bill payment status. */
export type BillStatus = 'paid' | 'upcoming' | 'due-soon'

/** Return type of the StatusCell factory. */
export type StatusCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

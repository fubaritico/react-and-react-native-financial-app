import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the DateCell factory. */
export type DateCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

export type { BillStatus } from '#Atoms/Status/Status.tsx'

/** Return type of the StatusCell factory. */
export type StatusCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the AmountCell factory. */
export type AmountCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the CategoryIconCell factory. */
export type CategoryIconCellFn = <TData>(props: {
  row: Row<TData>
}) => ReactElement

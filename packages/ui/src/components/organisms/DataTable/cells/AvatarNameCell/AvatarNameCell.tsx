import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Return type of the AvatarNameCell factory. */
export type AvatarNameCellFn = <TData>(props: {
  row: Row<TData>
}) => ReactElement

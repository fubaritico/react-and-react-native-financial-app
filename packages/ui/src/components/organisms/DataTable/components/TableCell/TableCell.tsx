import type { HeaderAlign } from '#Organisms/DataTable/cells'

import type { ReactNode } from 'react'

/** Props for the TableCell sub-component (internal — td wrapper). */
export interface ITableCellProps {
  children?: ReactNode
  /** Column span (web only) */
  colSpan?: number
  /** Content horizontal alignment */
  align?: HeaderAlign
}

import type { ReactNode } from 'react'

/** Props for the TableCell sub-component (internal — td wrapper). */
export interface ITableCellProps {
  children?: ReactNode
  /** Column span (web only) */
  colSpan?: number
}

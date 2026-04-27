import type { ReactNode } from 'react'

/** Props for the Table sub-component (internal — not exported from package). */
export interface ITableProps {
  children?: ReactNode
  /** Fixed max height — enables scrollable body */
  maxHeight?: number
}

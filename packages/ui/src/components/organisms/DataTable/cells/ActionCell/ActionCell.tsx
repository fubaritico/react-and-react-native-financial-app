import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Configuration for the ActionCell factory. */
export interface IActionCellConfig {
  /** Callback when "Edit" is selected. */
  onEdit: (row: Row<unknown>) => void
  /** Callback when "Delete" is selected. */
  onDelete: (row: Row<unknown>) => void
  /** Label for the edit option. */
  editLabel: string
  /** Label for the delete option. */
  deleteLabel: string
}

/** Return type of the ActionCell factory. */
export type ActionCellFn = <TData>(props: { row: Row<TData> }) => ReactElement

import { TableCell } from '../../components/TableCell/TableCell.native'

import type { BillStatus, StatusCellFn } from './StatusCell.tsx'
import type { Row } from '@tanstack/react-table'

import { Status } from '#Atoms'

/**
 * Status cell factory (native).
 * Wraps the Status atom in a TableCell.
 * @param dateKey - accessor key for the ISO date string
 * @param statusKey - accessor key for the BillStatus value
 */
export const StatusCell =
  (dateKey: string, statusKey: string): StatusCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const dateString = row.getValue<string>(dateKey)
    const status = row.getValue<BillStatus>(statusKey)

    return (
      <TableCell>
        <Status date={dateString} status={status} />
      </TableCell>
    )
  }

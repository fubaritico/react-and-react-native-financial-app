import { Status } from '#Atoms/index.web'

import { TableCell } from '../../components/TableCell/TableCell.web'

import type { BillStatus, StatusCellFn } from './StatusCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Status cell factory (web).
 * Wraps the Status atom in a TableCell.
 * @param dateKey - accessor key for the ISO date string
 * @param statusKey - accessor key for the BillStatus value
 * @param className - extra classes from configuration
 */
export const StatusCell =
  (dateKey: string, statusKey: string, className?: string): StatusCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const dateString = row.getValue<string>(dateKey)
    const status = row.getValue<BillStatus>(statusKey)

    return (
      <TableCell tabIndex={0} className={className}>
        <Status date={dateString} status={status} />
      </TableCell>
    )
  }

import tw from '../../../../../lib/tw'
import { Typography } from '../../../../atoms/Typography/Typography.native'
import { TableCell } from '../../components/TableCell/TableCell.native'

import { getOrdinalDay } from './StatusCell.constants'

import type { BillStatus, StatusCellFn } from './StatusCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Status cell factory (native).
 * Renders "Monthly - {day}th" + status indicator.
 * - paid → green text + checkmark
 * - due-soon → red text + exclamation
 * - upcoming → muted text, no indicator
 * @param dateKey - accessor key for the ISO date string
 * @param statusKey - accessor key for the BillStatus value
 */
export const StatusCell =
  (dateKey: string, statusKey: string): StatusCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const dateString = row.getValue<string>(dateKey)
    const status = row.getValue<BillStatus>(statusKey)
    const ordinal = getOrdinalDay(dateString)

    const color =
      status === 'paid'
        ? 'success'
        : status === 'due-soon'
          ? 'destructive'
          : 'muted'

    const indicator =
      status === 'paid' ? '✓' : status === 'due-soon' ? '!' : null

    return (
      <TableCell style={tw`flex-row items-center gap-2`}>
        <Typography variant="caption" color={color}>
          Monthly -{ordinal}
        </Typography>
        {indicator ? (
          <Typography variant="caption-bold" color={color}>
            {indicator}
          </Typography>
        ) : null}
      </TableCell>
    )
  }

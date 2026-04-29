import tw from '#Lib/tw'

import { TableCell } from '../../components/TableCell/TableCell.native'

import { formatDisplayDate } from './DateCell.constants'

import type { DateCellFn } from './DateCell.tsx'
import type { Row } from '@tanstack/react-table'

import { Typography } from '#Atoms'

/**
 * Date cell factory — displays a formatted date string.
 * Raw value (ISO string) is used by TanStack for chronological sorting.
 * Display value is human-readable: "19 Aug 2024".
 * @param keyName - accessor key for the ISO date string
 * @param className - extra classes from parent
 * @param locale - BCP 47 locale tag (defaults to 'en-US')
 */
export const DateCell =
  (keyName: string, className?: string, locale?: string): DateCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const dateString = row.getValue<string>(keyName)

    return (
      <TableCell
        aria-label={`${keyName}-${dateString}`}
        style={className && tw`${className}`}
      >
        <Typography variant="caption" color="muted">
          {formatDisplayDate(dateString, locale)}
        </Typography>
      </TableCell>
    )
  }

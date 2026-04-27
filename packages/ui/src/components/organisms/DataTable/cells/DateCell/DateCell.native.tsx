import { Typography } from '../../../../atoms/Typography/Typography.native'

import { formatDisplayDate } from './DateCell'

import type { DateCellFn } from './DateCell'
import type { Row } from '@tanstack/react-table'

/**
 * Date cell factory — displays a formatted date string.
 * Raw value (ISO string) is used by TanStack for chronological sorting.
 * Display value is human-readable: "19 Aug 2024".
 * @param keyName - accessor key for the ISO date string
 */
export const DateCell =
  (keyName: string): DateCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const dateString = row.getValue<string>(keyName)

    return (
      <Typography variant="body" color="muted">
        {formatDisplayDate(dateString)}
      </Typography>
    )
  }

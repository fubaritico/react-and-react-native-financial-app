import { Typography } from '../../../../atoms/Typography/Typography.native'

import { formatSignedCurrency } from './AmountCell'

import type { AmountCellFn } from './AmountCell'
import type { Row } from '@tanstack/react-table'

/**
 * Amount cell factory — displays a signed currency value with color.
 * Positive amounts render in green (transaction-positive),
 * negative amounts render in default foreground (body-bold).
 * @param keyName - accessor key for the numeric amount
 */
export const AmountCell =
  (keyName: string): AmountCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const amount = row.getValue<number>(keyName)
    const isPositive = amount >= 0

    return (
      <Typography
        variant="body-bold"
        color={isPositive ? 'transaction-positive' : 'foreground'}
      >
        {formatSignedCurrency(amount)}
      </Typography>
    )
  }

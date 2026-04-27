import { cn } from '../../../../../lib/cn'
import { Typography } from '../../../../atoms/Typography/Typography.web'
import { TableCell } from '../../components/TableCell/TableCell.web'

import { formatSignedCurrency } from './AmountCell.constants'

import type { AmountCellFn } from './AmountCell.tsx'
import type { HeaderAlign } from '../SortableHeader'
import type { Row } from '@tanstack/react-table'

/**
 * Amount cell factory — displays a signed currency value with color.
 * Positive amounts render in green (transaction-positive),
 * negative amounts render in default foreground (body-bold).
 * @param keyName - accessor key for the numeric amount
 * @param align - text alignment ('left' | 'right'), defaults to 'left'
 * @param className - extra classes from configuration
 */
export const AmountCell =
  (
    keyName: string,
    align: HeaderAlign = 'left',
    className?: string
  ): AmountCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const amount = row.getValue<number>(keyName)
    const isPositive = amount >= 0

    return (
      <TableCell
        tabIndex={0}
        className={cn(
          className,
          align === 'right' ? 'text-right ml-auto' : 'text-left mr-auto'
        )}
      >
        <Typography
          variant="body-bold"
          color={isPositive ? 'transaction-positive' : 'foreground'}
          align={align}
        >
          {formatSignedCurrency(amount)}
        </Typography>
      </TableCell>
    )
  }

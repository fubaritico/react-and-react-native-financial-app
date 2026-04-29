import tw from '#Lib/tw'

import { TableCell } from '../../components/TableCell/TableCell.native'

import { formatSignedCurrency } from './AmountCell.constants'

import type { AmountCellFn } from './AmountCell.tsx'
import type { HeaderAlign } from '../SortableHeader'
import type { Row } from '@tanstack/react-table'

import { Typography } from '#Atoms'

/**
 * Amount cell factory — displays a signed currency value with color.
 * Positive amounts render in green (transaction-positive),
 * negative amounts render in default foreground (body-bold).
 * @param keyName - accessor key for the numeric amount
 * @param align - text alignment ('left' | 'right'), defaults to 'left'
 * @param className - extra classes from configuration
 * @param locale - BCP 47 locale tag (defaults to 'en-US')
 */
export const AmountCell =
  (
    keyName: string,
    align: HeaderAlign = 'left',
    className?: string,
    locale?: string
  ): AmountCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const amount = row.getValue<number>(keyName)
    const isPositive = amount >= 0

    return (
      <TableCell
        style={[
          tw`flex-row items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`,
          className && tw`${className}`,
        ]}
      >
        <Typography
          variant="body-bold"
          color={isPositive ? 'transaction-positive' : 'foreground'}
        >
          {formatSignedCurrency(amount, locale)}
        </Typography>
      </TableCell>
    )
  }

import {
  AmountCell,
  AvatarNameCell,
  DateCell,
  SimpleCell,
  SortableHeader,
} from '@financial-app/ui'
import { useMemo } from 'react'

import type { ITransaction } from '@financial-app/shared'

import type { ColumnDef } from '@tanstack/react-table'

/** Column definitions for the web TransactionsDataTable. */
export function useTransactionsColumns(
  locale?: string
): ColumnDef<ITransaction>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader('Recipient / Sender', 'left', 'w-1/2'),
        cell: AvatarNameCell('avatar', 'name'),
      },
      {
        accessorKey: 'category',
        header: SortableHeader('Category', 'left', 'w-[150px]'),
        cell: SimpleCell('category', 'caption', 'muted'),
        filterFn: 'equals' as const,
      },
      {
        accessorKey: 'date',
        header: SortableHeader('Transaction Date', 'left'),
        cell: DateCell('date', undefined, locale),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader('Amount', 'right', 'w-[150px]'),
        cell: AmountCell('amount', 'right', undefined, locale),
      },
    ],
    [locale]
  )
}

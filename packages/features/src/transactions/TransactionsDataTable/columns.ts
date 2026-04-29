import {
  AmountCell,
  AvatarNameCell,
  DateCell,
  SimpleCell,
  SortableHeader,
} from '@financial-app/ui/native'
import { useMemo } from 'react'

import type { ITransaction } from '@financial-app/shared'

import type { ColumnDef } from '@tanstack/react-table'

/** Column definitions for the native TransactionsDataTable. */
export function useTransactionsColumns(
  locale?: string
): ColumnDef<ITransaction>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader('Recipient / Sender'),
        cell: AvatarNameCell('avatar', 'name'),
      },
      {
        accessorKey: 'category',
        header: SortableHeader('Category'),
        cell: SimpleCell('category', undefined, 'muted'),
        filterFn: 'equals' as const,
      },
      {
        accessorKey: 'date',
        header: SortableHeader('Transaction Date'),
        cell: DateCell('date', undefined, locale),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader('Amount', 'right'),
        cell: AmountCell('amount', undefined, undefined, locale),
      },
    ],
    [locale]
  )
}

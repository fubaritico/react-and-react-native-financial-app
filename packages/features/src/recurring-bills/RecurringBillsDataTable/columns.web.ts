import {
  AmountCell,
  CategoryIconCell,
  SortableHeader,
  StatusCell,
} from '@financial-app/ui'
import { useMemo } from 'react'

import type { IRecurringBill } from '@financial-app/shared'

import type { ColumnDef } from '@tanstack/react-table'

/** Column definitions for the web RecurringBillsDataTable. */
export function useRecurringBillsColumns(
  locale?: string
): ColumnDef<IRecurringBill>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader('Bill Title', 'left', 'w-1/2'),
        cell: CategoryIconCell(
          'name',
          'categoryIcon',
          'categoryColor',
          'date',
          'status'
        ),
      },
      {
        accessorKey: 'status',
        enableHiding: true,
      },
      {
        accessorKey: 'date',
        header: SortableHeader('Due Date', 'left'),
        cell: StatusCell('date', 'status'),
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

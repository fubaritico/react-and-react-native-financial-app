import {
  AmountCell,
  CategoryIconCell,
  SortableHeader,
  StatusCell,
} from '@financial-app/ui'
import { useMemo } from 'react'

import type { IRecurringBill } from '@financial-app/shared'

import type { ColumnDef } from '@tanstack/react-table'

/** Labels for the recurring bills table headers. */
interface IRecurringHeaderLabels {
  /** Header for the bill title column. */
  billTitle: string
  /** Header for the due date column. */
  dueDate: string
  /** Header for the amount column. */
  amount: string
  /** Translated "Sort by" prefix for accessibility labels. */
  sortBy: string
}

/** Column definitions for the web RecurringBillsDataTable. */
export function useRecurringBillsColumns(
  locale: string | undefined,
  headerLabels: IRecurringHeaderLabels
): ColumnDef<IRecurringBill>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader(
          headerLabels.billTitle,
          'left',
          'w-1/2',
          undefined,
          headerLabels.sortBy
        ),
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
        header: SortableHeader(
          headerLabels.dueDate,
          'left',
          undefined,
          undefined,
          headerLabels.sortBy
        ),
        cell: StatusCell('date', 'status'),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader(
          headerLabels.amount,
          'right',
          'w-[150px]',
          undefined,
          headerLabels.sortBy
        ),
        cell: AmountCell('amount', 'right', undefined, locale),
      },
    ],
    [locale, headerLabels]
  )
}

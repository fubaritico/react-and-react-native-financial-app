import {
  AmountCell,
  CategoryIconCell,
  SortableHeader,
  StatusCell,
} from '@financial-app/ui/native'
import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import type { IRecurringBill } from '@financial-app/shared'

import type { ColumnDef } from '@tanstack/react-table'

/** Breakpoint below which Status is shown inside the category cell. */
const MOBILE_BREAKPOINT = 768

/** Labels for the recurring bills table headers. */
interface IRecurringHeaderLabels {
  /** Header for the bill title column. */
  billTitle: string
  /** Header for the due date column. */
  dueDate: string
  /** Header for the amount column. */
  amount: string
}

/** Column definitions for the native RecurringBillsDataTable. */
export function useRecurringBillsColumns(
  locale: string | undefined,
  headerLabels: IRecurringHeaderLabels
): ColumnDef<IRecurringBill>[] {
  const { width } = useWindowDimensions()
  const isMobile = width < MOBILE_BREAKPOINT

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader(
          headerLabels.billTitle,
          'left',
          isMobile ? 'w-2/3' : 'w-1/2'
        ),
        cell: CategoryIconCell(
          'name',
          'categoryIcon',
          'categoryColor',
          'date',
          'status'
        ),
        meta: { className: isMobile ? 'w-2/3' : 'w-1/2' },
      },
      {
        accessorKey: 'status',
        enableHiding: true,
      },
      {
        accessorKey: 'date',
        header: SortableHeader(headerLabels.dueDate, 'left'),
        cell: StatusCell('date', 'status'),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader(headerLabels.amount, 'right'),
        cell: AmountCell('amount', 'right', undefined, locale),
      },
    ],
    [locale, isMobile, headerLabels]
  )
}

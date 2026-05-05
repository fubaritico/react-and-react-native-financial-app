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

/** Column definitions for the native RecurringBillsDataTable. */
export function useRecurringBillsColumns(
  locale?: string
): ColumnDef<IRecurringBill>[] {
  const { width } = useWindowDimensions()
  const isMobile = width < MOBILE_BREAKPOINT

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader(
          'Bill Title',
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
        header: SortableHeader('Due Date', 'left'),
        cell: StatusCell('date', 'status'),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader('Amount', 'right'),
        cell: AmountCell('amount', 'right', undefined, locale),
      },
    ],
    [locale, isMobile]
  )
}

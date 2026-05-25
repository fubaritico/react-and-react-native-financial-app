import {
  ActionCell,
  AmountCell,
  CategoryIconCell,
  DateCell,
  EmptyHeaderCell,
  SimpleCell,
  SortableHeader,
} from '@financial-app/ui'
import { useCallback, useMemo } from 'react'

import type { ITransaction } from '@financial-app/shared'

import type { ColumnDef, Row } from '@tanstack/react-table'

/** Labels for the transaction table headers. */
interface ITransactionHeaderLabels {
  /** Header for the name/recipient column. */
  recipientSender: string
  /** Header for the category column. */
  category: string
  /** Header for the date column. */
  transactionDate: string
  /** Header for the amount column. */
  amount: string
  /** Translated "Sort by" prefix for accessibility labels. */
  sortBy: string
}

/** Column definitions for the web TransactionsDataTable. */
export function useTransactionsColumns(
  locale: string | undefined,
  onEdit: ((transaction: ITransaction) => void) | undefined,
  onDelete: ((transaction: ITransaction) => void) | undefined,
  editLabel: string,
  deleteLabel: string,
  headerLabels: ITransactionHeaderLabels
): ColumnDef<ITransaction>[] {
  const handleEdit = useCallback(
    (row: Row<unknown>) => {
      onEdit?.((row as Row<ITransaction>).original)
    },
    [onEdit]
  )

  const handleDelete = useCallback(
    (row: Row<unknown>) => {
      onDelete?.((row as Row<ITransaction>).original)
    },
    [onDelete]
  )

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: SortableHeader(
          headerLabels.recipientSender,
          'left',
          'w-1/2',
          undefined,
          headerLabels.sortBy
        ),
        cell: CategoryIconCell('name', 'category_icon', 'category_color'),
      },
      {
        accessorKey: 'category_name',
        header: SortableHeader(
          headerLabels.category,
          'left',
          'w-[150px]',
          undefined,
          headerLabels.sortBy
        ),
        cell: SimpleCell('category_name', 'caption', 'muted'),
        filterFn: 'equals' as const,
      },
      {
        accessorKey: 'date',
        header: SortableHeader(
          headerLabels.transactionDate,
          'left',
          undefined,
          undefined,
          headerLabels.sortBy
        ),
        cell: DateCell('date', undefined, locale),
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
      ...(onEdit || onDelete
        ? [
            {
              id: 'actions',
              header: EmptyHeaderCell(),
              cell: ActionCell({
                onEdit: handleEdit,
                onDelete: handleDelete,
                editLabel,
                deleteLabel,
              }),
              enableSorting: false,
              size: 48,
              meta: { className: 'w-12' },
            } satisfies ColumnDef<ITransaction>,
          ]
        : []),
    ],
    [
      locale,
      onEdit,
      onDelete,
      handleEdit,
      handleDelete,
      editLabel,
      deleteLabel,
      headerLabels,
    ]
  )
}

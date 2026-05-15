import {
  ActionCell,
  AmountCell,
  AvatarNameCell,
  DateCell,
  EmptyHeaderCell,
  SimpleCell,
  SortableHeader,
} from '@financial-app/ui'
import { useCallback, useMemo } from 'react'

import type { ITransaction } from '@financial-app/shared'

import type { ColumnDef, Row } from '@tanstack/react-table'

/** Column definitions for the web TransactionsDataTable. */
export function useTransactionsColumns(
  locale: string | undefined,
  onEdit: ((transaction: ITransaction) => void) | undefined,
  onDelete: ((transaction: ITransaction) => void) | undefined,
  editLabel: string,
  deleteLabel: string
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
    [locale, onEdit, onDelete, handleEdit, handleDelete, editLabel, deleteLabel]
  )
}

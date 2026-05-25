import { DataTable, Dropdown, Icon, Typography } from '@financial-app/ui'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRecurringBillsColumns } from './columns.web'
import { SORT_OPTIONS } from './constants'
import { sortOptionToState, stateToSortOption } from './utils'

import type { IRecurringBillsDataTableProps } from './RecurringBillsDataTable'
import type { SortingState, VisibilityState } from '@tanstack/react-table'

/** Web implementation of the RecurringBillsDataTable. */
export function RecurringBillsDataTable({
  data,
  loading,
  locale,
}: Readonly<IRecurringBillsDataTableProps>) {
  const { t } = useTranslation()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    status: false,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
      setColumnVisibility({
        status: false,
        date: !e.matches,
      })
    }

    handleChange(mql)
    mql.addEventListener('change', handleChange)
    return () => {
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  const columns = useRecurringBillsColumns(locale, {
    billTitle: t('recurring.headers.billTitle'),
    dueDate: t('recurring.headers.dueDate'),
    amount: t('recurring.headers.amount'),
    sortBy: t('recurring.sortBy'),
  })

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    globalFilterFn: 'includesString',
  })

  const sortOption = useMemo(() => stateToSortOption(sorting), [sorting])

  const handleSortChange = (value: string) => {
    setSorting(sortOptionToState(value))
  }

  const rightActions = (
    <>
      {!isMobile && (
        <Typography variant="body" color="muted" as="span">
          {t('recurring.sortBy')}
        </Typography>
      )}
      <Dropdown
        options={SORT_OPTIONS}
        selectedValue={sortOption}
        onSelect={handleSortChange}
        accessibilityLabel={t('recurring.sortBills')}
        menuAccessibilityLabel={t('recurring.sortOptions')}
        bottomSheetTitle={t('recurring.sortBy')}
        trigger={
          isMobile ? () => <Icon name="sortMobile" iconSize="md" /> : undefined
        }
        {...(isMobile && {
          buttonVariant: 'tertiary' as const,
          buttonSize: 'sm' as const,
          buttonClassName: 'p-0',
          buttonCentered: true,
        })}
      />
    </>
  )

  return (
    <DataTable
      tableStateManager={table}
      loading={loading}
      globalFilterValue={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      rightActions={rightActions}
      showActionBar
    />
  )
}

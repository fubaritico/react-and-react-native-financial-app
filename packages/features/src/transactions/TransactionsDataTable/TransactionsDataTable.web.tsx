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

import { useTransactionsColumns } from './columns.web'
import { ALL_CATEGORIES, CATEGORY_OPTIONS, SORT_OPTIONS } from './constants'
import { sortOptionToState, stateToSortOption } from './utils'

import type { ITransactionsDataTableProps } from './TransactionsDataTable'
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

/** Web implementation of the TransactionsDataTable. */
export function TransactionsDataTable({
  data,
  loading,
  locale,
}: Readonly<ITransactionsDataTableProps>) {
  const { t } = useTranslation()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [categoryOption, setCategoryOption] = useState(ALL_CATEGORIES)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
      setColumnVisibility({
        category: !e.matches,
        date: !e.matches,
      })
    }

    handleChange(mql)
    mql.addEventListener('change', handleChange)
    return () => {
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  const columns = useTransactionsColumns(locale)

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    globalFilterFn: 'includesString',
  })

  const sortOption = useMemo(() => stateToSortOption(sorting), [sorting])

  const handleSortChange = (value: string) => {
    setSorting(sortOptionToState(value))
  }

  const handleCategoryChange = (value: string) => {
    setCategoryOption(value)
    if (value === ALL_CATEGORIES) {
      setColumnFilters([])
    } else {
      setColumnFilters([{ id: 'category', value }])
    }
  }

  const rightActions = (
    <>
      {!isMobile && (
        <Typography variant="body" color="muted" as="span">
          {t('transactions.sortBy')}
        </Typography>
      )}
      <Dropdown
        options={SORT_OPTIONS}
        selectedValue={sortOption}
        onSelect={handleSortChange}
        accessibilityLabel={t('transactions.sortTransactions')}
        menuAccessibilityLabel={t('transactions.sortOptions')}
        bottomSheetTitle={t('transactions.sortBy')}
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
      {!isMobile && (
        <Typography variant="body" color="muted" as="span">
          {t('transactions.category')}
        </Typography>
      )}
      <Dropdown
        options={CATEGORY_OPTIONS}
        selectedValue={categoryOption}
        onSelect={handleCategoryChange}
        accessibilityLabel={t('transactions.filterByCategory')}
        menuAccessibilityLabel={t('transactions.categoryOptions')}
        bottomSheetTitle={t('transactions.category')}
        trigger={
          isMobile
            ? () => <Icon name="filterMobile" iconSize="md" />
            : undefined
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

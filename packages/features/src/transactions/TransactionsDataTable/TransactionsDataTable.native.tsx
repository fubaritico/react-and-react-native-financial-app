import { DataTable, Dropdown, Icon } from '@financial-app/ui/native'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import type { ITransaction } from '@financial-app/shared'

import { useTransactionsColumns } from './columns'
import { CompactTransactionRow } from './components/CompactTransactionRow.native'
import { ALL_CATEGORIES, CATEGORY_OPTIONS, SORT_OPTIONS } from './constants'
import { sortOptionToState, stateToSortOption } from './utils'

import type { ITransactionsDataTableProps } from './TransactionsDataTable'
import type {
  ColumnFiltersState,
  Row,
  SortingState,
} from '@tanstack/react-table'

/** Native implementation of the TransactionsDataTable. */
export function TransactionsDataTable({
  data,
  loading,
  locale,
}: Readonly<ITransactionsDataTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [categoryOption, setCategoryOption] = useState(ALL_CATEGORIES)

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
    state: {
      sorting,
      globalFilter,
      columnFilters,
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

  const actionBar = (
    <>
      <Dropdown
        bottomSheetTitle="Sort by"
        options={SORT_OPTIONS}
        selectedValue={sortOption}
        onSelect={handleSortChange}
        accessibilityLabel="Sort transactions"
        trigger={() => <Icon name="sortMobile" iconSize="md" />}
      />
      <Dropdown
        bottomSheetTitle="Category"
        options={CATEGORY_OPTIONS}
        selectedValue={categoryOption}
        onSelect={handleCategoryChange}
        accessibilityLabel="Filter by category"
        trigger={() => <Icon name="filterMobile" iconSize="md" />}
      />
    </>
  )

  return (
    <DataTable
      tableStateManager={table}
      loading={loading}
      globalFilterValue={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      pagination
      paginationPrevLabel="Prev"
      paginationNextLabel="Next"
      rightActions={actionBar}
      renderCompactRow={({ row }: { row: Row<ITransaction> }) => (
        <CompactTransactionRow row={row} locale={locale} />
      )}
      compactBreakpoint={768}
      showActionBar
    />
  )
}

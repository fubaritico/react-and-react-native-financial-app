import {
  DataTable,
  Dropdown,
  Icon,
  TextInput,
  Typography,
} from '@financial-app/ui'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

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

  const actionBar = (
    <div className="flex items-center gap-4 pt-3 pb-6 flex-wrap">
      <div className="flex-1 min-w-48 max-w-72">
        <TextInput
          label=""
          placeholder="Search transaction"
          icon="search"
          value={globalFilter}
          onChangeText={setGlobalFilter}
        />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {!isMobile && (
          <Typography variant="body" color="muted" as="span">
            Sort by
          </Typography>
        )}
        <Dropdown
          options={SORT_OPTIONS}
          selectedValue={sortOption}
          onSelect={handleSortChange}
          accessibilityLabel="Sort transactions"
          menuAccessibilityLabel="Sort options"
          drawerTitle="Sort by"
          trigger={
            isMobile
              ? () => <Icon name="sortMobile" iconSize="md" />
              : undefined
          }
        />
        {!isMobile && (
          <Typography variant="body" color="muted" as="span">
            Category
          </Typography>
        )}
        <Dropdown
          options={CATEGORY_OPTIONS}
          selectedValue={categoryOption}
          onSelect={handleCategoryChange}
          accessibilityLabel="Filter by category"
          menuAccessibilityLabel="Category options"
          drawerTitle="Category"
          trigger={
            isMobile
              ? () => <Icon name="filterMobile" iconSize="md" />
              : undefined
          }
        />
      </div>
    </div>
  )

  return (
    <DataTable
      tableStateManager={table}
      loading={loading}
      actionBar={actionBar}
      noActionBar
    />
  )
}

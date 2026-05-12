import { DataTable, Dropdown, Icon } from '@financial-app/ui/native'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'

import type { IRecurringBill } from '@financial-app/shared'

import { useRecurringBillsColumns } from './columns'
import { CompactBillRow } from './components/CompactBillRow.native'
import { SORT_OPTIONS } from './constants'
import { sortOptionToState, stateToSortOption } from './utils'

import type { IRecurringBillsDataTableProps } from './RecurringBillsDataTable'
import type { Row, SortingState, VisibilityState } from '@tanstack/react-table'

/** Breakpoint below which status/date columns are hidden. */
const MOBILE_BREAKPOINT = 768

/** Native implementation of the RecurringBillsDataTable. */
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

  const { width } = useWindowDimensions()
  const isMobile = width < MOBILE_BREAKPOINT

  const columnVisibility = useMemo<VisibilityState>(
    () => ({
      status: false,
      date: !isMobile,
    }),
    [isMobile]
  )

  const columns = useRecurringBillsColumns(locale)

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
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

  const actionBar = (
    <Dropdown
      bottomSheetTitle={t('recurring.sortBy')}
      options={SORT_OPTIONS}
      selectedValue={sortOption}
      onSelect={handleSortChange}
      accessibilityLabel={t('recurring.sortBills')}
      trigger={() => <Icon name="sortMobile" iconSize="md" />}
      buttonVariant="tertiary"
      buttonSize="sm"
      buttonClassName="p-0"
      buttonCentered
    />
  )

  return (
    <DataTable
      tableStateManager={table}
      loading={loading}
      globalFilterValue={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      pagination
      paginationPrevLabel={t('pagination.prev')}
      paginationNextLabel={t('pagination.next')}
      rightActions={actionBar}
      renderCompactRow={({ row }: { row: Row<IRecurringBill> }) => (
        <CompactBillRow row={row} locale={locale} />
      )}
      compactBreakpoint={768}
      showActionBar
    />
  )
}

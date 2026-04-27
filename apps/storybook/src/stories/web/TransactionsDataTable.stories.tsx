import { mockTransactions } from '@financial-app/shared/mocks'
import {
  AmountCell,
  AvatarNameCell,
  DataTable,
  DateCell,
  Dropdown,
  Icon,
  SimpleCell,
  SortableHeader,
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

import type { ITransaction } from '@financial-app/shared'
import type { IDropdownOption } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

// ---------------------------------------------------------------------------
// Sort options — maps Figma dropdown values to TanStack sorting state
// ---------------------------------------------------------------------------

const SORT_OPTIONS: IDropdownOption[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

function sortOptionToState(value: string): SortingState {
  switch (value) {
    case 'latest':
      return [{ id: 'date', desc: true }]
    case 'oldest':
      return [{ id: 'date', desc: false }]
    case 'a-z':
      return [{ id: 'name', desc: false }]
    case 'z-a':
      return [{ id: 'name', desc: true }]
    case 'highest':
      return [{ id: 'amount', desc: true }]
    case 'lowest':
      return [{ id: 'amount', desc: false }]
    default:
      return [{ id: 'date', desc: true }]
  }
}

// ---------------------------------------------------------------------------
// Category filter options — extracted from mock data
// ---------------------------------------------------------------------------

const ALL_CATEGORIES = 'all'

const CATEGORY_OPTIONS: IDropdownOption[] = [
  { value: ALL_CATEGORIES, label: 'All Transactions' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Dining Out', label: 'Dining Out' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Personal Care', label: 'Personal Care' },
  { value: 'Education', label: 'Education' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'General', label: 'General' },
]

// ---------------------------------------------------------------------------
// useTransactionsColumns — column definitions for ITransaction
// ---------------------------------------------------------------------------

function useTransactionsColumns(): ColumnDef<ITransaction>[] {
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
        filterFn: 'equals',
      },
      {
        accessorKey: 'date',
        header: SortableHeader('Transaction Date', 'left'),
        cell: DateCell('date'),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader('Amount', 'right', 'w-[150px]'),
        cell: AmountCell('amount', 'right'),
      },
    ],
    []
  )
}

// ---------------------------------------------------------------------------
// TransactionsDataTable — wrapper component (Odaseva DataTableExample pattern)
// ---------------------------------------------------------------------------

interface ITransactionsDataTableProps {
  /** Transaction data */
  data: ITransaction[]
  /** Show loading state */
  loading?: boolean
}

function TransactionsDataTable({
  data,
  loading,
}: Readonly<ITransactionsDataTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sortOption, setSortOption] = useState('latest')
  const [categoryOption, setCategoryOption] = useState(ALL_CATEGORIES)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive: column visibility + action bar layout
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

  const columns = useTransactionsColumns()

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

  const handleSortChange = (value: string) => {
    setSortOption(value)
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

// ---------------------------------------------------------------------------
// Storybook meta + stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Web/Design System/Organisms/TransactionsDataTable',
  component: TransactionsDataTable,
  parameters: {
    layout: 'padded',
    backgrounds: 'beige',
  },
} satisfies Meta<typeof TransactionsDataTable>

export default meta
type Story = StoryObj<typeof meta>

/** Default — all 49 mock transactions, sorted by latest. */
export const Default: Story = {
  args: {
    data: mockTransactions,
  },
}

/** Large dataset — repeated transactions to test pagination with many pages. */
export const LargeData: Story = {
  args: {
    data: [
      ...mockTransactions,
      ...mockTransactions,
      ...mockTransactions,
      ...mockTransactions,
    ],
  },
}

/** No data — empty state. */
export const NoData: Story = {
  args: {
    data: [],
  },
}

/** Loading — skeleton rows. */
export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
}

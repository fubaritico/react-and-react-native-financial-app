import { mockTransactions } from '@financial-app/shared/mocks'
import {
  AmountCell,
  Avatar,
  AvatarNameCell,
  DataTable,
  DateCell,
  Dropdown,
  Icon,
  SimpleCell,
  SortableHeader,
  TextInput,
  Typography,
} from '@financial-app/ui/native'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { View } from 'react-native'

import type { ITransaction } from '@financial-app/shared'
import type { IDropdownOption } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
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
// Category filter options
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
        header: SortableHeader('Recipient / Sender'),
        cell: AvatarNameCell('avatar', 'name'),
      },
      {
        accessorKey: 'category',
        header: SortableHeader('Category'),
        cell: SimpleCell('category', undefined, 'muted'),
        filterFn: 'equals',
      },
      {
        accessorKey: 'date',
        header: SortableHeader('Transaction Date'),
        cell: DateCell('date'),
      },
      {
        accessorKey: 'amount',
        header: SortableHeader('Amount', 'right'),
        cell: AmountCell('amount'),
      },
    ],
    []
  )
}

// ---------------------------------------------------------------------------
// Compact row renderer — matches Figma mobile layout (native)
// ---------------------------------------------------------------------------

function CompactTransactionRow({ row }: { row: Row<ITransaction> }) {
  const { name, avatar, category, date, amount } = row.original
  const isPositive = amount >= 0
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
  const signedAmount = isPositive ? `+${formatted}` : `-${formatted}`
  const displayDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}
    >
      <Avatar src={avatar} name={name} size={40} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body-bold">{name}</Typography>
        <Typography variant="caption" color="muted">
          {category}
        </Typography>
      </View>
      <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
        <Typography
          variant="body-bold"
          color={isPositive ? 'transaction-positive' : 'foreground'}
        >
          {signedAmount}
        </Typography>
        <Typography variant="caption" color="muted">
          {displayDate}
        </Typography>
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// TransactionsDataTable — wrapper component (native)
// ---------------------------------------------------------------------------

interface ITransactionsDataTableProps {
  /** Transaction data */
  data: ITransaction[]
  /** Show loading state */
  loading?: boolean
}

function TransactionsDataTable({ data, loading }: ITransactionsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sortOption, setSortOption] = useState('latest')
  const [categoryOption, setCategoryOption] = useState(ALL_CATEGORIES)

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
    state: {
      sorting,
      globalFilter,
      columnFilters,
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          label=""
          placeholder="Search transaction"
          icon="search"
          value={globalFilter}
          onChangeText={setGlobalFilter}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Dropdown
          drawerTitle="Sort by"
          options={SORT_OPTIONS}
          selectedValue={sortOption}
          onSelect={handleSortChange}
          accessibilityLabel="Sort transactions"
          trigger={() => <Icon name="sortMobile" iconSize="md" />}
        />
        <Dropdown
          drawerTitle="Category"
          options={CATEGORY_OPTIONS}
          selectedValue={categoryOption}
          onSelect={handleCategoryChange}
          accessibilityLabel="Filter by category"
          trigger={() => <Icon name="filterMobile" iconSize="md" />}
        />
      </View>
    </View>
  )

  return (
    <DataTable
      tableStateManager={table}
      loading={loading}
      pagination
      paginationPrevLabel="Prev"
      paginationNextLabel="Next"
      actionBar={actionBar}
      noActionBar
      renderCompactRow={({ row }: { row: Row<ITransaction> }) => (
        <CompactTransactionRow row={row} />
      )}
      compactBreakpoint={768}
    />
  )
}

// ---------------------------------------------------------------------------
// Storybook meta + stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Native/Design System/Organisms/TransactionsDataTable',
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

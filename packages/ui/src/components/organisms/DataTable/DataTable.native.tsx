import { flexRender } from '@tanstack/react-table'
import { Fragment, useEffect, useState } from 'react'
import { FlatList, Pressable, View, useWindowDimensions } from 'react-native'

import tw from '#Lib/tw'

import { ActionBar } from './components/ActionBar/ActionBar.native'
import { NoResults } from './components/NoResults/NoResults.native'
import { TableFooter } from './components/TableFooter/TableFooter.native'
import { TableRow } from './components/TableRow/TableRow.native'
import { COMPACT_BREAKPOINT, MIN_PAGE_SIZE } from './DataTable.constants'
import { dataTableStyles } from './DataTable.styles'
import { dataTableRowVariants } from './DataTable.variants'

import type { BaseDataTableProps } from './DataTable.types'
import type { Row, Table } from '@tanstack/react-table'
import type { ReactElement } from 'react'

export type NativeDataTableProps<TData> = BaseDataTableProps<TData> & {
  /** Custom row renderer for phone/compact layout.
   *  When provided and screen width < compactBreakpoint, this replaces columnar rendering. */
  renderCompactRow?: (info: { row: Row<TData>; index: number }) => ReactElement
  /** Width threshold below which compact mode activates (default: 768). */
  compactBreakpoint?: number
  /** Message shown when !loading && rows.length === 0. */
  emptyMessage?: string
  /** Show pagination. Only rendered when !loading && rowCount > pageSize. */
  pagination?: boolean
  /** Label for the previous button (desktop). */
  paginationPrevLabel?: string
  /** Label for the next button (desktop). */
  paginationNextLabel?: string
  /** Available page size options (e.g. [10, 25, 50]). */
  rowsPerPageOptions?: number[]
  /** Label displayed before the rows-per-page selector. */
  rowsPerPageLabel?: string
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Label for the search input (accessibility). Defaults to "Search". */
  searchLabel?: string
}

/**
 * DataTable organism (native).
 * Renders a FlatList-based table with dual mode:
 * columnar on tablets (>= breakpoint), compact on phones.
 */
export function DataTable<TData>({
  tableStateManager,
  loading,
  rowsSkeleton: RowSkeleton,
  emptyMessage = 'No results.',
  pagination,
  paginationPrevLabel,
  paginationNextLabel,
  onRowClick,
  onGlobalFilterChange,
  renderCompactRow,
  compactBreakpoint = COMPACT_BREAKPOINT,
  actionBar,
  noActionBar,
  leftActions,
  showRowsPerPage,
  searchPlaceholder,
  searchLabel,
  rowsPerPageOptions,
  rowsPerPageLabel,
  initTableAt,
}: Readonly<NativeDataTableProps<TData>>) {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768
  const isCompact = !!renderCompactRow && width < compactBreakpoint

  const rows = tableStateManager.getRowModel().rows
  const pageSize = tableStateManager.getState().pagination.pageSize
  const isEmpty = !loading && rows.length === 0
  const showPagination =
    pagination && !loading && tableStateManager.getRowCount() > pageSize

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (initTableAt) tableStateManager.setPageIndex(initTableAt)
  }, [initTableAt, tableStateManager])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onGlobalFilterChange?.(value)
  }

  const renderColumnarRow = ({ item: row }: { item: Row<TData> }) => {
    const rowContent = (
      <View
        style={tw`${dataTableStyles.bodyRow} ${dataTableRowVariants({ divider: true })} `}
      >
        {row.getVisibleCells().map((cell) => (
          <View key={cell.id} style={tw`${dataTableStyles.bodyCell}`}>
            <Fragment>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Fragment>
          </View>
        ))}
      </View>
    )

    if (onRowClick) {
      return (
        <Pressable
          onPress={() => {
            onRowClick(row)
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: false }}
        >
          {rowContent}
        </Pressable>
      )
    }

    return rowContent
  }

  const renderCompactItem = ({
    item: row,
    index,
  }: {
    item: Row<TData>
    index: number
  }) => {
    if (!renderCompactRow) return null
    const content = renderCompactRow({ row, index })

    if (onRowClick) {
      return (
        <Pressable
          onPress={() => {
            onRowClick(row)
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: false }}
        >
          {content}
        </Pressable>
      )
    }

    return content
  }

  const renderEmpty = () => <NoResults message={emptyMessage} />

  const skeletonData = Array.from({ length: MIN_PAGE_SIZE }, (_, i) => i)

  return (
    <View
      style={[
        tw`${dataTableStyles.container}`,
        tw`${isTablet ? 'p-8' : 'p-6'}`,
      ]}
    >
      {/* ActionBar */}
      {!noActionBar && !actionBar && onGlobalFilterChange && (
        <ActionBar
          leftActions={leftActions}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          searchLabel={searchLabel}
        />
      )}
      {actionBar}

      {/* Loading skeleton */}
      {loading && RowSkeleton && (
        <FlatList
          data={skeletonData}
          renderItem={() => <RowSkeleton />}
          keyExtractor={(_, i) => `skeleton-${String(i)}`}
          scrollEnabled={false}
        />
      )}

      {/* Data — columnar mode (tablet) */}
      {!loading && !isCompact && (
        <>
          {/* Header row */}
          {tableStateManager.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={tw`${dataTableStyles.headerRow} border-t-0`}
            >
              {headerGroup.headers.map((header) => (
                <View key={header.id} style={tw`${dataTableStyles.headerCell}`}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </View>
              ))}
            </TableRow>
          ))}

          <FlatList
            data={rows}
            renderItem={renderColumnarRow}
            keyExtractor={(row) => row.id}
            ListEmptyComponent={isEmpty ? renderEmpty : null}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Data — compact mode (phone) */}
      {!loading && isCompact && (
        <FlatList
          data={rows}
          renderItem={renderCompactItem}
          keyExtractor={(row) => row.id}
          ItemSeparatorComponent={() => (
            <View style={tw`border-b border-border`} />
          )}
          ListEmptyComponent={isEmpty ? renderEmpty : null}
          scrollEnabled={false}
        />
      )}

      {/* Footer */}
      {showPagination && (
        <TableFooter
          tableStateManager={tableStateManager as unknown as Table<unknown>}
          rowsPerPageOptions={rowsPerPageOptions ?? [pageSize]}
          rowsPerPageLabel={rowsPerPageLabel}
          prevLabel={paginationPrevLabel}
          nextLabel={paginationNextLabel}
          showRowsPerPage={showRowsPerPage}
          fullWidthPagination={!showRowsPerPage}
        />
      )}
    </View>
  )
}

import { flexRender } from '@tanstack/react-table'
import { Fragment, useState } from 'react'
import { FlatList, Pressable, View, useWindowDimensions } from 'react-native'

import tw from '../../../lib/tw'

import { ActionBar } from './components/ActionBar/ActionBar.native'
import { NoResults } from './components/NoResults/NoResults.native'
import { TableFooter } from './components/TableFooter/TableFooter.native'
import { COMPACT_BREAKPOINT } from './DataTable.constants'
import { dataTableStyles } from './DataTable.styles'
import { dataTableRowVariants } from './DataTable.variants'

import type { IDataTableProps } from './DataTable'
import type { Row, Table } from '@tanstack/react-table'

/**
 * DataTable organism (native).
 * Renders a FlatList-based table with dual mode:
 * columnar on tablets (>= breakpoint), compact on phones.
 */
export function DataTable<TData>({
  table,
  loading,
  rowsSkeleton: RowSkeleton,
  emptyMessage = 'No results.',
  pagination,
  paginationPrevLabel,
  paginationNextLabel,
  onRowPress,
  renderCompactRow,
  compactBreakpoint = COMPACT_BREAKPOINT,
  actionBar,
  noActionBar,
  leftActions,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  rowsPerPageOptions,
  rowsPerPageLabel,
}: IDataTableProps<TData>) {
  const { width } = useWindowDimensions()
  const isCompact = !!renderCompactRow && width < compactBreakpoint

  const rows = table.getRowModel().rows
  const pageSize = table.getState().pagination.pageSize
  const isEmpty = !loading && rows.length === 0
  const showPagination =
    pagination && !loading && table.getRowCount() > pageSize

  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const renderColumnarRow = ({ item: row }: { item: Row<TData> }) => {
    const rowContent = (
      <View
        style={tw`${dataTableStyles.bodyRow} ${dataTableRowVariants({ divider: true })}`}
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

    if (onRowPress) {
      return (
        <Pressable
          onPress={() => {
            onRowPress(row)
          }}
          accessibilityRole="button"
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

    if (onRowPress) {
      return (
        <Pressable
          onPress={() => {
            onRowPress(row)
          }}
          accessibilityRole="button"
        >
          {content}
        </Pressable>
      )
    }

    return content
  }

  const renderEmpty = () => <NoResults message={emptyMessage} />

  const skeletonData = Array.from({ length: pageSize }, (_, i) => i)

  return (
    <View style={tw`${dataTableStyles.container}`}>
      {/* ActionBar */}
      {!noActionBar && !actionBar && onSearchChange && (
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
          {table.getHeaderGroups().map((headerGroup) => (
            <View key={headerGroup.id} style={tw`${dataTableStyles.headerRow}`}>
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
            </View>
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
          table={table as unknown as Table<unknown>}
          rowsPerPageOptions={rowsPerPageOptions ?? [pageSize]}
          rowsPerPageLabel={rowsPerPageLabel}
          prevLabel={paginationPrevLabel}
          nextLabel={paginationNextLabel}
        />
      )}
    </View>
  )
}

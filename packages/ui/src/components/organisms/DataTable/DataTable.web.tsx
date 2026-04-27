import { flexRender } from '@tanstack/react-table'
import { Fragment, useEffect, useRef, useState } from 'react'

import { cn } from '../../../lib/cn'
import { Typography } from '../../atoms/Typography/Typography.web'
import { DataTablePagination } from '../../molecules/DataTablePagination/DataTablePagination.web'

import { ActionBar } from './ActionBar/ActionBar.web'
import { COMPACT_BREAKPOINT } from './DataTable.constants'
import { dataTableStyles } from './DataTable.styles'
import { dataTableRowVariants } from './DataTable.variants'

import type { IDataTableProps } from './DataTable'

/**
 * DataTable organism (web).
 * Renders a semantic `<table>` in columnar mode (tablet/desktop)
 * or a stacked list via `renderCompactRow` in compact mode (phone).
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
}: IDataTableProps<TData>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
      }
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])

  const isCompact = !!renderCompactRow && width < compactBreakpoint
  const rows = table.getRowModel().rows
  const pageSize = table.getState().pagination.pageSize
  const hasData = !loading && rows.length > 0
  const isEmpty = !loading && rows.length === 0
  const showPagination =
    pagination && !loading && table.getRowCount() > pageSize

  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  return (
    <div ref={containerRef} className={cn(dataTableStyles.container)}>
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

      {/* Columnar mode (tablet/desktop) */}
      {!isCompact && (
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-3 px-4 text-left align-middle"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {/* Loading skeleton */}
            {loading &&
              RowSkeleton &&
              Array.from({ length: pageSize }, (_, i) => (
                <tr key={`skeleton-${String(i)}`}>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-4 py-4"
                  >
                    <RowSkeleton />
                  </td>
                </tr>
              ))}

            {/* Data rows */}
            {hasData &&
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    dataTableRowVariants({ divider: true }),
                    'hover:bg-beige-100 transition-colors',
                    onRowPress ? 'cursor-pointer' : ''
                  )}
                  onClick={() => onRowPress?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Fragment key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Fragment>
                  ))}
                </tr>
              ))}

            {/* Empty state */}
            {isEmpty && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="py-8 text-center"
                >
                  <Typography variant="body" color="muted">
                    {emptyMessage}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Compact mode (phone) */}
      {isCompact && (
        <div className="divide-y divide-border">
          {/* Loading skeleton */}
          {loading &&
            RowSkeleton &&
            Array.from({ length: pageSize }, (_, i) => (
              <div key={`skeleton-${String(i)}`} className="py-4 px-4">
                <RowSkeleton />
              </div>
            ))}

          {/* Data rows */}
          {hasData &&
            rows.map((row, index) => (
              <div
                key={row.id}
                className={cn(onRowPress ? 'cursor-pointer' : '')}
                onClick={() => onRowPress?.(row)}
                role={onRowPress ? 'button' : undefined}
                tabIndex={onRowPress ? 0 : undefined}
                onKeyDown={
                  onRowPress
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowPress(row)
                        }
                      }
                    : undefined
                }
              >
                {renderCompactRow({ row, index })}
              </div>
            ))}

          {/* Empty state */}
          {isEmpty && (
            <div className="py-8 text-center">
              <Typography variant="body" color="muted">
                {emptyMessage}
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          table={
            table as unknown as import('@tanstack/react-table').Table<unknown>
          }
          prevLabel={paginationPrevLabel}
          nextLabel={paginationNextLabel}
        />
      )}
    </div>
  )
}

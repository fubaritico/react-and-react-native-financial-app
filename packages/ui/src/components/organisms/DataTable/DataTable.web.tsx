import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { Fragment, useEffect } from 'react'

import {
  ActionBar,
  NoResults,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
} from './components/index.web'
import { MIN_PAGE_SIZE } from './DataTable.constants'

import type { BaseDataTableProps } from './DataTable.types'
import type { Table as TableType } from '@tanstack/react-table'

export type DataTableProps<TData> = BaseDataTableProps<TData> & {
  /* Extra CSS classes for the action bar */
  actionBarClassName?: string
  /* Extra CSS classes for the root wrapper */
  className?: string
  /* Extra CSS classes for the table header */
  headerClassName?: string
  /* Use along with sticky header to get a fixed height for the table (header and body) */
  maxHeight?: number
  /* Disable shadow on the wrapper */
  noShadow?: boolean
  /* When enabled, will keep the table cell header on top of the table when scrolling body */
  stickyHeader?: boolean
  /* Extra CSS classes for the table body */
  tBodyClassName?: string
}

export default function DataTable<TData>({
  actionBar,
  actionBarClassName,
  className,
  dataTestId,
  headerClassName,
  initTableAt,
  leftActions,
  loading,
  maxHeight,
  noActionBar,
  noShadow,
  showRowsPerPage,
  noPagination,
  onGlobalFilterChange,
  onRowClick,
  rowsSkeleton: RowSkeleton,
  stickyHeader,
  tableStateManager,
  tBodyClassName,
}: Readonly<DataTableProps<TData>>) {
  useEffect(() => {
    if (initTableAt) tableStateManager.setPageIndex(initTableAt)
  }, [initTableAt, tableStateManager])

  if (stickyHeader && !maxHeight) {
    throw new Error(
      '[DataTable] maxHeight is required when stickyHeader is enabled'
    )
  }

  if (!stickyHeader && maxHeight) {
    throw new Error(
      '[DataTable] stickyHeader is required when maxHeight is defined'
    )
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-bl-lg rounded-lg overflow-clip p-6 lg:p-8',
        { 'shadow-md': !noShadow },
        className
      )}
      data-test={dataTestId ?? 'root'}
    >
      {!noActionBar && !actionBar && (
        <ActionBar
          tableConfiguration={tableStateManager as TableType<unknown>}
          className={actionBarClassName}
          leftActions={leftActions}
          stickyHeader={stickyHeader}
          onGlobalFilterChange={onGlobalFilterChange}
        />
      )}
      {actionBar}
      <Table maxHeight={maxHeight}>
        <TableHeader
          className={clsx(
            { 'sticky top-0 z-30': stickyHeader },
            headerClassName
          )}
        >
          {tableStateManager.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-t-0">
              {headerGroup.headers.map((header) => {
                return (
                  <Fragment key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Fragment>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={tBodyClassName}>
          <>
            {loading &&
              RowSkeleton &&
              Array.from({ length: MIN_PAGE_SIZE }, (_, index) => (
                <RowSkeleton key={`row-skeleton-${String(index)}`} />
              ))}
            {!loading &&
              tableStateManager.getRowModel().rows.length > 0 &&
              tableStateManager.getRowModel().rows.map((row) => {
                const isSelected = row.getIsSelected()

                return (
                  <TableRow
                    className={clsx('h-[54px]', {
                      'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900':
                        !!onRowClick,
                    })}
                    data-test={`row-${row.id}`}
                    data-state={isSelected && 'selected'}
                    enableHover
                    key={`row-${row.id}`}
                    role={onRowClick ? 'button' : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Fragment key={`cell-${row.id}-${cell.id}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Fragment>
                    ))}
                  </TableRow>
                )
              })}
            {!loading && tableStateManager.getRowModel().rows.length === 0 && (
              <NoResults
                columnLength={
                  tableStateManager
                    .getAllColumns()
                    .filter((column) => column.getIsVisible()).length
                }
              />
            )}
          </>
        </TableBody>
      </Table>

      {/* PAGINATION BLOCK */}
      {!loading &&
        tableStateManager.getRowCount() > MIN_PAGE_SIZE &&
        !noPagination && (
          <TableFooter
            tableStateManager={tableStateManager as TableType<unknown>}
            showRowsPerPage={showRowsPerPage}
            fullWidthPagination={!showRowsPerPage}
          />
        )}
    </div>
  )
}

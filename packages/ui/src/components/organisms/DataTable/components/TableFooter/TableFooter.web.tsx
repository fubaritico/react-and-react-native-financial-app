import { cn } from '../../../../../lib/cn'
import { Typography } from '../../../../atoms/Typography/Typography.web'
import { DataTablePagination } from '../../../../molecules/DataTablePagination/DataTablePagination.web'
import { Dropdown } from '../../../../molecules/Dropdown/Dropdown.web'
import { MIN_PAGE_SIZE } from '../../DataTable.constants'

import type { ITableFooterProps } from './TableFooter.tsx'

const DEFAULT_ROW_OPTIONS = [
  MIN_PAGE_SIZE,
  MIN_PAGE_SIZE * 2,
  MIN_PAGE_SIZE * 3,
  MIN_PAGE_SIZE * 4,
  MIN_PAGE_SIZE * 5,
]

/**
 * Table footer (web).
 * Rows-per-page selector on the left, pagination on the right.
 * Mirrors Odaseva TableFooter layout.
 */
export function TableFooter({
  tableStateManager,
  rowsPerPageOptions = DEFAULT_ROW_OPTIONS,
  rowsPerPageLabel = 'Rows per page',
  rowsPerPageAccessibilityLabel,
  rowsPerPageDrawerTitle,
  showRowsPerPage,
  prevLabel,
  nextLabel,
  prevAriaLabel,
  nextAriaLabel,
  pageAriaLabel,
  fullWidthPagination,
}: Readonly<ITableFooterProps>) {
  const { pageSize } = tableStateManager.getState().pagination
  const showPagination =
    tableStateManager.getRowCount() >
    tableStateManager.getState().pagination.pageSize

  return (
    <div
      className={cn(
        'flex items-center py-4',
        showRowsPerPage ? 'justify-between' : 'justify-center'
      )}
    >
      {/* Rows per page selector */}
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <Dropdown
            options={rowsPerPageOptions.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
            selectedValue={String(pageSize)}
            onSelect={(value) => {
              tableStateManager.setPageSize(Number(value))
            }}
            accessibilityLabel={rowsPerPageAccessibilityLabel}
            drawerTitle={rowsPerPageDrawerTitle}
          />
          <Typography variant="body" color="muted">
            {rowsPerPageLabel}
          </Typography>
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          table={tableStateManager}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          prevAriaLabel={prevAriaLabel}
          nextAriaLabel={nextAriaLabel}
          pageAriaLabel={pageAriaLabel}
          fullWidth={fullWidthPagination}
        />
      )}
    </div>
  )
}

import { Typography } from '../../../../atoms/Typography/Typography.web'
import { DataTablePagination } from '../../../../molecules/DataTablePagination/DataTablePagination.web'
import { Dropdown } from '../../../../molecules/Dropdown/Dropdown.web'

import type { ITableFooterProps } from './TableFooter'

/**
 * Table footer (web).
 * Rows-per-page selector on the left, pagination on the right.
 * Mirrors Odaseva TableFooter layout.
 */
export function TableFooter({
  table,
  rowsPerPageOptions,
  rowsPerPageLabel = 'Rows per page',
  rowsPerPageAccessibilityLabel,
  rowsPerPageDrawerTitle,
  prevLabel,
  nextLabel,
  prevAriaLabel,
  nextAriaLabel,
  pageAriaLabel,
}: ITableFooterProps) {
  const { pageSize } = table.getState().pagination
  const showPagination =
    table.getRowCount() > table.getState().pagination.pageSize

  return (
    <div className="flex items-center justify-between border-t border-border px-3 py-4">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <Dropdown
          options={rowsPerPageOptions.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          selectedValue={String(pageSize)}
          onSelect={(value) => {
            table.setPageSize(Number(value))
          }}
          accessibilityLabel={rowsPerPageAccessibilityLabel}
          drawerTitle={rowsPerPageDrawerTitle}
        />
        <Typography variant="body" color="muted">
          {rowsPerPageLabel}
        </Typography>
      </div>

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          table={table}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          prevAriaLabel={prevAriaLabel}
          nextAriaLabel={nextAriaLabel}
          pageAriaLabel={pageAriaLabel}
        />
      )}
    </div>
  )
}

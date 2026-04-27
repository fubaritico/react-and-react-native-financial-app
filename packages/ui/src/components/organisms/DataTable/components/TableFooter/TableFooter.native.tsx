import { View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Typography } from '../../../../atoms/Typography/Typography.native'
import { DataTablePagination } from '../../../../molecules/DataTablePagination/DataTablePagination.native'
import { Dropdown } from '../../../../molecules/Dropdown/Dropdown.native'

import type { ITableFooterProps } from './TableFooter'

/**
 * Table footer (native).
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
    <View
      style={tw`items-center justify-between border-t border-border px-3 py-4`}
    >
      {/* Rows per page selector */}
      <View style={tw`flex-row items-center gap-2`}>
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
      </View>

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
    </View>
  )
}

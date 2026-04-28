import { View } from 'react-native'

import tw from '#Lib/tw'

import type { ITableFooterProps } from './TableFooter.tsx'

import { Typography } from '#Atoms'
import { DataTablePagination, Dropdown } from '#Molecules'

/**
 * Table footer (native).
 * Rows-per-page selector on the left, pagination on the right.
 * Mirrors Odaseva TableFooter layout.
 */
export function TableFooter({
  tableStateManager,
  rowsPerPageOptions,
  rowsPerPageLabel = 'Rows per page',
  rowsPerPageAccessibilityLabel,
  rowsPerPageDrawerTitle,
  prevLabel,
  nextLabel,
  prevAriaLabel,
  nextAriaLabel,
  pageAriaLabel,
  showRowsPerPage,
  fullWidthPagination,
}: Readonly<ITableFooterProps>) {
  const { pageSize } = tableStateManager.getState().pagination
  const showPagination =
    tableStateManager.getRowCount() >
    tableStateManager.getState().pagination.pageSize

  return (
    <View
      style={tw`items-center py-4 ${showRowsPerPage ? 'justify-between' : 'justify-center'}`}
    >
      {/* Rows per page selector */}
      {showRowsPerPage && (
        <View style={tw`flex-row items-center gap-2`}>
          <Dropdown
            options={(rowsPerPageOptions ?? []).map((size) => ({
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
        </View>
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
    </View>
  )
}

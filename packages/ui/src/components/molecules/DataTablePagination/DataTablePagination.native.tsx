import { Pagination } from '../Pagination/Pagination.native'

import type { IDataTablePaginationProps } from './DataTablePagination'

/**
 * DataTable pagination adapter (native).
 * Bridges TanStack Table page state to the Pagination molecule.
 */
export function DataTablePagination({
  table,
  prevLabel,
  nextLabel,
  prevAriaLabel,
  nextAriaLabel,
  pageAriaLabel,
}: IDataTablePaginationProps) {
  const { pageIndex } = table.getState().pagination

  return (
    <Pagination
      canNextPage={table.getCanNextPage()}
      canPreviousPage={table.getCanPreviousPage()}
      countPages={table.getPageCount()}
      currentPage={pageIndex}
      gotoFirst={() => {
        table.setPageIndex(0)
      }}
      gotoLast={() => {
        table.setPageIndex(table.getPageCount() - 1)
      }}
      gotoNext={() => {
        table.nextPage()
      }}
      gotoPrevious={() => {
        table.previousPage()
      }}
      handleChangePage={(page) => {
        table.setPageIndex(page)
      }}
      prevLabel={prevLabel}
      nextLabel={nextLabel}
      prevAriaLabel={prevAriaLabel}
      nextAriaLabel={nextAriaLabel}
      pageAriaLabel={pageAriaLabel}
    />
  )
}

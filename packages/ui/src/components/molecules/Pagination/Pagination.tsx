export interface IPaginationProps {
  /** Whether navigation to the next page is possible */
  canNextPage: boolean
  /** Whether navigation to the previous page is possible */
  canPreviousPage: boolean
  /** Total number of pages */
  countPages: number
  /** Current page index (0-based) */
  currentPage: number
  /** Navigate to the first page */
  gotoFirst: () => void
  /** Navigate to the last page */
  gotoLast: () => void
  /** Navigate to the next page */
  gotoNext: () => void
  /** Navigate to the previous page */
  gotoPrevious: () => void
  /** Navigate to a specific page by index (0-based) */
  handleChangePage: (value: number) => void
  /** Label for the previous button (desktop). Defaults to "Prev". */
  prevLabel?: string
  /** Label for the next button (desktop). Defaults to "Next". */
  nextLabel?: string
  /** Accessible label for the previous button. Defaults to "Previous page". */
  prevAriaLabel?: string
  /** Accessible label for the next button. Defaults to "Next page". */
  nextAriaLabel?: string
  /** Factory for per-page accessible labels. Receives 1-based page number. Defaults to "Page {n}". */
  pageAriaLabel?: (page: number) => string
}

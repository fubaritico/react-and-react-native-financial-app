export interface INoResultsProps {
  /** Message displayed when the table has no data rows.
   *  Defaults to "No results." at the DataTable level. */
  message?: string
  /** Number of visible columns — used for colSpan on web. */
  columnLength?: number
}

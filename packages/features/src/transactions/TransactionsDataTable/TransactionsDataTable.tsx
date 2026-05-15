import type { ITransaction } from '@financial-app/shared'

/** Props for the TransactionsDataTable component. */
export interface ITransactionsDataTableProps {
  /** Transaction data to display. */
  data: ITransaction[]
  /** Show loading skeleton state. */
  loading?: boolean
  /** BCP 47 locale tag for date/currency formatting (defaults to 'en-US'). */
  locale?: string
  /** Called when the user selects "Edit" from a row's action menu. */
  onEdit?: (transaction: ITransaction) => void
  /** Called when the user selects "Delete" from a row's action menu. */
  onDelete?: (transaction: ITransaction) => void
}

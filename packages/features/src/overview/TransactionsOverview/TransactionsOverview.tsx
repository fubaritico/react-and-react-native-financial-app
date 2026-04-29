/** Individual transaction data for the overview. */
export interface ITransactionOverviewItem {
  /** URL or path to counterparty avatar. */
  avatar: string
  /** Counterparty name. */
  name: string
  /** Amount in currency units (positive = income, negative = expense). */
  amount: number
  /** Formatted date string (e.g., "19 Aug 2024"). */
  date: string
}

/** Props for the TransactionsOverview component. */
export interface ITransactionsOverviewProps {
  /** Section title (e.g., "Transactions"). */
  title: string
  /** Label for the "View All" link. */
  viewAllLabel: string
  /** Array of transactions to display (max 5). */
  transactions: ITransactionOverviewItem[]
  /** Callback when "View All" is pressed. */
  onViewAll: () => void
}

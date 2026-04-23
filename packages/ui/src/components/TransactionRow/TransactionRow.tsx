/** Props for the TransactionRow component. */
export interface ITransactionRowProps {
  /** URL or local path to the counterparty avatar. */
  avatar: string
  /** Counterparty name. */
  name: string
  /** Amount in currency units (positive = income, negative = expense). */
  amount: number
  /** Formatted date string (e.g., "19 Aug 2024"). */
  date: string
}

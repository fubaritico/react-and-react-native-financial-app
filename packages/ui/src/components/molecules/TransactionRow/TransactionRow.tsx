import type { IconName } from '@financial-app/icons'

/** Props for the TransactionRow component. */
export interface ITransactionRowProps {
  /** Counterparty name. */
  name: string
  /** Amount in currency units (positive = income, negative = expense). */
  amount: number
  /** Formatted date string (e.g., "19 Aug 2024"). */
  date: string
  /** Category icon identifier (e.g. "categoryGeneral"). */
  categoryIcon: IconName
  /** Category color token key (e.g. "blue", "army-green"). */
  categoryColor: string
}

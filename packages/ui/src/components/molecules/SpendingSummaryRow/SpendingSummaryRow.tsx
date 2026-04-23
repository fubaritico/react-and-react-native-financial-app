/** Props for the SpendingSummaryRow component. */
export interface ISpendingSummaryRowProps {
  /** Category label (e.g., "Entertainment", "Bills"). */
  label: string
  /** Amount to display, formatted as currency string. */
  amount: string
  /** Token color name for the dot (e.g., "green", "cyan"). */
  color: string
}

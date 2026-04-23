import type { billSummaryRowVariants } from './BillSummaryRow.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the BillSummaryRow component. */
export interface IBillSummaryRowProps extends VariantProps<
  typeof billSummaryRowVariants
> {
  /** Status label (e.g., "Paid Bills", "Total Upcoming", "Due Soon"). */
  label: string
  /** Amount to display, formatted as currency string. */
  amount: string
  /** Token color name for the left border (e.g., "green", "yellow", "cyan"). */
  color: string
}

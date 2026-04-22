import { cn } from '../../lib/cn'
import { coloredBorderItemVariants } from '../../variants'

import styles from './BillSummaryRow.styles'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Web implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <div
    className={cn(coloredBorderItemVariants({ layout: 'row' }), 'bg-beige-100')}
    style={{ borderLeft: `4px solid var(--color-base-${color}-default)` }}
  >
    <span className={styles.label}>{label}</span>
    <span className={styles.amount}>{amount}</span>
  </div>
)

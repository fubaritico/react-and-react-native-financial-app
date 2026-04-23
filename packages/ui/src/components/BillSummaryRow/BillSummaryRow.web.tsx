import { cn } from '../../lib/cn'

import styles from './BillSummaryRow.styles'
import { billSummaryRowVariants } from './BillSummaryRow.variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'
import type { CSSProperties } from 'react'

/** Web implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <div
    className={cn(
      billSummaryRowVariants(),
      'flex border-l-[var(--border-color)]'
    )}
    style={
      {
        '--border-color': `var(--color-base-${color}-DEFAULT)`,
      } as CSSProperties
    }
  >
    <span className={styles.label}>{label}</span>
    <span className={styles.amount}>{amount}</span>
  </div>
)

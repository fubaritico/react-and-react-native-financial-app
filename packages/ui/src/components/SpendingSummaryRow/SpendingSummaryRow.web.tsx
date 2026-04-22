import { ColorDot } from '../ColorDot/ColorDot.web'

import styles from './SpendingSummaryRow.styles'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Web implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: ISpendingSummaryRowProps) => (
  <div className="flex items-center py-2">
    <ColorDot color={color} size={16} />
    <span className={styles.label}>{label}</span>
    <span className={styles.amount}>{amount}</span>
  </div>
)

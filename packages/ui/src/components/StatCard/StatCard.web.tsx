import { cn } from '../../lib/cn'
import { coloredBorderItemVariants } from '../../variants'

import styles from './StatCard.styles'

import type { IStatCardProps } from './StatCard'

/** Web implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <div
    className={cn(coloredBorderItemVariants({ layout: 'stacked' }))}
    style={{ borderLeft: `4px solid var(--color-base-${color}-default)` }}
  >
    <p className={styles.label}>{label}</p>
    <p className={styles.amount}>{amount}</p>
  </div>
)

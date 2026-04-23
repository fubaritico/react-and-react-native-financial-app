import { cn } from '../../lib/cn'

import styles from './StatCard.styles'
import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'
import type { CSSProperties } from 'react'

/** Web implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <div
    className={cn(statCardVariants(), 'border-l-[var(--border-color)]')}
    style={
      {
        '--border-color': `var(--color-base-${color}-DEFAULT)`,
      } as CSSProperties
    }
  >
    <p className={styles.label}>{label}</p>
    <p className={styles.amount}>{amount}</p>
  </div>
)

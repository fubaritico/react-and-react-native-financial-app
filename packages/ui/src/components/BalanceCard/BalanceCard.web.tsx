import { cn } from '../../lib/cn'

import styles from './BalanceCard.styles'
import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'

/** Web implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: IBalanceCardProps) => {
  const labelColor = tone === 'dark' ? 'text-on-dark' : 'text-foreground-muted'
  const amountColor = tone === 'dark' ? 'text-on-dark' : 'text-foreground'

  return (
    <div className={cn(balanceCardVariants({ tone }))}>
      <p className={cn(styles.label, labelColor)}>{label}</p>
      <p className={cn(styles.amount, amountColor)}>{amount}</p>
    </div>
  )
}

import { cn } from '../../lib/cn'
import { balanceCardVariants } from '../../variants'

import type { IBalanceCardProps } from './BalanceCard'

/** Web implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: IBalanceCardProps) => {
  const labelColor = tone === 'dark' ? 'text-white' : 'text-grey-500'
  const amountColor = tone === 'dark' ? 'text-white' : 'text-grey-900'

  return (
    <div className={cn(balanceCardVariants({ tone }))}>
      <p className={cn('text-sm', labelColor)}>{label}</p>
      <p className={cn('text-3xl font-bold', amountColor)}>{amount}</p>
    </div>
  )
}

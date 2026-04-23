import { cn } from '../../lib/cn'
import { Typography } from '../Typography/Typography.web'

import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'
import type { TypographyVariants } from '../Typography/Typography.variants'

/** Web implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: IBalanceCardProps) => {
  const labelColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'muted'
  const amountColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'foreground'

  return (
    <div className={cn(balanceCardVariants({ tone }))}>
      <Typography variant="body" color={labelColor} as="p">
        {label}
      </Typography>
      <Typography variant="heading-xl" color={amountColor} as="p">
        {amount}
      </Typography>
    </div>
  )
}

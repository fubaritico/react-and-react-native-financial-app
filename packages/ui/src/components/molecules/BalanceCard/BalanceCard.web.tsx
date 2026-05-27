import { cn } from '#Lib/cn'
import { WEB_SHADOW } from '#Lib/shadow'

import { Currency } from '#Atoms/Currency/Currency.web'
import { Typography } from '#Atoms/index.web'
import type { TypographyVariants } from '#Atoms/Typography/Typography.variants'

import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'

/** Web implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
  shadow,
}: Readonly<IBalanceCardProps>) => {
  const labelColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'muted'
  const amountColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'foreground'

  return (
    <div
      className={cn(balanceCardVariants({ tone }), { [WEB_SHADOW]: shadow })}
    >
      <Typography variant="body" color={labelColor} as="p">
        {label}
      </Typography>
      <Typography variant="heading-xl" color={amountColor} as="p">
        <Currency>{amount}</Currency>
      </Typography>
    </div>
  )
}

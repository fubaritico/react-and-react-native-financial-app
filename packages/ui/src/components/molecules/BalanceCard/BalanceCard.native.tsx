import { View } from 'react-native'

import tw from '#Lib/tw'

import type { TypographyVariants } from '#Atoms/Typography/Typography.variants'

import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'

import { Currency, Typography } from '#Atoms'

/** Native implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: Readonly<IBalanceCardProps>) => {
  const labelColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'muted'
  const amountColor: TypographyVariants['color'] =
    tone === 'dark' ? 'on-dark' : 'foreground'

  return (
    <View style={tw`${balanceCardVariants({ tone })}`}>
      <Typography variant="body" color={labelColor}>
        {label}
      </Typography>
      <Typography variant="heading-xl" color={amountColor}>
        <Currency>{amount}</Currency>
      </Typography>
    </View>
  )
}

import { View } from 'react-native'

import tw from '../../lib/tw'
import { Typography } from '../Typography/Typography.native'

import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'
import type { TypographyVariants } from '../Typography/Typography.variants'

/** Native implementation of the BalanceCard component. */
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
    <View style={tw`${balanceCardVariants({ tone })}`}>
      <Typography variant="body" color={labelColor}>
        {label}
      </Typography>
      <Typography variant="heading-xl" color={amountColor}>
        {amount}
      </Typography>
    </View>
  )
}

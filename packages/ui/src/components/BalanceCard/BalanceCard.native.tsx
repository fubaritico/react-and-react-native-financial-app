import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './BalanceCard.styles'
import { balanceCardVariants } from './BalanceCard.variants'

import type { IBalanceCardProps } from './BalanceCard'

/** Native implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: IBalanceCardProps) => {
  const labelColor = tone === 'dark' ? 'text-on-dark' : 'text-foreground-muted'
  const amountColor = tone === 'dark' ? 'text-on-dark' : 'text-foreground'

  return (
    <View style={tw`${balanceCardVariants({ tone })}`}>
      <Text style={tw`${styles.label} ${labelColor}`}>{label}</Text>
      <Text style={tw`${styles.amount} ${amountColor}`}>{amount}</Text>
    </View>
  )
}

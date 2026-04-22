import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { balanceCardVariants } from '../../variants'

import styles from './BalanceCard.styles'

import type { IBalanceCardProps } from './BalanceCard'

/** Native implementation of the BalanceCard component. */
export const BalanceCard = ({
  label,
  amount,
  tone = 'light',
}: IBalanceCardProps) => {
  const labelColor = tone === 'dark' ? 'text-white' : 'text-grey-500'
  const amountColor = tone === 'dark' ? 'text-white' : 'text-grey-900'

  return (
    <View style={tw`${balanceCardVariants({ tone })}`}>
      <Text style={tw`${styles.label} ${labelColor}`}>{label}</Text>
      <Text style={tw`${styles.amount} ${amountColor}`}>{amount}</Text>
    </View>
  )
}

import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { balanceCardVariants } from '../../variants'

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
      <Text style={tw`text-sm ${labelColor}`}>{label}</Text>
      <Text style={tw`text-3xl font-bold ${amountColor}`}>{amount}</Text>
    </View>
  )
}

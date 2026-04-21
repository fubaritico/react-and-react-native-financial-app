import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { Avatar } from '../Avatar/Avatar.native'
import { Divider } from '../Divider/Divider.native'

import type { ITransactionRowProps } from './TransactionRow'

/** Formats a number as a signed currency string. */
const formatAmount = (amount: number): string => {
  const prefix = amount >= 0 ? '+' : '-'
  return `${prefix}$${Math.abs(amount).toFixed(2)}`
}

/** Native implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
  showDivider = true,
}: ITransactionRowProps) => {
  const amountColor = amount >= 0 ? 'text-green' : 'text-grey-900'

  return (
    <>
      <View style={tw`flex-row items-center py-3`}>
        <Avatar src={avatar} name={name} size={40} />
        <Text style={tw`flex-1 ml-3 text-sm font-bold text-grey-900`}>
          {name}
        </Text>
        <View style={tw`items-end`}>
          <Text style={tw`text-sm font-bold ${amountColor}`}>
            {formatAmount(amount)}
          </Text>
          <Text style={tw`text-xs text-grey-500 mt-1`}>{date}</Text>
        </View>
      </View>
      {showDivider && <Divider spacing="sm" />}
    </>
  )
}

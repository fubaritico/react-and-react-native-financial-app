import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { Avatar } from '../Avatar/Avatar.native'

import { formatAmount } from './TransactionRow.constants'
import styles from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

/** Native implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: ITransactionRowProps) => {
  const amountColor =
    amount >= 0 ? 'text-transaction-positive' : 'text-transaction-negative'

  return (
    <View style={tw`${styles.root}`}>
      <Avatar src={avatar} name={name} size={40} />
      <Text style={tw`${styles.name}`}>{name}</Text>
      <View style={tw`items-end`}>
        <Text style={tw`${styles.amountText} ${amountColor}`}>
          {formatAmount(amount)}
        </Text>
        <Text style={tw`${styles.date}`}>{date}</Text>
      </View>
    </View>
  )
}

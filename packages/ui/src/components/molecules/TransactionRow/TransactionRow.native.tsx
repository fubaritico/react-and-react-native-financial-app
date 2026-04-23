import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Avatar } from '../../atoms/Avatar/Avatar.native'
import { Typography } from '../../atoms/Typography/Typography.native'

import { formatAmount } from './TransactionRow.constants'
import styles from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'
import type { TypographyVariants } from '../../atoms/Typography/Typography.variants'

/** Native implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: ITransactionRowProps) => {
  const amountColor: TypographyVariants['color'] =
    amount >= 0 ? 'transaction-positive' : 'transaction-negative'

  return (
    <View style={tw`${styles.root}`}>
      <Avatar src={avatar} name={name} size={40} />
      <Typography
        variant="body-bold"
        style={tw`flex-1 inline-flex items-center`}
      >
        {name}
      </Typography>
      <View style={tw`items-end`}>
        <Typography variant="body-bold" color={amountColor}>
          {formatAmount(amount)}
        </Typography>
        <Typography variant="caption" color="muted" style={tw`mt-1`}>
          {date}
        </Typography>
      </View>
    </View>
  )
}

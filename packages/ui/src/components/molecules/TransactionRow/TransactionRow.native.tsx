import { View } from 'react-native'

import tw from '#Lib/tw'

import type { TypographyVariants } from '#Atoms/Typography/Typography.variants'

import { shared } from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

import { Avatar, Currency, Typography } from '#Atoms'

/** Native implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: Readonly<ITransactionRowProps>) => {
  const amountColor: TypographyVariants['color'] =
    amount >= 0 ? 'transaction-positive' : 'transaction-negative'

  return (
    <View style={tw`${shared.root}`}>
      <Avatar src={avatar} name={name} size={40} />
      <Typography
        variant="body-bold"
        style={tw`flex-1 inline-flex items-center`}
      >
        {name}
      </Typography>
      <View style={tw`items-end`}>
        <Typography variant="body-bold" color={amountColor}>
          <Currency sign="always">{amount}</Currency>
        </Typography>
        <Typography variant="caption" color="muted" style={tw`mt-1`}>
          {date}
        </Typography>
      </View>
    </View>
  )
}

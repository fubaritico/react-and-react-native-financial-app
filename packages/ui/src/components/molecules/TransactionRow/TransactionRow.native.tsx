import { View } from 'react-native'

import tw from '#Lib/tw'

import type { TypographyVariants } from '#Atoms/Typography/Typography.variants'

import { shared } from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

import { Currency, Icon, Typography } from '#Atoms'

/** Native implementation of the TransactionRow component. */
export const TransactionRow = ({
  name,
  amount,
  date,
  categoryIcon,
  categoryColor,
}: Readonly<ITransactionRowProps>) => {
  const amountColor: TypographyVariants['color'] =
    amount >= 0 ? 'transaction-positive' : 'transaction-negative'

  return (
    <View style={tw`${shared.root}`}>
      <View
        style={tw`${shared.iconCircle} bg-${categoryColor}`}
        accessibilityRole="image"
        accessibilityLabel={name}
      >
        <Icon name={categoryIcon} iconSize="sm" color="#FFFFFF" />
      </View>
      <Typography variant="body-bold" style={tw`flex-1 items-center`}>
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

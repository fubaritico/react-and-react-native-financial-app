import {
  SectionLink,
  TransactionRow,
  Typography,
} from '@financial-app/ui/native'
import { View } from 'react-native'

import tw from '../../lib/tw'

import { shared } from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Native implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  title,
  viewAllLabel,
  transactions,
  onViewAll,
}: Readonly<ITransactionsOverviewProps>) => {
  return (
    <View style={tw`${shared.root}`}>
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
      </View>
      <View style={tw`${shared.list}`}>
        {transactions.map((item, index) => (
          <TransactionRow
            key={`${item.name}-${String(index)}`}
            avatar={item.avatar}
            name={item.name}
            amount={item.amount}
            date={item.date}
          />
        ))}
      </View>
    </View>
  )
}

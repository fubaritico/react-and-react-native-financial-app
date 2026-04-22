import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { SectionLink } from '../SectionLink/SectionLink.native'
import { TransactionRow } from '../TransactionRow/TransactionRow.native'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Native implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  transactions,
  onViewAll,
}: ITransactionsOverviewProps) => (
  <View style={tw`bg-white rounded-xl p-5`}>
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <Text
        style={tw`text-base font-bold text-grey-900`}
        accessibilityRole="header"
      >
        Transactions
      </Text>
      <SectionLink label="View All" onPress={onViewAll} />
    </View>
    <View>
      {transactions.map((item, index) => (
        <TransactionRow
          key={`${item.name}-${String(index)}`}
          avatar={item.avatar}
          name={item.name}
          amount={item.amount}
          date={item.date}
          showDivider={index < transactions.length - 1}
        />
      ))}
    </View>
  </View>
)

import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { SectionLink } from '../SectionLink'
import { TransactionRow } from '../TransactionRow'

import styles from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Native implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  transactions,
  onViewAll,
}: ITransactionsOverviewProps) => (
  <View style={tw`${styles.root}`}>
    <View style={tw`${styles.header}`}>
      <Text style={tw`${styles.title}`} accessibilityRole="header">
        Transactions
      </Text>
      <SectionLink label="View All" onPress={onViewAll} />
    </View>
    <View style={tw`${styles.list}`}>
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

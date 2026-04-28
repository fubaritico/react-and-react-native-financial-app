import { View } from 'react-native'

import tw from '#Lib/tw'

import styles from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

import { Typography } from '#Atoms'
import { SectionLink, TransactionRow } from '#Molecules'

/** Native implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  title,
  viewAllLabel,
  transactions,
  onViewAll,
}: Readonly<ITransactionsOverviewProps>) => {
  return (
    <View style={tw`${styles.root}`}>
      <View style={tw`${styles.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
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
}

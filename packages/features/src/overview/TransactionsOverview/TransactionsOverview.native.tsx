import {
  Card,
  Icon,
  SectionLink,
  TransactionRow,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { shared } from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/**
 * Native implementation of the TransactionsOverview section component.
 * @param props - Transactions overview data and callbacks
 * @returns The transactions overview card
 */
export const TransactionsOverview = ({
  title,
  viewAllLabel,
  transactions,
  onViewAll,
}: Readonly<ITransactionsOverviewProps>) => {
  const { t } = useTranslation()

  return (
    <Card shadow>
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
      </View>
      {transactions.length > 0 ? (
        <View style={tw`${shared.list}`}>
          {transactions.map((item, index) => (
            <TransactionRow
              key={`${item.name}-${String(index)}`}
              name={item.name}
              amount={item.amount}
              date={item.date}
              categoryIcon={item.categoryIcon}
              categoryColor={item.categoryColor}
            />
          ))}
        </View>
      ) : (
        <Pressable
          onPress={onViewAll}
          accessibilityRole="button"
          accessibilityLabel={viewAllLabel}
        >
          <View style={tw`${shared.noData}`}>
            <Icon name="navTransactions" iconSize="5xl" color="muted" />
            <Typography variant="body" color="muted" align="center">
              {t('transactionsOverview.empty')}
            </Typography>
          </View>
        </Pressable>
      )}
    </Card>
  )
}

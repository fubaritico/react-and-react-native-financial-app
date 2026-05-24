import {
  Card,
  Icon,
  SectionLink,
  TransactionRow,
  Typography,
} from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import { shared, web } from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/**
 * Web implementation of the TransactionsOverview section component.
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
    <Card>
      <div className={shared.header}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
      </div>
      {transactions.length > 0 ? (
        <div className={shared.list}>
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
        </div>
      ) : (
        <button className={web.noDataButton} onClick={onViewAll}>
          <div className={shared.noData}>
            <div className="text-foreground-muted">
              <Icon name="navTransactions" iconSize="5xl" />
            </div>
            <Typography variant="body" color="muted">
              {t('transactionsOverview.empty')}
            </Typography>
          </div>
        </button>
      )}
    </Card>
  )
}

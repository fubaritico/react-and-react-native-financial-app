import {
  Card,
  SectionLink,
  TransactionRow,
  Typography,
} from '@financial-app/ui'

import { shared } from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Web implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  title,
  viewAllLabel,
  transactions,
  onViewAll,
}: Readonly<ITransactionsOverviewProps>) => {
  return (
    <Card>
      <div className={shared.header}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
      </div>
      <div className={shared.list}>
        {transactions.map((item, index) => (
          <TransactionRow
            key={`${item.name}-${String(index)}`}
            avatar={item.avatar}
            name={item.name}
            amount={item.amount}
            date={item.date}
          />
        ))}
      </div>
    </Card>
  )
}

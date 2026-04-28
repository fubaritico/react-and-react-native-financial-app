import { Typography } from '#Atoms/index.web'
import { SectionLink, TransactionRow } from '#Molecules/index.web'

import styles from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Web implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  title,
  viewAllLabel,
  transactions,
  onViewAll,
}: Readonly<ITransactionsOverviewProps>) => {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={viewAllLabel} onPress={onViewAll} />
      </div>
      <div className={styles.list}>
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
    </section>
  )
}

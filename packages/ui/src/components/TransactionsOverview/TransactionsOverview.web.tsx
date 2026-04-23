import { SectionLink } from '../SectionLink/SectionLink.web'
import { TransactionRow } from '../TransactionRow/TransactionRow.web'

import styles from './TransactionsOverview.styles'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Web implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  transactions,
  onViewAll,
}: ITransactionsOverviewProps) => (
  <section className={styles.root}>
    <div className={styles.header}>
      <h3 className={styles.title}>Transactions</h3>
      <SectionLink label="View All" onPress={onViewAll} />
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

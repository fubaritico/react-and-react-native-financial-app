import { SectionLink } from '../SectionLink/SectionLink.web'
import { TransactionRow } from '../TransactionRow/TransactionRow.web'

import type { ITransactionsOverviewProps } from './TransactionsOverview'

/** Web implementation of the TransactionsOverview section component. */
export const TransactionsOverview = ({
  transactions,
  onViewAll,
}: ITransactionsOverviewProps) => (
  <section>
    <div className="flex justify-between items-center">
      <h3 className="text-base font-bold text-grey-900">Transactions</h3>
      <SectionLink label="View All" onPress={onViewAll} />
    </div>
    <div className="bg-white rounded-xl p-5 mt-3">
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
    </div>
  </section>
)

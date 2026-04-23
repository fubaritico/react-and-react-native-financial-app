import { cn } from '../../lib/cn'
import { Avatar } from '../Avatar/Avatar.web'

import { formatAmount } from './TransactionRow.constants'
import styles from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

/** Web implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: ITransactionRowProps) => {
  const amountColor =
    amount >= 0 ? 'text-transaction-positive' : 'text-transaction-negative'

  return (
    <div className={styles.root}>
      <Avatar src={avatar} name={name} size={40} />
      <span className={styles.name}>{name}</span>
      <div className="text-right">
        <p className={cn(styles.amountText, amountColor)}>
          {formatAmount(amount)}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  )
}

import { cn } from '../../lib/cn'
import { Avatar } from '../Avatar/Avatar.web'
import { Divider } from '../Divider/Divider.web'

import { formatAmount } from './TransactionRow.constants'
import styles from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

/** Web implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
  showDivider = true,
}: ITransactionRowProps) => {
  const amountColor = amount >= 0 ? 'text-green' : 'text-grey-900'

  return (
    <>
      <div className="flex items-center py-3">
        <Avatar src={avatar} name={name} size={40} />
        <span className={styles.name}>{name}</span>
        <div className="text-right">
          <p className={cn(styles.amountText, amountColor)}>
            {formatAmount(amount)}
          </p>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
      {showDivider && <Divider spacing="sm" />}
    </>
  )
}

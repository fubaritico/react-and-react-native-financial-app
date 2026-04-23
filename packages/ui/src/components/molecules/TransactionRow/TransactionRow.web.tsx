import { Avatar } from '../../atoms/Avatar/Avatar.web'
import { Typography } from '../../atoms/Typography/Typography.web'

import { formatAmount } from './TransactionRow.constants'
import styles from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'
import type { TypographyVariants } from '../../atoms/Typography/Typography.variants'

/** Web implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: ITransactionRowProps) => {
  const amountColor: TypographyVariants['color'] =
    amount >= 0 ? 'transaction-positive' : 'transaction-negative'

  return (
    <div className={styles.root}>
      <Avatar src={avatar} name={name} size={40} />
      <Typography
        variant="body-bold"
        as="span"
        className="flex-1 inline-flex items-center"
      >
        {name}
      </Typography>
      <div className="text-right">
        <Typography variant="body-bold" color={amountColor} as="p">
          {formatAmount(amount)}
        </Typography>
        <Typography variant="caption" color="muted" as="p" className="mt-1">
          {date}
        </Typography>
      </div>
    </div>
  )
}

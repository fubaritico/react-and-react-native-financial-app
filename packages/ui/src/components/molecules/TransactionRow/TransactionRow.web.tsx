import { Avatar, Currency, Typography } from '#Atoms/index.web'
import type { TypographyVariants } from '#Atoms/Typography/Typography.variants'

import { shared } from './TransactionRow.styles'

import type { ITransactionRowProps } from './TransactionRow'

/** Web implementation of the TransactionRow component. */
export const TransactionRow = ({
  avatar,
  name,
  amount,
  date,
}: Readonly<ITransactionRowProps>) => {
  const amountColor: TypographyVariants['color'] =
    amount >= 0 ? 'transaction-positive' : 'transaction-negative'

  return (
    <div className={shared.root}>
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
          <Currency sign="always">{amount}</Currency>
        </Typography>
        <Typography variant="caption" color="muted" as="p" className="mt-1">
          {date}
        </Typography>
      </div>
    </div>
  )
}

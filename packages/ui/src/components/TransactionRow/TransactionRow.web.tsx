import { cn } from '../../lib/cn'
import { Avatar } from '../Avatar/Avatar.web'
import { Divider } from '../Divider/Divider.web'

import type { ITransactionRowProps } from './TransactionRow'

/** Formats a number as a signed currency string. */
const formatAmount = (amount: number): string => {
  const prefix = amount >= 0 ? '+' : '-'
  return `${prefix}$${Math.abs(amount).toFixed(2)}`
}

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
        <span className="flex-1 ml-3 text-sm font-bold text-grey-900">
          {name}
        </span>
        <div className="text-right">
          <p className={cn('text-sm font-bold', amountColor)}>
            {formatAmount(amount)}
          </p>
          <p className="text-xs text-grey-500 mt-1">{date}</p>
        </div>
      </div>
      {showDivider && <Divider spacing="sm" />}
    </>
  )
}

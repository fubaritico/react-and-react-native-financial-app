import { Avatar, Typography, tw } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { ITransaction } from '@financial-app/shared'

import type { Row } from '@tanstack/react-table'

/** Props for the CompactTransactionRow sub-component. */
interface ICompactTransactionRowProps {
  /** TanStack Table row. */
  readonly row: Row<ITransaction>
  /** BCP 47 locale tag for date/currency formatting. */
  readonly locale?: string
}

/** Compact row renderer — matches Figma mobile layout. */
export function CompactTransactionRow({
  row,
  locale = 'en-US',
}: ICompactTransactionRowProps) {
  const { name, avatar, category, date, amount } = row.original
  const isPositive = amount >= 0
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
  const signedAmount = isPositive ? `+${formatted}` : `-${formatted}`
  const displayDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

  return (
    <View style={tw`flex-row items-center gap-3 py-3 px-4`}>
      <Avatar src={avatar} name={name} size={40} />
      <View style={tw`flex-1 min-w-0`}>
        <Typography variant="body-bold">{name}</Typography>
        <Typography variant="caption" color="muted">
          {category}
        </Typography>
      </View>
      <View style={tw`items-end shrink-0`}>
        <Typography
          variant="body-bold"
          color={isPositive ? 'transaction-positive' : 'foreground'}
        >
          {signedAmount}
        </Typography>
        <Typography variant="caption" color="muted">
          {displayDate}
        </Typography>
      </View>
    </View>
  )
}

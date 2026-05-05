import { Icon, Status, Typography, tw } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { IRecurringBill } from '@financial-app/shared'

import type { Row } from '@tanstack/react-table'

/** Props for the CompactBillRow sub-component. */
interface ICompactBillRowProps {
  /** TanStack Table row. */
  readonly row: Row<IRecurringBill>
  /** BCP 47 locale tag for currency formatting. */
  readonly locale?: string
}

/** Compact row renderer for recurring bills — matches Figma mobile layout. */
export function CompactBillRow({
  row,
  locale = 'en-US',
}: ICompactBillRowProps) {
  const { name, amount, date, status, categoryIcon, categoryColor } =
    row.original

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
  const signedAmount = amount >= 0 ? `+${formatted}` : `-${formatted}`

  return (
    <View style={tw`flex-row items-center gap-3 py-3 px-4`}>
      {/* Category icon circle */}
      <View
        style={[
          tw`items-center justify-center rounded-full`,
          { width: 40, height: 40, backgroundColor: categoryColor },
        ]}
      >
        <Icon name={categoryIcon} color="white" iconSize="sm" />
      </View>

      {/* Name + Status */}
      <View style={tw`flex-1 min-w-0`}>
        <Typography variant="body-bold" numberOfLines={1}>
          {name}
        </Typography>
        <Status date={date} status={status} />
      </View>

      {/* Amount */}
      <View style={tw`items-end shrink-0`}>
        <Typography variant="body-bold">{signedAmount}</Typography>
      </View>
    </View>
  )
}

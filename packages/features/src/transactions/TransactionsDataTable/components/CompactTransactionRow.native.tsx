import {
  Avatar,
  Dropdown,
  Icon,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import type { ITransaction } from '@financial-app/shared'
import type { IDropdownOption } from '@financial-app/ui/native'

import type { Row } from '@tanstack/react-table'

/** Props for the CompactTransactionRow sub-component. */
interface ICompactTransactionRowProps {
  /** TanStack Table row. */
  readonly row: Row<ITransaction>
  /** BCP 47 locale tag for date/currency formatting. */
  readonly locale?: string
  /** Called when the user selects "Edit" from the action menu. */
  readonly onEdit?: (transaction: ITransaction) => void
  /** Called when the user selects "Delete" from the action menu. */
  readonly onDelete?: (transaction: ITransaction) => void
  /** Label for the edit option. */
  readonly editLabel: string
  /** Label for the delete option. */
  readonly deleteLabel: string
}

/** Compact row renderer — matches Figma mobile layout. */
export function CompactTransactionRow({
  row,
  locale = 'en-US',
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
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

  const hasActions = !!onEdit || !!onDelete

  const options: IDropdownOption[] = useMemo(
    () => [
      { value: 'edit', label: editLabel },
      {
        value: 'delete',
        label: deleteLabel,
        destructive: true,
        dividerBefore: true,
      },
    ],
    [editLabel, deleteLabel]
  )

  const handleSelect = useCallback(
    (value: string) => {
      if (value === 'edit') onEdit?.(row.original)
      if (value === 'delete') onDelete?.(row.original)
    },
    [row.original, onEdit, onDelete]
  )

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
      {hasActions && (
        <Dropdown
          options={options}
          selectedValue=""
          onSelect={handleSelect}
          trigger={() => <Icon name="verticalEllipsis" iconSize="sm" />}
          buttonVariant="tertiary"
          buttonSize="sm"
          buttonClassName="p-0"
          buttonCentered
          buttonFullWidth={false}
          accessibilityLabel="Actions"
        />
      )}
    </View>
  )
}

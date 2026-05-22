import { useCurrency } from '@financial-app/shared'
import {
  Card,
  ColorDot,
  Dropdown,
  Icon,
  LatestSpending,
  ProgressBar,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import type { IDropdownOption } from '@financial-app/ui'

import { DELETE_ACTION, EDIT_ACTION } from './BudgetCategoryCard.constants'
import { native, shared } from './BudgetCategoryCard.styles'

import type { IBudgetCategoryCardProps } from './BudgetCategoryCard'

/** No-op fallback for optional callbacks */
const noop = () => {
  /* intentional no-op */
}

/** Native implementation of the BudgetCategoryCard component. */
export function BudgetCategoryCard({
  category,
  maximum,
  spent,
  color,
  items,
  maximumOfLabel,
  spentLabel,
  remainingLabel,
  latestSpendingTitle,
  seeAllLabel,
  editLabel,
  deleteLabel,
  onSeeAll,
  onEdit,
  onDelete,
}: Readonly<IBudgetCategoryCardProps>) {
  const remaining = Math.max(0, maximum - spent)

  const { format } = useCurrency()

  const formattedMaximum = format(maximum)
  const formattedSpent = format(spent)
  const formattedRemaining = format(remaining)

  const menuOptions: IDropdownOption[] = useMemo(
    () => [
      { value: EDIT_ACTION, label: editLabel },
      {
        value: DELETE_ACTION,
        label: deleteLabel,
        dividerBefore: true,
        destructive: true,
      },
    ],
    [editLabel, deleteLabel]
  )

  const handleMenuSelect = useCallback(
    (value: string) => {
      if (value === EDIT_ACTION) onEdit?.()
      else if (value === DELETE_ACTION) onDelete?.()
    },
    [onEdit, onDelete]
  )

  const metaLeft = (
    <View style={tw`${shared.metaColumn} border-l-${color}`}>
      <Typography variant="caption" color="muted">
        {spentLabel}
      </Typography>
      <Typography variant="body-bold">{formattedSpent}</Typography>
    </View>
  )

  const metaRight = (
    <View style={tw`${native.metaColumnRemaining}`}>
      <Typography variant="caption" color="muted">
        {remainingLabel}
      </Typography>
      <Typography variant="body-bold">{formattedRemaining}</Typography>
    </View>
  )

  return (
    <Card>
      <View style={tw`${shared.header}`}>
        <ColorDot color={color} size={16} />
        <Typography
          variant="heading-lg"
          style={tw`${shared.title}`}
          accessibilityRole="header"
        >
          {category}
        </Typography>
        <Dropdown
          options={menuOptions}
          selectedValue=""
          onSelect={handleMenuSelect}
          accessibilityLabel={`${category} actions`}
          bottomSheetTitle={category}
          buttonVariant="tertiary"
          buttonSize="md"
          buttonClassName="text-grey-300 size-10 -mr-2"
          buttonCentered
          trigger={() => (
            <Icon
              name="ellipsis"
              iconSize="sm"
              color={tw.color('grey-300') ?? '#696868'}
            />
          )}
        />
      </View>

      <Typography
        variant="caption"
        color="muted"
        style={tw`${shared.subtitle}`}
      >
        {`${maximumOfLabel} ${formattedMaximum}`}
      </Typography>

      <ProgressBar
        value={spent}
        max={maximum}
        color={color}
        size="thick"
        metaLeft={metaLeft}
        metaRight={metaRight}
      />

      {items.length > 0 && (
        <View style={tw`${shared.latestWrapper}`}>
          <LatestSpending
            title={latestSpendingTitle}
            seeAllLabel={seeAllLabel}
            onSeeAll={onSeeAll ?? noop}
            items={items}
          />
        </View>
      )}
    </Card>
  )
}

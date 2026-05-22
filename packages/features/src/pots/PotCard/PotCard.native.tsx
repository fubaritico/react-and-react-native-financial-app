import { useCurrency } from '@financial-app/shared'
import {
  Button,
  Card,
  ColorDot,
  Dropdown,
  Icon,
  ProgressBar,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import type { IDropdownOption } from '@financial-app/ui'

import { DELETE_ACTION, EDIT_ACTION } from './PotCard.constants'
import { shared } from './PotCard.styles'

import type { IPotCardProps } from './PotCard'

/** No-op fallback for optional callbacks */
const noop = () => {
  /* intentional no-op */
}

/** Native implementation of the PotCard component. */
export function PotCard({
  name,
  total,
  target,
  color,
  totalSavedLabel,
  targetOfLabel,
  addMoneyLabel,
  withdrawLabel,
  editLabel,
  deleteLabel,
  onAddMoney,
  onWithdraw,
  onEdit,
  onDelete,
}: Readonly<IPotCardProps>) {
  /** Progress percentage clamped to 0 when target is 0 */
  const percentage = target > 0 ? (total / target) * 100 : 0
  /** Percentage with 1 decimal (e.g. "7.9%") */
  const formattedPercentage = `${percentage.toFixed(1)}%`
  const { format } = useCurrency()
  /** Total saved formatted as currency (e.g. "$159.00") */
  const formattedTotal = format(total)
  /** Target amount formatted as currency (e.g. "$2,000") */
  const formattedTarget = format(target)

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
    <Typography variant="caption" color="muted">
      {formattedPercentage}
    </Typography>
  )

  const metaRight = (
    <Typography variant="caption" color="muted">
      {`${targetOfLabel} ${formattedTarget}`}
    </Typography>
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
          {name}
        </Typography>
        <Dropdown
          options={menuOptions}
          selectedValue=""
          onSelect={handleMenuSelect}
          accessibilityLabel={`${name} actions`}
          bottomSheetTitle={name}
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

      <View style={tw`${shared.totalRow}`}>
        <Typography variant="caption" color="muted">
          {totalSavedLabel}
        </Typography>
        <Typography variant="page-title">{formattedTotal}</Typography>
      </View>

      <View style={tw`${shared.progressWrapper}`}>
        <ProgressBar
          value={total}
          max={target}
          color={color}
          size="thin"
          metaLeft={metaLeft}
          metaRight={metaRight}
        />
      </View>

      <View style={tw`${shared.buttonsRow}`}>
        <Button
          title={addMoneyLabel}
          onPress={onAddMoney ?? noop}
          variant="secondary"
          size="lg"
          className={shared.button}
          centered
        />
        <Button
          title={withdrawLabel}
          onPress={onWithdraw ?? noop}
          variant="secondary"
          size="lg"
          className={shared.button}
          centered
        />
      </View>
    </Card>
  )
}

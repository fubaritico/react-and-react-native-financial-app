import { useCurrency } from '@financial-app/shared'
import {
  Button,
  Card,
  ColorDot,
  Dropdown,
  Icon,
  ProgressBar,
  Typography,
} from '@financial-app/ui'
import { useCallback, useMemo } from 'react'

import type { IDropdownOption } from '@financial-app/ui'

import { DELETE_ACTION, EDIT_ACTION } from './PotCard.constants'
import { shared } from './PotCard.styles'

import type { IPotCardProps } from './PotCard'

/** No-op fallback for optional callbacks */
const noop = () => {
  /* intentional no-op */
}

/** Web implementation of the PotCard component. */
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
    <Typography variant="caption" color="muted" as="p">
      {formattedPercentage}
    </Typography>
  )

  const metaRight = (
    <Typography variant="caption" color="muted" as="p">
      {`${targetOfLabel} ${formattedTarget}`}
    </Typography>
  )

  return (
    <Card>
      <div className={shared.header}>
        <ColorDot color={color} size={16} />
        <Typography variant="heading-lg" as="h3" className={shared.title}>
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
          buttonClassName="p-0 text-grey-300"
          buttonCentered
          position="right"
          trigger={() => (
            <Icon name="ellipsis" iconSize="sm" color="currentColor" />
          )}
        />
      </div>

      <div className={shared.totalRow}>
        <Typography variant="caption" color="muted" as="p">
          {totalSavedLabel}
        </Typography>
        <Typography variant="page-title" as="p">
          {formattedTotal}
        </Typography>
      </div>

      <div className={shared.progressWrapper}>
        <ProgressBar
          value={total}
          max={target}
          color={color}
          size="thin"
          metaLeft={metaLeft}
          metaRight={metaRight}
        />
      </div>

      <div className={shared.buttonsRow}>
        <Button
          title={addMoneyLabel}
          onPress={onAddMoney ?? noop}
          variant="secondary"
          className={shared.button}
          centered
        />
        <Button
          title={withdrawLabel}
          onPress={onWithdraw ?? noop}
          variant="secondary"
          className={shared.button}
          centered
        />
      </div>
    </Card>
  )
}

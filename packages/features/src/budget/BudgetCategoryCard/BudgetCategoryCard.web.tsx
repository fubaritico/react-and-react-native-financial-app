import { formatCurrency } from '@financial-app/shared'
import {
  Card,
  ColorDot,
  Dropdown,
  Icon,
  LatestSpending,
  ProgressBar,
  Typography,
  cn,
} from '@financial-app/ui'
import { useCallback, useMemo } from 'react'

import type { IDropdownOption } from '@financial-app/ui'

import { DELETE_ACTION, EDIT_ACTION } from './BudgetCategoryCard.constants'
import { shared, web } from './BudgetCategoryCard.styles'

import type { IBudgetCategoryCardProps } from './BudgetCategoryCard'
import type { CSSProperties } from 'react'

/** No-op fallback for optional callbacks */
const noop = () => {
  /* intentional no-op */
}

/** Web implementation of the BudgetCategoryCard component. */
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
  locale = 'en-US',
  currency = 'USD',
}: Readonly<IBudgetCategoryCardProps>) {
  const remaining = Math.max(0, maximum - spent)

  const formattedMaximum = formatCurrency(maximum, { locale, currency })
  const formattedSpent = formatCurrency(spent, { locale, currency })
  const formattedRemaining = formatCurrency(remaining, { locale, currency })

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
    <div
      className={shared.metaColumn}
      style={
        {
          '--accent-color': `var(--color-base-${color}-DEFAULT)`,
          borderLeftColor: 'var(--accent-color)',
        } as CSSProperties
      }
    >
      <Typography variant="caption" color="muted" as="p">
        {spentLabel}
      </Typography>
      <Typography variant="body-bold" as="p">
        {formattedSpent}
      </Typography>
    </div>
  )

  const metaRight = (
    <div className={cn(shared.metaColumn, web.metaColumnRemaining)}>
      <Typography variant="caption" color="muted" as="p">
        {remainingLabel}
      </Typography>
      <Typography variant="body-bold" as="p">
        {formattedRemaining}
      </Typography>
    </div>
  )

  return (
    <Card>
      <div className={shared.header}>
        <ColorDot color={color} size={16} />
        <Typography variant="heading-lg" as="h3" className={shared.title}>
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
          buttonClassName="p-0 text-grey-300"
          buttonCentered
          position="right"
          trigger={() => (
            <Icon name="ellipsis" iconSize="sm" color="currentColor" />
          )}
        />
      </div>

      <Typography
        variant="caption"
        color="muted"
        as="p"
        className={shared.subtitle}
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
        <div className={shared.latestWrapper}>
          <LatestSpending
            title={latestSpendingTitle}
            seeAllLabel={seeAllLabel}
            onSeeAll={onSeeAll ?? noop}
            items={items}
          />
        </div>
      )}
    </Card>
  )
}

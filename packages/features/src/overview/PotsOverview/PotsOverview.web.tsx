import {
  Card,
  ColorBarItem,
  Currency,
  Icon,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'

import { shared, web } from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'

/** Web implementation of the PotsOverview section component. */
export const PotsOverview = ({
  title,
  seeDetailsLabel,
  totalSavedLabel,
  savingsIconLabel,
  totalSaved,
  pots,
  onSeeDetails,
  icon,
  locale = 'en-US',
  currency = 'USD',
}: Readonly<IPotsOverviewProps>) => {
  return (
    <Card>
      {/* Header row */}
      <div className={cn('flex', shared.header)}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </div>

      {/* Content: stacked on mobile, side by side on desktop */}
      <div className={web.content}>
        {/* Total Saved box */}
        <div
          className={cn('flex', shared.totalSavedBox, web.totalSavedBoxExtra)}
        >
          {/* Icon area */}
          <div
            className={cn('flex', shared.iconArea, web.iconAreaExtra)}
            aria-label={savingsIconLabel}
          >
            {icon ?? (
              <Icon name="pot" iconSize="5xl" color="var(--color-green)" />
            )}
          </div>

          {/* Total saved text */}
          <div>
            <Typography variant="body" color="muted" as="p">
              {totalSavedLabel}
            </Typography>
            <Currency
              amount={totalSaved}
              locale={locale}
              currency={currency}
              digits={0}
              variant="display-lg"
            />
          </div>
        </div>

        {/* Pots grid — 2 columns */}
        <div className={web.potsGrid}>
          {pots.map((pot) => (
            <div key={pot.name} className="py-2">
              <ColorBarItem
                label={pot.name}
                amount={pot.total}
                color={pot.color}
                locale={locale}
                currency={currency}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

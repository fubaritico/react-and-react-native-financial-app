import {
  Card,
  ColorBarItem,
  Currency,
  Icon,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import { shared, web } from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'

/**
 * Web implementation of the PotsOverview section component.
 * @param props - Pots overview data and callbacks
 * @returns The pots overview card
 */
export const PotsOverview = ({
  title,
  seeDetailsLabel,
  totalSavedLabel,
  savingsIconLabel,
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: Readonly<IPotsOverviewProps>) => {
  const { t } = useTranslation()

  return (
    <Card shadow>
      {/* Header row */}
      <div className={cn('flex', shared.header)}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </div>

      {/* Content: stacked on mobile, side by side on desktop */}
      {pots.length ? (
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
              {icon ?? <Icon name="pot" iconSize="5xl" color="green" />}
            </div>

            {/* Total saved text */}
            <div>
              <Typography variant="body" color="muted" as="p">
                {totalSavedLabel}
              </Typography>
              <Typography variant="display-lg" as="p">
                <Currency>{totalSaved}</Currency>
              </Typography>
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
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className={shared.noDataButton}
          onClick={onSeeDetails}
          aria-label={seeDetailsLabel}
        >
          <div className={shared.noData}>
            <div className="text-foreground-muted">
              <Icon name="navPots" iconSize="5xl" />
            </div>
            <Typography variant="body" color="muted">
              {t('potsOverview.empty')}
            </Typography>
          </div>
        </button>
      )}
    </Card>
  )
}

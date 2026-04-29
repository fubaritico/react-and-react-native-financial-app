import { Icon, SectionLink, Typography } from '@financial-app/ui'

import { cn } from '../../lib/cn'

import { shared, web } from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'
import type { CSSProperties } from 'react'

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
}: Readonly<IPotsOverviewProps>) => {
  return (
    <section className={shared.root}>
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
            <Typography variant="display-lg" as="p">
              {totalSaved}
            </Typography>
          </div>
        </div>

        {/* Pots grid — 2 columns */}
        <div className={web.potsGrid}>
          {pots.map((pot) => (
            <div key={pot.name} className="py-2">
              <div
                className={cn(
                  shared.potItem,
                  'border-l-4 border-l-[var(--border-color)]'
                )}
                style={
                  {
                    '--border-color': `var(--color-base-${pot.color}-DEFAULT)`,
                  } as CSSProperties
                }
              >
                <Typography variant="caption" color="muted" as="p">
                  {pot.name}
                </Typography>
                <Typography variant="body-bold" as="p">
                  {pot.total}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

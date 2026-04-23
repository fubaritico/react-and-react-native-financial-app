import { cn } from '../../lib/cn'
import { Icon } from '../Icon/Icon.web'
import { SectionLink } from '../SectionLink/SectionLink.web'

import styles from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'
import type { CSSProperties } from 'react'

/** Web implementation of the PotsOverview section component. */
export const PotsOverview = ({
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: IPotsOverviewProps) => (
  <section className={styles.root}>
    {/* Header row */}
    <div className={cn('flex', styles.header)}>
      <h3 className={styles.title}>Pots</h3>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </div>

    {/* Content: stacked on mobile, side by side on desktop */}
    <div className="flex flex-col md:flex-row md:gap-5">
      {/* Total Saved box */}
      <div className={cn('flex', styles.totalSavedBox, 'md:flex-1')}>
        {/* Icon area */}
        <div className={cn('flex', styles.iconArea, 'shrink-0')}>
          {icon ?? (
            <Icon name="pot" iconSize="5xl" color="var(--color-green)" />
          )}
        </div>

        {/* Total saved text */}
        <div>
          <p className={styles.totalLabel}>Total Saved</p>
          <p className={styles.totalAmount}>{totalSaved}</p>
        </div>
      </div>

      {/* Pots grid — 2 columns */}
      <div className="grid grid-cols-2 gap-x-4 mt-4 md:mt-0 md:flex-1">
        {pots.map((pot) => (
          <div key={pot.name} className="py-2">
            <div
              className={cn(
                styles.potItem,
                'border-l-4 border-l-[var(--border-color)]'
              )}
              style={
                {
                  '--border-color': `var(--color-base-${pot.color}-DEFAULT)`,
                } as CSSProperties
              }
            >
              <p className={styles.potName}>{pot.name}</p>
              <p className={styles.potTotal}>{pot.total}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

import { cn } from '#Lib/cn'

import { Currency, Divider, Icon, Typography } from '#Atoms/index.web'
import { SectionLink } from '#Molecules/SectionLink/index.web'

import { shared } from './LatestSpending.styles'

import type { ILatestSpendingProps } from './LatestSpending'

/** Web implementation of the LatestSpending component. */
export function LatestSpending({
  title,
  seeAllLabel,
  onSeeAll,
  items,
}: Readonly<ILatestSpendingProps>) {
  return (
    <div className={shared.wrapper}>
      <div className={shared.header}>
        <Typography variant="heading-md" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeAllLabel} onPress={onSeeAll} />
      </div>
      {items.map((item, index) => (
        <div key={`${item.name}-${item.date}-${String(index)}`}>
          {index > 0 && <Divider className="bg-grey-500/10" />}
          <div className={shared.itemRow}>
            <div
              className={cn(shared.iconCircle, `bg-${item.categoryColor}`)}
              role="img"
              aria-label={item.name}
            >
              <Icon name={item.categoryIcon} iconSize="xs" color="on-dark" />
            </div>
            <Typography variant="body-bold" as="span" className={shared.name}>
              {item.name}
            </Typography>
            <div className={shared.itemRight}>
              <Typography variant="body-bold" as="p">
                <Currency sign="auto">{item.amount}</Currency>
              </Typography>
              <Typography
                variant="caption"
                color="muted"
                as="p"
                className={shared.dateSpacing}
              >
                {item.date}
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Avatar, Divider, Typography } from '#Atoms/index.web'
import { SectionLink } from '#Molecules/SectionLink/index.web'

import { shared } from './LatestSpending.styles'

import type { ILatestSpendingProps } from './LatestSpending'

/** Web implementation of the LatestSpending component. */
export function LatestSpending({
  title,
  seeAllLabel,
  onSeeAll,
  items,
  showAvatars = true,
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
        <div key={`${item.name}-${item.date}`}>
          {index > 0 && <Divider className="bg-grey-500/10" />}
          <div className={shared.itemRow}>
            {showAvatars && (
              <Avatar src={item.avatar} name={item.name} size={32} />
            )}
            <Typography variant="body-bold" as="span" className={shared.name}>
              {item.name}
            </Typography>
            <div className={shared.itemRight}>
              <Typography variant="body-bold" as="p">
                {item.amount}
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

import { cn } from '#Lib/cn'
import { WEB_SHADOW } from '#Lib/shadow'

import { Typography } from '#Atoms/index.web'

import { shared, web } from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({
  title,
  text,
  children,
  shadow,
}: Readonly<ICardProps>) => (
  <div
    className={cn(cardVariants(), web.root, {
      [WEB_SHADOW]: shadow,
    })}
  >
    {title && (
      <Typography
        variant="subsection-title"
        as="h3"
        className={shared.titleSpacing}
      >
        {title}
      </Typography>
    )}
    {text && (
      <Typography variant="body" color="muted">
        {text}
      </Typography>
    )}
    {children && <div className={shared.childrenWrap}>{children}</div>}
  </div>
)

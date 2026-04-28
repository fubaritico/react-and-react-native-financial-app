import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import styles from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({ title, text, children }: Readonly<ICardProps>) => (
  <div className={cn(cardVariants())}>
    <Typography variant="subsection-title" as="h3" className="mb-2">
      {title}
    </Typography>
    {text && (
      <Typography variant="body" color="muted">
        {text}
      </Typography>
    )}
    {children && <div className={styles.childrenWrap}>{children}</div>}
  </div>
)

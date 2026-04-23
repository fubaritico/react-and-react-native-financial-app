import { cn } from '../../../lib/cn'
import { Typography } from '../../atoms/Typography/Typography.web'

import styles from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({ title, text, children }: ICardProps) => (
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

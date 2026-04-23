import { cn } from '../../lib/cn'

import styles from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({ title, text, children }: ICardProps) => (
  <div className={cn(cardVariants())}>
    <h3 className={styles.title}>{title}</h3>
    {text && <p className={styles.text}>{text}</p>}
    {children && <div className={styles.childrenWrap}>{children}</div>}
  </div>
)

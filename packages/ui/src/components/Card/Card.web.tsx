import { cn } from '../../lib/cn'
import { cardVariants } from '../../variants'

import styles from './Card.styles'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({ title, text, children }: ICardProps) => (
  <div className={cn(cardVariants(), 'shadow-md')}>
    <h3 className={styles.title}>{title}</h3>
    {text && <p className={styles.text}>{text}</p>}
    {children && <div className={styles.childrenWrap}>{children}</div>}
  </div>
)

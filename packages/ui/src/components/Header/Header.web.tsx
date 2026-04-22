import { cn } from '../../lib/cn'
import { headerVariants } from '../../variants'

import styles from './Header.styles'

import type { IHeaderProps } from './Header'

/** Web implementation of the Header component. */
export const Header = ({ title, subtitle }: IHeaderProps) => (
  <header className={cn(headerVariants())}>
    <h1 className={styles.title}>{title}</h1>
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </header>
)

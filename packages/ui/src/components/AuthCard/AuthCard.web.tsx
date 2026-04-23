import { cn } from '../../lib/cn'

import styles from './AuthCard.styles'

import type { IAuthCardProps } from './AuthCard'

/** Web implementation of the AuthCard component. */
export const AuthCard = ({ title, children, footer }: IAuthCardProps) => (
  <div className="bg-card rounded-lg px-8 py-8 flex flex-col gap-8 w-full max-w-md shadow-lg">
    <h1 className={styles.title}>{title}</h1>
    <div className={cn('flex flex-col', styles.childrenWrap)}>{children}</div>
    {footer ? <div>{footer}</div> : null}
  </div>
)

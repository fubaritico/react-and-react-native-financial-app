import { cn } from '../../lib/cn'
import { cardVariants } from '../../variants'

import type { ICardProps } from './Card'

/** Web implementation of the Card component. */
export const Card = ({ title, text, children }: ICardProps) => (
  <div className={cn(cardVariants(), 'shadow-md')}>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    {text && <p className="text-sm text-foreground-muted leading-5">{text}</p>}
    {children && <div className="mt-3">{children}</div>}
  </div>
)

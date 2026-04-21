import { cn } from '../../lib/cn'
import { coloredBorderItemVariants } from '../../variants'

import type { IStatCardProps } from './StatCard'

/** Web implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <div
    className={cn(coloredBorderItemVariants({ layout: 'stacked' }))}
    style={{ borderLeft: `4px solid var(--color-base-${color}-default)` }}
  >
    <p className="text-xs text-grey-500">{label}</p>
    <p className="text-sm font-bold text-grey-900">{amount}</p>
  </div>
)

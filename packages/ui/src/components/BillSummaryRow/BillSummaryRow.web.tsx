import { cn } from '../../lib/cn'
import { coloredBorderItemVariants } from '../../variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Web implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <div
    className={cn(coloredBorderItemVariants({ layout: 'row' }), 'bg-beige-100')}
    style={{ borderLeft: `4px solid var(--color-base-${color}-default)` }}
  >
    <span className="text-xs text-grey-500">{label}</span>
    <span className="text-sm font-bold text-grey-900">{amount}</span>
  </div>
)

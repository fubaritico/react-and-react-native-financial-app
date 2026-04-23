import { cn } from '../../lib/cn'
import { Typography } from '../Typography/Typography.web'

import { billSummaryRowVariants } from './BillSummaryRow.variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'
import type { CSSProperties } from 'react'

/** Web implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <div
    className={cn(
      billSummaryRowVariants(),
      'flex border-l-[var(--border-color)]'
    )}
    style={
      {
        '--border-color': `var(--color-base-${color}-DEFAULT)`,
      } as CSSProperties
    }
  >
    <Typography variant="caption" color="muted" as="span">
      {label}
    </Typography>
    <Typography variant="body-bold" as="span">
      {amount}
    </Typography>
  </div>
)

import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'
import type { CSSProperties } from 'react'

/** Web implementation of the StatCard component. */
export const StatCard = ({
  label,
  amount,
  color,
}: Readonly<IStatCardProps>) => (
  <div
    className={cn(statCardVariants(), 'border-l-[var(--border-color)]')}
    style={
      {
        '--border-color': `var(--color-base-${color}-DEFAULT)`,
      } as CSSProperties
    }
  >
    <Typography variant="caption" color="muted" as="p">
      {label}
    </Typography>
    <Typography variant="body-bold" as="p">
      {amount}
    </Typography>
  </div>
)

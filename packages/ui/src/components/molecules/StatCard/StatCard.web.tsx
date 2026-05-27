import { cn } from '#Lib/cn'
import { WEB_SHADOW } from '#Lib/shadow'

import { Typography } from '#Atoms/index.web'

import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'
import type { CSSProperties } from 'react'

/** Web implementation of the StatCard component. */
export const StatCard = ({
  label,
  amount,
  color,
  shadow,
}: Readonly<IStatCardProps>) => (
  <div
    className={cn(statCardVariants(), 'border-l-[var(--border-color)]', {
      [WEB_SHADOW]: shadow,
    })}
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

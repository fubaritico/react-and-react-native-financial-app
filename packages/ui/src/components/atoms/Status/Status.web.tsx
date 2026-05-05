import { Icon } from '#Atoms/Icon/Icon.web'

import { Typography } from '../Typography/index.web'

import { getOrdinalDay } from './Status.constants'

import type { IStatusProps } from './Status.tsx'

/**
 * Status indicator (web).
 * Renders "Monthly -{day}th" with colored text + ✓ or ! indicator.
 */
export function Status({ date, status }: Readonly<IStatusProps>) {
  const ordinal = getOrdinalDay(date)

  const color =
    status === 'paid'
      ? 'success'
      : status === 'due-soon'
        ? 'destructive'
        : 'muted'

  const iconName =
    status === 'paid' ? status : status === 'due-soon' ? 'dueSoon' : undefined

  const iconColor =
    status === 'paid'
      ? 'text-success'
      : status === 'due-soon'
        ? 'text-destructive'
        : undefined

  return (
    <span className="inline-flex items-center gap-2">
      <Typography variant="caption" color={color} as="span">
        Monthly -{ordinal}
      </Typography>
      {iconName ? (
        <Icon name={iconName} className={iconColor} iconSize="sm" />
      ) : null}
    </span>
  )
}

import { View } from 'react-native'

import tw from '#Lib/tw'

import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography'

import { getOrdinalDay } from './Status.constants'

import type { IStatusProps } from './Status.tsx'

/**
 * Status indicator (native).
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
      ? ('success' as const)
      : status === 'due-soon'
        ? ('destructive' as const)
        : undefined

  return (
    <View style={tw`flex-row items-center gap-1`}>
      <Typography variant="caption" color={color}>
        Monthly -{ordinal}
      </Typography>
      {iconName && iconColor ? (
        <Icon name={iconName} color={iconColor} iconSize="sm" />
      ) : null}
    </View>
  )
}

import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './ProgressBar.styles'
import { progressBarVariants } from './ProgressBar.variants'

import type { IProgressBarProps } from './ProgressBar'

/** Color map for buffer intent → token background class */
const BUFFER_COLOR_MAP = {
  success: 'bg-success',
  destructive: 'bg-destructive',
} as const

/** Native implementation of the ProgressBar component. */
export function ProgressBar({
  value,
  max = 100,
  color,
  buffer,
  bufferColor = 'success',
  size,
  metaLeft,
  metaRight,
}: Readonly<IProgressBarProps>) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const primaryPct = (clampedValue / max) * 100
  const hasBuffer = buffer != null && buffer > 0
  const bufferPct = hasBuffer
    ? Math.min((buffer / max) * 100, 100 - primaryPct)
    : 0

  const fillClass = hasBuffer
    ? size === 'thin'
      ? shared.fillThinPrimaryWithBuffer
      : shared.fillThickPrimaryWithBuffer
    : size === 'thin'
      ? shared.fillThin
      : shared.fillThick

  const bufferFillClass =
    size === 'thin' ? shared.fillThinBuffer : shared.fillThickBuffer

  return (
    <View>
      <View
        style={tw`${progressBarVariants({ size })}`}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: clampedValue }}
      >
        {hasBuffer ? (
          <View style={tw`${shared.fillRow}`}>
            <View
              style={[
                tw`${fillClass} bg-${color}${primaryPct === 0 ? ' mr-0' : ''}`,
                { width: `${String(primaryPct)}%` },
              ]}
            />
            <View
              style={[
                tw`${bufferFillClass} ${BUFFER_COLOR_MAP[bufferColor]}`,
                { width: `${String(bufferPct)}%` },
              ]}
            />
          </View>
        ) : (
          <View
            style={[
              tw`${fillClass} bg-${color}`,
              { width: `${String(primaryPct)}%` },
            ]}
          />
        )}
      </View>

      {(metaLeft ?? metaRight) && (
        <View style={tw`${shared.metaRow}`}>
          <View>{metaLeft}</View>
          <View>{metaRight}</View>
        </View>
      )}
    </View>
  )
}

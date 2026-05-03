import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './ProgressBar.styles'
import { progressBarVariants } from './ProgressBar.variants'

import type { IProgressBarProps } from './ProgressBar'

/** Native implementation of the ProgressBar component. */
export function ProgressBar({
  value,
  max = 100,
  color,
  size,
  metaLeft,
  metaRight,
}: Readonly<IProgressBarProps>) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const fillClass = size === 'thin' ? shared.fillThin : shared.fillThick

  return (
    <View>
      <View
        style={tw`${progressBarVariants({ size })}`}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
      >
        <View
          style={[
            tw`${fillClass} bg-${color}`,
            { width: `${String(percentage)}%` },
          ]}
        />
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

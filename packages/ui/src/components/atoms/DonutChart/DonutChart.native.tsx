import { View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'

import tw from '#Lib/tw'

import { Typography } from '../Typography/Typography.native'

import {
  DEFAULT_SIZE,
  HIGHLIGHT_OPACITY,
  HIGHLIGHT_RATIO,
  INNER_RADIUS_RATIO,
} from './DonutChart.constants'
import { native } from './DonutChart.styles'
import { computeArcPaths } from './DonutChart.utils'

import type { IDonutChartProps } from './DonutChart'

/** Native implementation of the DonutChart component. */
export function DonutChart({
  segments,
  centerLabel,
  centerSubLabel,
  size = DEFAULT_SIZE,
}: Readonly<IDonutChartProps>) {
  const arcs = computeArcPaths(segments, size)

  const outerR = size / 2
  const innerR = outerR * INNER_RADIUS_RATIO
  const ringWidth = outerR - innerR
  const highlightWidth = ringWidth * HIGHLIGHT_RATIO
  const highlightR = innerR + highlightWidth / 2

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${String(size)} ${String(size)}`}
        accessibilityRole="image"
        accessibilityLabel={`${centerLabel} ${centerSubLabel ?? ''}`}
      >
        {arcs.map((arc) => (
          <Path
            key={arc.label}
            d={arc.d}
            fill={arc.color}
            accessibilityLabel={arc.label}
          />
        ))}
        <Circle
          cx={outerR}
          cy={outerR}
          r={highlightR}
          fill="none"
          stroke="white"
          strokeWidth={highlightWidth}
          opacity={HIGHLIGHT_OPACITY}
        />
      </Svg>
      <View style={tw`${native.centerWrap}`}>
        <Typography variant="display-lg" color="foreground">
          {centerLabel}
        </Typography>
        {centerSubLabel ? (
          <Typography variant="body" color="muted">
            {centerSubLabel}
          </Typography>
        ) : null}
      </View>
    </View>
  )
}

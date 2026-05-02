import { Typography } from '../Typography/Typography.web'

import {
  DEFAULT_SIZE,
  HIGHLIGHT_OPACITY,
  HIGHLIGHT_RATIO,
  INNER_RADIUS_RATIO,
} from './DonutChart.constants'
import { web } from './DonutChart.styles'
import { computeArcPaths } from './DonutChart.utils'

import type { IDonutChartProps } from './DonutChart'

/** Web implementation of the DonutChart component. */
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
    <div className={web.root} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${String(size)} ${String(size)}`}
        aria-label={`${centerLabel} ${centerSubLabel ?? ''}`}
        role="img"
      >
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={arc.d}
            fill={arc.color}
            aria-label={arc.label}
          />
        ))}
        <circle
          cx={outerR}
          cy={outerR}
          r={highlightR}
          fill="none"
          stroke="white"
          strokeWidth={highlightWidth}
          opacity={HIGHLIGHT_OPACITY}
        />
      </svg>
      <div className={web.centerWrap}>
        <Typography variant="display-lg" color="foreground">
          {centerLabel}
        </Typography>
        {centerSubLabel ? (
          <Typography variant="body" color="muted">
            {centerSubLabel}
          </Typography>
        ) : null}
      </div>
    </div>
  )
}

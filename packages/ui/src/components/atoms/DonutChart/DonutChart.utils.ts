import { INNER_RADIUS_RATIO, START_ANGLE_DEG } from './DonutChart.constants'

import type { IArcPath, IDonutSegment } from './DonutChart'

/** Converts degrees to radians */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Computes (x, y) on a circle given center, radius, and angle in degrees */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = toRadians(angleDeg)
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

/**
 * Builds an SVG path `d` string for an annular sector (donut segment).
 * Uses two arcs (outer clockwise, inner counter-clockwise) connected by lines.
 */
function buildArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startDeg)
  const outerEnd = polarToCartesian(cx, cy, outerR, endDeg)
  const innerStart = polarToCartesian(cx, cy, innerR, startDeg)
  const innerEnd = polarToCartesian(cx, cy, innerR, endDeg)

  const sweep = endDeg - startDeg
  // SVG arc large-arc-flag: 1 when sweep exceeds 180° (half circle)
  const largeArc = sweep > 180 ? 1 : 0

  return [
    `M ${String(outerStart.x)} ${String(outerStart.y)}`,
    `A ${String(outerR)} ${String(outerR)} 0 ${String(largeArc)} 1 ${String(outerEnd.x)} ${String(outerEnd.y)}`,
    `L ${String(innerEnd.x)} ${String(innerEnd.y)}`,
    `A ${String(innerR)} ${String(innerR)} 0 ${String(largeArc)} 0 ${String(innerStart.x)} ${String(innerStart.y)}`,
    'Z',
  ].join(' ')
}

/**
 * Computes all arc paths for the donut chart from segment data.
 * Segments are laid out clockwise starting from 12 o'clock.
 */
export function computeArcPaths(
  segments: readonly IDonutSegment[],
  size: number
): readonly IArcPath[] {
  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2
  const innerR = outerR * INNER_RADIUS_RATIO

  let currentAngle: number = START_ANGLE_DEG

  return segments.map((segment) => {
    // Convert percentage to degrees (360° per full rotation)
    const sweepDeg = (segment.percentage / 100) * 360
    const startDeg = currentAngle
    const endDeg = currentAngle + sweepDeg
    currentAngle = endDeg

    return {
      d: buildArcPath(cx, cy, outerR, innerR, startDeg, endDeg),
      color: segment.color,
      label: segment.label,
    }
  })
}

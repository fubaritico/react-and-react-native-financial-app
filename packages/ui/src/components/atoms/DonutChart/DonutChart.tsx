/** A single segment of the donut chart */
export interface IDonutSegment {
  /** Percentage of the full ring (0-100). All segments should sum to 100. */
  percentage: number
  /** Resolved color value (hex string) */
  color: string
  /** Accessible label for the segment (e.g. "Entertainment: 15%") */
  label: string
}

/** Props for the DonutChart atom */
export interface IDonutChartProps {
  /** Segments composing the donut ring */
  segments: readonly IDonutSegment[]
  /** Center text — typically the total amount (e.g. "$338") */
  centerLabel: string
  /** Center subtext — typically the limit context (e.g. "of $975 limit") */
  centerSubLabel?: string
  /** Chart diameter in pixels (default 240) */
  size?: number
}

/** SVG arc path data for a single donut segment (annular sector) */
export interface IArcPath {
  /** SVG path `d` attribute */
  d: string
  /** Segment color */
  color: string
  /** Accessible label */
  label: string
}

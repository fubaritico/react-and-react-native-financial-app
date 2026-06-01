/** Shared layout classes for SegmentedControl (safe for both native and web). */
export const shared = {
  /** Outer wrapper stacking the optional label above the bar, with spacing between them. */
  container: 'flex flex-col gap-2',
  /** Group container (the bar) — flex row laying the segments side by side. */
  root: 'flex flex-row',
  /** Makes each segment grow to share the row width equally. */
  segmentFill: 'flex-1',
  /** Leftmost segment — rounds the top-left and bottom-left corners. */
  firstSegment: 'rounded-l-md',
  /** Rightmost segment — closing right border plus rounded top-right and bottom-right corners. */
  lastSegment: 'border-r rounded-r-md',
} as const

/** Web-only classes for SegmentedControl (cursor, focus ring, screen-reader-only input). */
export const web = {
  /** Segment label — pointer cursor and a keyboard focus ring driven by the wrapped radio input. */
  segment:
    'cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-grey-900',
  /** Visually hides the native radio input while keeping it in the accessibility tree. */
  srOnly: 'sr-only',
  /** Disabled affordance applied to a segment label. */
  disabled: 'cursor-not-allowed opacity-50',
} as const

/** Native-only classes for SegmentedControl (none required — layout handled by shared classes and explicit flex style). */
export const native = {} as const

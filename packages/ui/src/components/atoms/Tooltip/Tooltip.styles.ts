/** Shared layout classes for Tooltip (safe for both native and web). */
export const shared = {
  /** Max width constraint for the tooltip bubble. */
  bubble: 'max-w-[280px]',
} as const

/** Web-only classes for Tooltip (z-index, shadow, pointer-events, transition). */
export const web = {
  /** Portal-level positioning and elevation. */
  portal: 'fixed z-50 pointer-events-none',
  /** Shadow, overflow visible for arrow, force text color inheritance on children. */
  bubble: 'shadow-lg overflow-visible [&_*]:text-inherit',
  /** Arrow base styles — CSS border-triangle technique, relative to bubble. */
  arrow: 'absolute h-0 w-0 border-[6px] border-transparent',
} as const

/** Native-only classes for Tooltip (absolute overlay positioning). */
export const native = {
  /** Absolute positioning within the parent container. */
  bubble: 'absolute',
  /** Arrow base styles using border-triangle technique. */
  arrow: 'absolute w-0 h-0',
} as const

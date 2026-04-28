/** Shared layout classes for SectionLink (safe for both native and web) */
export const shared = {
  /** Root row layout — center items with gap */
  root: 'items-center gap-3',
} as const

/** Web-only classes for SectionLink (hover, transition, cursor, reset) */
export const web = {
  /** Interactive feedback + button reset */
  root: 'inline-flex hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0',
} as const

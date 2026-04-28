/** Shared layout classes for AuthCard inner elements (safe for both native and web) */
export const shared = {
  /** Common root surface styling */
  root: 'bg-card rounded-lg py-8 gap-8',
  /** Children form area gap */
  childrenWrap: 'gap-4',
} as const

/** Web-only classes for AuthCard (shadow, layout constraints) */
export const web = {
  /** Shadow + flex column + max-width constraint + horizontal padding */
  root: 'shadow-lg flex flex-col w-full max-w-md px-8',
} as const

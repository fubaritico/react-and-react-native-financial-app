/** Shared layout classes for Skeleton (safe for both native and web) */
export const shared = {} as const

/** Web-only classes for Skeleton (shimmer animation) */
export const web = {
  /** Shimmer pseudo-element animation */
  shimmer: 'skeleton-shimmer',
} as const

/** Native-only classes for Skeleton */
export const native = {} as const

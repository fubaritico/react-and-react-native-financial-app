/** Shared layout classes for Divider (safe for both native and web) */
export const shared = {
  /** Base divider line appearance */
  base: 'h-px w-full bg-grey-100',
  /** Vertical spacing variants */
  spacing: {
    sm: 'my-1',
    md: 'my-2',
    lg: 'my-4',
  },
} as const

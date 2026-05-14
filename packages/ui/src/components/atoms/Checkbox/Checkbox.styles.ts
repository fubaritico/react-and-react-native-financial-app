/** Shared layout classes for Checkbox (safe for both native and web) */
export const shared = {
  /** Row layout: checkbox box + label */
  root: 'flex-row items-center gap-3',
  /** Error message spacing below the checkbox row */
  errorWrap: 'mt-1',
} as const

/** Web-only classes for Checkbox (hover, focus, transition, cursor) */
export const web = {
  /** Visual box: peer-focus-visible ring (triggered by sr-only input) + transition */
  boxBase:
    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grey-900 transition-colors',
  /** Hover border — applied only when not disabled and not in error */
  boxHover: 'group-hover:border-grey-500',
  /** Clickable label — `group` enables group-hover on child span */
  label: 'group cursor-pointer select-none',
  /** Disabled label — no hover effect, not-allowed cursor */
  disabled: 'cursor-not-allowed',
} as const

/** Native-only classes for Checkbox */
export const native = {} as const

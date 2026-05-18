/** Shared layout classes for ModeCard (safe for both native and web) */
export const shared = {
  /** Card body — extra top padding to clear the medallion overlap */
  body: 'pt-10 pb-5 px-5 items-center',
  /** Medallion circle — centered, round, light background */
  medallion: 'items-center justify-center rounded-full bg-beige-100',
  /** Spacing below title */
  description: 'mt-2',
  /** Badge pill container */
  badge: 'mt-3 px-3 py-1 rounded-full bg-beige-100',
} as const

/** Web-only classes for ModeCard (hover, focus, transition, shadow, cursor) */
export const web = {
  /** Interactive card — hover shadow + keyboard focus ring */
  root: 'cursor-pointer transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Disabled card — blocked interaction */
  rootDisabled: 'cursor-not-allowed',
} as const

/** Native-only classes for ModeCard */
export const native = {} as const

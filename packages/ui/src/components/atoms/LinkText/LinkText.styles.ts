/** Shared layout classes for LinkText inner elements (safe for both native and web) */
export const shared = {
  /** Bold underlined link appearance */
  link: 'font-bold text-foreground underline',
} as const

/** Web-only classes for LinkText (hover, transition, cursor) */
export const web = {
  /** Hover feedback on link */
  link: 'hover:opacity-80 transition-opacity cursor-pointer',
} as const

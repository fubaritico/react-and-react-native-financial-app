/** Shared layout classes for Dropdown inner elements (safe for both native and web) */
export const shared = {} as const

/** Web-only classes for Dropdown (inline-flex, min-h for height fix) */
export const web = {
  /** Trigger content wrapper — ensures min height when no value selected */
  triggerContent: 'inline-flex min-h-6 flex-1 items-center gap-2',
  /** Menu item content with color dot + icon */
  menuItemContent: 'inline-flex items-center gap-2',
} as const

/** Native-only classes for Dropdown (flex-row layout for trigger and items) */
export const native = {
  /** Trigger content wrapper — ensures min height when no value selected */
  triggerContent: 'flex-1 flex-row items-center gap-2 min-h-6',
  /** Menu item content with color dot + icon */
  menuItemContent: 'flex-row items-center gap-2',
} as const

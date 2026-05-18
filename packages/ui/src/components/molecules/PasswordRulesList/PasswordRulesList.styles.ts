/** Shared layout classes for PasswordRulesList inner elements (safe for both native and web) */
export const shared = {
  /** Vertical gap between rule items */
  list: 'gap-1 px-4',
  /** Horizontal layout for icon + label row */
  row: 'flex-row items-center',
  /** Spacer for icon area (mr-1 = 4px) */
  iconWrap: 'mr-1',
  /** Placeholder matching icon width when no icon is shown (w-3 = 12px, mr-1 = 4px) */
  iconPlaceholder: 'w-3 mr-1',
} as const

/** Web-only classes for PasswordRulesList */
export const web = {
  /** Flex column layout for the list container */
  list: 'flex flex-col',
  /** Flex layout for the row */
  row: 'flex',
  /** Flex centering for icon wrapper */
  iconWrap: 'flex items-center',
} as const

/** Native-only classes for PasswordRulesList */
export const native = {} as const

/** Web-only classes for Button (hover, focus, transition, cursor) */
export const web = {
  /** Inline flex layout + hover feedback */
  root: 'inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
  /** Focus-visible ring for keyboard navigation */
  focusRing:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Cursor override for disabled state */
  disabled: 'cursor-not-allowed hover:opacity-50',
} as const

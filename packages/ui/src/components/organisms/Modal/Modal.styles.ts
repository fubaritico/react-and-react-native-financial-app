/** Shared layout classes for Modal inner elements (safe for both native and web) */
export const shared = {
  /** Header row: title + close button */
  header: 'flex-row items-center justify-between',
  /** Body area with top spacing */
  body: 'mt-5',
  /** Footer area with top spacing */
  footer: 'mt-5 gap-3',
  /** Close button touch target — min 44x44 for WCAG 2.5.8 */
  closeButton: 'items-center justify-center w-11 h-11 rounded-full',
} as const

/** Web-only classes for Modal (hover, focus, shadow, overflow, backdrop) */
export const web = {
  /** Close button hover + focus ring */
  closeButton:
    'cursor-pointer hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Scrollable body with max height */
  body: 'overflow-y-auto max-h-[60vh]',
  /** Shadow + focus reset on dialog panel */
  panel: 'shadow-lg focus:outline-none',
  /** Fullscreen backdrop overlay */
  overlay:
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5',
} as const

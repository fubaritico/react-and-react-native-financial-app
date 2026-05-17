/** Shared layout classes for OtpInput (safe for both native and web) */
export const shared = {
  /** Row container for the OTP cells */
  root: 'flex flex-row items-center gap-2',
} as const

/** Web-only classes for OtpInput (focus, transition, cursor) */
export const web = {
  /** Focus ring for keyboard navigation on each cell */
  cellFocus:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Transition for border color change */
  cellTransition: 'transition-colors duration-150',
  /** Caret color */
  cellCaret: 'caret-grey-900',
  /** Cell text styling (font weight, size, color, background) */
  cellText: 'font-bold text-xl text-grey-900 bg-white',
} as const

/** Native-only classes for OtpInput */
export const native = {
  /** Cell text styling (alignment, font weight, size, color) */
  cellText: 'text-center text-xl font-bold text-grey-900',
} as const

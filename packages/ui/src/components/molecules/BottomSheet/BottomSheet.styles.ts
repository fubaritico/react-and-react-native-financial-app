/** Web-only classes for BottomSheet (positioning, shadow, animation, backdrop) */
export const web = {
  /** Fixed bottom sheet positioning + layout */
  root: 'fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[60vh] shadow-2xl',
  /** Slide-up animation (conditional) */
  animate: 'motion-safe:animate-slide-up',
  /** Fullscreen backdrop overlay */
  overlay: 'fixed inset-0 z-50 bg-black/50',
  /** Web display mode for knob (inline-block is web-only) */
  knob: 'inline-block',
} as const

/** Shared layout classes for bottom sheet inner elements (safe for both native and web) */
export const shared = {
  /** Decorative drag indicator centered at top of sheet */
  knob: 'h-1 w-[100px] rounded-full absolute top-3 left-1/2 -translate-x-1/2',
} as const

/** Native-only classes for BottomSheet */
export const native = {} as const

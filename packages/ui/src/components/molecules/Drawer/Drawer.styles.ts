/** Web-only classes for Drawer (positioning, shadow, animation, backdrop) */
export const web = {
  /** Fixed bottom sheet positioning + layout */
  root: 'fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[60vh] shadow-2xl',
  /** Slide-up animation (conditional) */
  animate: 'motion-safe:animate-slide-up',
  /** Fullscreen backdrop overlay */
  overlay: 'fixed inset-0 z-50 bg-black/50',
} as const

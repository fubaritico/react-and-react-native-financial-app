/** Shared layout classes for Navigation inner elements (safe for both native and web) */
export const shared = {
  /** Vertical nav item list */
  navList: 'flex-col gap-1',
} as const

/** Web-only classes for Navigation (hover, focus, transition, shadow, cursor, animate, responsive) */
export const web = {
  /** Sidebar container — dark bg, rounded right corners, sticky */
  sidebar:
    'hidden lg:flex flex-col h-screen bg-nav-bg rounded-r-xl py-10 sticky top-0 transition-width duration-300',
  /** Sidebar expanded width */
  sidebarExpanded: 'w-[300px] pr-8',
  /** Sidebar collapsed width */
  sidebarCollapsed: 'w-[88px] px-4 items-center',
  /** Bottom bar container — fixed at bottom, dark bg */
  bottomBar:
    'fixed bottom-0 left-0 right-0 z-50 flex lg:hidden bg-nav-bg px-4 pt-2 pb-2 rounded-t-lg',
  /** Logo area spacing */
  logoWrap: 'flex items-center mb-10',
  /** Logo collapsed spacing */
  logoWrapCollapsed: 'mb-10',
  /** Minimize button at bottom of sidebar */
  minimizeWrap: 'mt-auto pt-4',
  /** Minimize button interactive styles */
  minimizeButton:
    'flex items-center gap-4 px-8 py-3 text-nav-text hover:text-on-dark transition-colors cursor-pointer rounded-r-lg w-full',
  /** Focus-visible ring for keyboard navigation */
  focusRing:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Nav link wrapper — block display for full-width click area */
  navLink: 'block',
  /** Bottom bar item — equal flex distribution */
  bottomBarItem: 'flex-1',
  /** Rotate minimize icon when collapsed (arrow points right to expand) */
  minimizeIconRotated: 'rotate-180',
} as const

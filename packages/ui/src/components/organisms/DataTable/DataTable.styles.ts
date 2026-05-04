/** Shared layout classes for DataTable inner elements (safe for both native and web) */
export const shared = {
  /** Root container full width */
  root: 'bg-white rounded-lg w-full',
  /** Header row layout with bottom border */
  headerRow: 'flex-row border-b border-border',
  /** Header cell padding */
  headerCell: 'flex-1 py-3',
  /** Body row horizontal layout */
  bodyRow: 'flex-row items-center',
  /** Body cell padding */
  bodyCell: 'flex-1 py-4',
  /** Empty state centering */
  emptyRow: 'py-8 items-center justify-center',
} as const

/** Web-only classes for DataTable (shadow, sticky, cursor, focus, overflow) */
export const web = {
  /** Shadow on wrapper (conditional via noShadow prop) */
  shadow: 'shadow-md',
  /** Clip content to rounded corners */
  overflow: 'overflow-clip',
  /** Responsive horizontal padding */
  padding: 'p-6 lg:p-8',
  /** Sticky table header */
  stickyHeader: 'sticky top-0 z-30',
  /** Interactive row cursor + focus ring */
  interactiveRow:
    'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Fixed row height */
  rowHeight: 'h-[54px]',
} as const

/** Native-only classes for DataTable (RN layout quirks) */
export const native = {} as const

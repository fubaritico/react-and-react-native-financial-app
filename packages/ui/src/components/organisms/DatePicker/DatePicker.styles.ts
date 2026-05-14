/** Shared layout classes for DatePicker inner elements (safe for both native and web) */
export const shared = {
  /** Vertical gap between label, field, and helper text */
  wrapper: 'gap-1',
} as const

/** Web-only classes for DatePicker (light / popover context) */
export const web = {
  /** Focus ring on trigger group */
  trigger: 'focus-within:border-foreground transition-colors',
  /** Trigger inner layout */
  triggerInner: 'flex items-center',
  /** Calendar icon button inside trigger */
  fieldButton:
    'ml-auto flex items-center justify-center rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Date segment styling */
  segment:
    'rounded px-0.5 tabular-nums caret-transparent outline-none focus:bg-grey-900 focus:text-white',
  /** Placeholder segment color */
  segmentPlaceholder: 'text-beige-500',
  /** Popover container */
  popover: 'rounded-lg bg-white p-4 shadow-lg z-50',
  /** Calendar root */
  calendar: 'w-[280px]',
  /** Calendar header (month + navigation) */
  calendarHeader: 'flex items-center gap-2 pb-4',
  /** Month/year heading (light) */
  calendarHeading: 'flex-1 text-center text-sm font-bold text-grey-900',
  /** Month navigation button (light) */
  navButton:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-beige-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-grey-900 transition-colors',
  /** CalendarGrid (table element) — full width, no cell spacing */
  grid: 'w-full border-spacing-0',
  /** Day cell base (td element) */
  cellBase: 'p-0.5 text-center',
  /** Inner div of day cell for round shape */
  cellInner:
    'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm cursor-default',
  /** Default day cell (light) */
  cellDefault: 'text-grey-900 hover:bg-beige-100',
  /** Selected day cell (light) */
  cellSelected: 'bg-grey-900 text-white',
  /** Disabled day cell (light) */
  cellDisabled: 'text-grey-300',
  /** Day outside current month (light) */
  cellOutside: 'text-grey-300',
  /** Weekday header cell (th element) */
  weekday: 'pb-2 text-center text-xs text-grey-500 font-medium',
  /** Mobile trigger button (full row, looks like TextInput) */
  mobileTrigger:
    'w-full text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900 transition-colors',
} as const

/** Web-only dark classes for Calendar inside BottomSheet */
export const dark = {
  /** Calendar root (dark) */
  calendar: 'w-full',
  /** Month/year heading (dark) */
  calendarHeading: 'flex-1 text-center text-sm font-bold text-white',
  /** Month navigation button (dark) */
  navButton:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors',
  /** Default day cell (dark) */
  cellDefault: 'text-white hover:bg-white/10',
  /** Selected day cell (dark) */
  cellSelected: 'bg-white text-grey-900',
  /** Disabled day cell (dark) */
  cellDisabled: 'text-grey-500',
  /** Day outside current month (dark) */
  cellOutside: 'text-grey-500',
  /** Weekday header cell (dark) */
  weekday: 'pb-2 text-center text-xs text-grey-300 font-medium',
} as const

/** Native-only classes for DatePicker */
export const native = {
  /** Icon container in trigger */
  iconWrap: 'mr-3',
} as const

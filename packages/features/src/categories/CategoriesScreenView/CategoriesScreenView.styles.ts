/** Web-only classes for CategoriesScreenView */
export const web = {
  /** Outer wrapper — flex with padding, responsive horizontal padding */
  root: 'flex flex-1 gap-8 px-5 py-8 lg:px-10',
  /** Inner container — constrained width */
  container: 'flex w-full max-w-2xl flex-col gap-6',
  /** Header row — back button + title */
  header: 'flex items-center gap-3',
  /** Category grid container */
  grid: 'grid grid-cols-4 gap-3 md:gap:4 sm:grid-cols-5 md:grid-cols-6',
  /** Add form wrapper */
  formWrapper: 'flex flex-col gap-4',
  /** Form row — label + input or selectors */
  formRow: 'flex flex-col gap-2',
  /** Submit button wrapper — right-aligned */
  submitWrapper: 'flex justify-end',
  /** Icon selector grid — dark background with white icons */
  iconGrid: 'grid grid-cols-6 gap-2 rounded-md sm:grid-cols-7 md:grid-cols-8',
  /** Icon cell — clickable icon in the selector */
  iconCell:
    'flex items-center justify-center bg-grey-100/75 text-grey-500 hover:text-foreground/75 rounded-sm p-2 cursor-pointer transition-colors border-0',
  /** Selected icon cell */
  iconCellSelected: 'bg-grey-500 text-white hover:text-white',
  /** Unselected icon cell */
  iconCellDefault: 'bg-grey-100/75 hover:bg-grey-100',
} as const

/** Number of columns for the category grid on native. */
export const GRID_COLUMNS = 4
/** Gap between category grid cells (in pixels). */
export const GRID_GAP = 12
/** Number of columns for the icon selector grid on native. */
export const ICON_GRID_COLUMNS = 6
/** Gap between icon selector cells (in pixels). */
export const ICON_GRID_GAP = 8

/** Native-only classes for CategoriesScreenView */
export const native = {
  /** ScrollView content — padded, vertical gap, pt-14 clears status bar (matches overview p-4 + mt-10) */
  scrollContent: 'flex-grow bg-beige-100 px-5 pt-14 pb-10 gap-6',
  /** Header row — back button + title */
  header: 'flex-row items-center gap-3',
  /** Category grid container — wrapping row */
  grid: 'flex-row flex-wrap',
  /** Add form wrapper */
  formWrapper: 'gap-4',
  /** Form row — label + input or selectors */
  formRow: 'gap-2',
  /** Icon selector grid — wrapping row */
  iconGrid: 'flex-row flex-wrap',
  /** Icon cell — clickable icon in the selector */
  iconCell: 'items-center justify-center bg-grey-100/75 rounded-sm',
  /** Selected icon cell */
  iconCellSelected: 'bg-grey-500',
  /** Unselected icon cell */
  iconCellDefault: 'bg-grey-100/75',
} as const

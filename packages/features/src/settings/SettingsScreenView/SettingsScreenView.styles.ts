/** Shared layout classes for SettingsScreenView inner elements (safe for both native and web) */
export const shared = {
  /** Card inner container — vertical layout with section spacing */
  cardContent: 'flex-1 gap-3',
  /** Section group — vertical layout with field spacing */
  section: 'gap-3',
  /** Row pairing two items side by side */
  row: 'flex-row gap-3',
  /** Flexible child within a row — takes equal width */
  rowItem: 'flex-1',
  /** Language/currency field wrapper — label above control */
  fieldWrapper: 'gap-1',
  /** Button pair — two buttons side by side */
  buttonRow: 'flex-row gap-2',
  /** Flexible button within a row */
  buttonItem: 'flex-1',
} as const

/** Web-only classes for SettingsScreenView (layout, responsive) */
export const web = {
  /** Outer wrapper — flex with padding, responsive horizontal padding */
  root: 'flex flex-1 gap-8 px-5 py-8 lg:px-10',
  /** Inner container — constrained width, centered */
  container: 'flex w-full max-w-xl flex-col justify-center gap-8',
  /** Card content wrapper */
  content: 'flex flex-col gap-3',
  /** Section group wrapper */
  section: 'flex flex-col gap-3',
  /** Row pairing two items side by side */
  row: 'flex flex-row gap-3',
  /** Flexible child within a row */
  rowItem: 'flex-1',
  /** Field wrapper — label above control */
  fieldWrapper: 'flex flex-col gap-1',
  /** Button pair — two buttons side by side */
  buttonRow: 'flex flex-row gap-2',
  /** Flexible button within a row */
  buttonItem: 'flex-1',
} as const

/** Native-only classes for SettingsScreenView (ScrollView content, RN layout) */
export const native = {
  /** ScrollView content — centered, padded, vertical gap */
  scrollContent: 'flex-grow bg-beige-200 justify-center px-5 pt-8 pb-10 gap-6',
  /** Card inner container — vertical layout with section spacing */
  cardContent: 'flex-1 gap-3',
  /** Section group — vertical layout with field spacing */
  section: 'gap-3',
  /** Row pairing two items side by side */
  row: 'flex-row gap-3',
  /** Flexible child within a row */
  rowItem: 'flex-1',
  /** Field wrapper — label above control */
  fieldWrapper: 'gap-1',
  /** Button pair — two buttons side by side */
  buttonRow: 'flex-row gap-2',
  /** Flexible button within a row */
  buttonItem: 'flex-1',
} as const

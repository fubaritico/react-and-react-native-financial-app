/** Shared layout classes for SettingsScreenView inner elements (safe for both native and web) */
export const shared = {
  /** Card inner container — vertical layout with spacing */
  cardContent: 'flex-1 gap-4',
  /** Language section — label above dropdown */
  languageSection: 'gap-1',
  /** Button group — stacked vertically with spacing */
  buttonGroup: 'gap-2',
} as const

/** Web-only classes for SettingsScreenView (layout, responsive) */
export const web = {
  /** Outer wrapper — flex with padding, responsive horizontal padding */
  root: 'flex flex-1 gap-8 px-5 py-8 lg:px-10',
  /** Inner container — constrained width, centered */
  container: 'flex w-full max-w-xl flex-col justify-center gap-8',
  /** Card content wrapper */
  content: 'flex flex-col gap-4',
  /** Language section wrapper */
  languageSection: 'flex flex-col gap-1',
  /** Button group wrapper */
  buttonGroup: 'flex flex-col gap-2',
} as const

/** Native-only classes for SettingsScreenView (ScrollView content, RN layout) */
export const native = {
  /** ScrollView content — centered, padded, vertical gap */
  scrollContent: 'flex-grow justify-center px-5 pt-10 pb-10 gap-6',
  /** Card inner container — vertical layout with spacing */
  cardContent: 'flex-1 gap-4',
  /** Language section — label above dropdown */
  languageSection: 'gap-1',
  /** Button group — stacked vertically */
  buttonGroup: 'gap-2',
} as const

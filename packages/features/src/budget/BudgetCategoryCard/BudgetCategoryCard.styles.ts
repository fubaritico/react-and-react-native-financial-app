/** Shared layout classes for BudgetCategoryCard inner elements (safe for both native and web) */
export const shared = {
  /** Header row: ColorDot + category name + ellipsis menu */
  header: 'flex flex-row items-center',
  /** Category title taking remaining horizontal space */
  title: 'flex-1 ml-4',
  /** Subtitle line below header ("Maximum of $X.00") */
  subtitle: 'mt-1 mb-5',
  /** Accent bar on the spent/remaining column */
  metaColumn: 'border-l-4 pl-4 py-1',
  /** Wrapper around the LatestSpending molecule */
  latestWrapper: 'mt-5',
} as const

/** Web-only classes for BudgetCategoryCard (hover, focus, transition, shadow, cursor, animate) */
export const web = {
  /** Remaining column left border in neutral beige */
  metaColumnRemaining: 'border-l-beige-100',
} as const

/** Native-only classes for BudgetCategoryCard (RN layout quirks, explicit flex-row, absolute positioning) */
export const native = {} as const

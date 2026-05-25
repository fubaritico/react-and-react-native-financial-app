import type { ICategory } from '@financial-app/shared'

/** Props for the CategoryDropdown component */
export interface ICategoryDropdownProps {
  /** Available categories from the API */
  categories: readonly ICategory[]
  /** Currently selected category UUID */
  selectedCategoryId: string
  /** Called when a category is selected */
  onSelect: (categoryId: string) => void
  /** Category IDs already in use (shown as disabled with badge) */
  existingCategoryIds?: readonly string[]
  /** Accessible label for the dropdown */
  accessibilityLabel?: string
  /** BottomSheet header title */
  bottomSheetTitle?: string
  /** Label shown for already-used categories (e.g. "Already used") */
  alreadyUsedLabel: string
}

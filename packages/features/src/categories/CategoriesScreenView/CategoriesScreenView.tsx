import type { IconName } from '@financial-app/icons'
import type { ICategory } from '@financial-app/shared'

/** Data for creating a new category. */
export interface INewCategoryData {
  /** Category display name */
  name: string
  /** Icon identifier from the icons package */
  icon: IconName
  /** Design token color key (e.g. "blue", "army-green") */
  color: string
}

/** Props for the CategoriesScreenView component. */
export interface ICategoriesScreenViewProps {
  /** List of all user categories (system + custom) */
  categories: readonly ICategory[]
  /** Callback to create a new custom category */
  onAddCategory: (data: INewCategoryData) => void
  /** Callback to delete a custom category by ID */
  onDeleteCategory: (id: string) => void
  /** Whether a create mutation is in progress */
  isAdding: boolean
  /** ID of the category currently being deleted, or null */
  deletingId: string | null
  /** Callback to navigate back to settings */
  onGoBack: () => void
}

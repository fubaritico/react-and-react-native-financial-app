import type { IconName } from '@financial-app/icons'

/** Props for the CategoryButton component — colored circle with icon, name label, and optional delete mode. */
export interface ICategoryButtonProps {
  /** Unique identifier for the category — passed back via onDelete(id). */
  id?: string
  /** Icon to render inside the colored circle. */
  icon: IconName
  /** Design token color key for the circle background (e.g. "blue", "army-green"). */
  color: string
  /** Category display name — rendered below the circle. */
  name: string
  /** Accessible label for the button (typically the category name). */
  accessibilityLabel: string
  /** Whether this category can be deleted (false for system categories). */
  isDeletable?: boolean
  /** Callback fired when the user confirms deletion — receives the category id. */
  onDelete?: (id: string) => void
  /** Whether a delete operation is currently in progress. */
  isDeleting?: boolean
}

import type { IconName } from '@financial-app/icons'

import type { IconButtonVariants } from './IconButton.variants'

/** Props for the IconButton component — circular icon-only button. */
export interface IIconButtonProps {
  /** Icon to render inside the button. */
  icon: IconName
  /** Callback fired when the button is pressed. */
  onPress: () => void
  /** Accessible label describing the button action (mandatory for icon-only buttons). */
  accessibilityLabel: string
  /** Visual style variant. */
  variant?: IconButtonVariants['variant']
  /** Button size — controls height and width. */
  size?: IconButtonVariants['size']
  /** Whether the button is disabled. */
  disabled?: boolean
  /** Additional CSS classes for the button container. */
  className?: string
}

import type { IconName } from '@financial-app/icons'
import type { VariantProps } from 'class-variance-authority'
import type { ViewStyle } from 'react-native'

import type { buttonVariants } from '../../variants'

/** Props for the Button component. */
export interface IButtonProps extends VariantProps<typeof buttonVariants> {
  /** Text displayed inside the button. */
  title: string
  /** Callback fired when the button is pressed. */
  onPress: () => void
  /** Optional icon rendered next to the label by name (e.g. "caretRight"). */
  icon?: IconName
  /** Icon position relative to label — defaults to 'right'. */
  iconPosition?: 'left' | 'right'
  /** Optional style override (native only). */
  style?: ViewStyle | object
}

export { buttonVariants } from '../../variants'

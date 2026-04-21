import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

import type { buttonVariants } from '../../variants'

/** Props for the Button component. */
export interface IButtonProps extends VariantProps<typeof buttonVariants> {
  /** Text displayed inside the button. */
  title: string
  /** Callback fired when the button is pressed. */
  onPress: () => void
  /** Optional icon rendered after the label (tertiary arrow, etc.). */
  icon?: ReactNode
  /** Optional style override (native only). */
  style?: ViewStyle | object
}

export { buttonVariants } from '../../variants'

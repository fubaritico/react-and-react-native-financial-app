import type { IconName } from '@financial-app/icons'

import type { buttonVariants } from './Button.variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

/** Props for the Button component. */
export interface IButtonProps extends VariantProps<typeof buttonVariants> {
  /** Text displayed inside the button. Ignored when `children` is provided. */
  title?: string
  /** Custom content rendered inside the button (overrides `title`). */
  children?: ReactNode
  /** Callback fired when the button is pressed. */
  onPress: () => void
  /** Optional icon rendered next to the label by name (e.g. "caretRight"). Only used with `title`. */
  icon?: IconName
  /** Icon position relative to label — defaults to 'right'. Only used with `title`. */
  iconPosition?: 'left' | 'right'
  /** Accessible label for icon-only or custom-content buttons. */
  accessibilityLabel?: string
  /** ARIA current state for active indicators (e.g. current page, active tab). Web only. */
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | true
  /** Optional style override (native only). */
  style?: ViewStyle | object
}

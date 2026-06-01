import type { IconName } from '@financial-app/icons'

import type { buttonVariants } from './Button.variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode, Ref } from 'react'
import type { View, ViewStyle } from 'react-native'

/** Props for the Button component. */
export interface IButtonProps extends VariantProps<typeof buttonVariants> {
  /** Text displayed inside the button. Ignored when `children` is provided. */
  title?: string
  /** Custom content rendered inside the button (overrides `title`). */
  children?: ReactNode
  /** Callback fired when the button is pressed. */
  onPress: () => void
  /** Native HTML button type (web only) — defaults to 'button' so a button never submits its enclosing form unless explicitly set to 'submit'. */
  type?: 'button' | 'submit' | 'reset'
  /** Optional icon rendered next to the label by name (e.g. "caretRight"). Only used with `title`. */
  icon?: IconName
  /** Icon position relative to label — defaults to 'right'. Only used with `title`. */
  iconPosition?: 'left' | 'right'
  /** Accessible label for icon-only or custom-content buttons. */
  accessibilityLabel?: string
  /** ARIA current state for active indicators (e.g. current page, active tab). Web only. */
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | true
  /** ARIA popup type — indicates the button opens a popup element. Web uses aria-haspopup, native uses accessibilityHint. */
  ariaHaspopup?: 'listbox' | 'menu' | 'dialog' | 'grid' | 'tree' | true
  /** Whether the controlled popup is currently expanded. Web uses aria-expanded, native uses accessibilityState.expanded. */
  ariaExpanded?: boolean
  /** DOM id of the controlled popup element (web only). */
  ariaControls?: string
  /** Shows a spinner and disables interaction while an async operation is in progress. */
  loading?: boolean
  /** Additional CSS classes for the button container (web: className, native: tw classes). */
  className?: string
  /** Ref to the underlying button element (HTMLButtonElement on web, View on native). */
  ref?: Ref<HTMLButtonElement> | Ref<View>
  /** Optional style override (native only). */
  style?: ViewStyle | object
}

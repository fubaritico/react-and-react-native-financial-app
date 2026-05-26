import type { IIconSize } from '../Icon/Icon.constants'
import type { IconColor } from '../Icon/Icon.tsx'

/** Semantic icon color per button variant. */
export const ICON_COLOR_TOKEN: Record<string, IconColor> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'muted',
  destroy: 'primary-foreground',
  outline: 'foreground',
}

/** Token name mapping for spinner color per button variant (resolved via resolveColor on native). */
export const SPINNER_COLOR_TOKEN: Record<string, string> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'foreground-muted',
  destroy: 'primary-foreground',
  outline: 'foreground',
  ghost: 'foreground',
}

/**
 * Maps Button size to Icon iconSize for native.
 * Button size names don't all match IIconSize — this ensures valid values.
 */
export const BUTTON_ICON_SIZE_MAP: Record<string, IIconSize> = {
  lg: 'sm',
  md: 'xs',
  sm: 'xxs',
  icon: 'xs',
  nav: 'xs',
}

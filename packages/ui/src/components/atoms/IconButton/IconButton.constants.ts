import type { IButtonProps } from '../Button/Button'
import type { IIconSize } from '../Icon/Icon.constants'

/**
 * Maps IconButton variant names to Button variant names.
 * IconButton manages its own bg/text via CVA className, but Button still uses
 * the variant to pick icon color (ICON_COLOR_TOKEN). This mapping ensures
 * the icon renders in the correct color for each IconButton variant.
 */
export const ICON_BUTTON_TO_BUTTON_VARIANT: Record<
  string,
  IButtonProps['variant']
> = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'secondary',
  destroy: 'destroy',
}

/**
 * Maps IconButton size to Icon iconSize.
 * Button size "icon" is not a valid IIconSize, so IconButton
 * renders the Icon directly with the correct size.
 */
export const ICON_SIZE_MAP: Record<string, IIconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'lg',
}

/** Native boxShadow style — beige-500 (#98908B) at 50% opacity, equivalent to shadow-sm. */
export const NATIVE_BOX_SHADOW = '0 1px 2px 0 #98908B80'

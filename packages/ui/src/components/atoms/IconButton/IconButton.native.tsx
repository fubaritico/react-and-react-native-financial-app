import { Button } from '../Button/Button.native'
import { Icon } from '../Icon/Icon.native'

import {
  ICON_BUTTON_TO_BUTTON_VARIANT,
  ICON_SIZE_MAP,
  NATIVE_BOX_SHADOW,
} from './IconButton.constants'
import { iconButtonVariants } from './IconButton.variants'

import type { IIconButtonProps } from './IconButton'

/** Native implementation of the IconButton component — circular icon-only, composes Button. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant,
  size,
  disabled,
  className,
  shadow,
}: Readonly<IIconButtonProps>) {
  const variantClasses = iconButtonVariants({
    variant,
    size,
    disabled: disabled ?? undefined,
  })
  const combined = [variantClasses, className].filter(Boolean).join(' ')
  const buttonVariant = ICON_BUTTON_TO_BUTTON_VARIANT[variant ?? 'ghost']

  return (
    <Button
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      variant={buttonVariant}
      size="icon"
      disabled={disabled}
      centered
      className={combined}
      style={shadow ? { boxShadow: NATIVE_BOX_SHADOW } : undefined}
    >
      <Icon
        name={icon}
        iconSize={ICON_SIZE_MAP[size ?? 'md']}
        color={
          variant === 'primary' || variant === 'destroy'
            ? 'primary-foreground'
            : 'foreground'
        }
      />
    </Button>
  )
}

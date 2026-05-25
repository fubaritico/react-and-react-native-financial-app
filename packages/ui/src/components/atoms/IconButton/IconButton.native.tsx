import { Button } from '../Button/Button.native'

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
}: Readonly<IIconButtonProps>) {
  const variantClasses = iconButtonVariants({
    variant,
    size,
    disabled: disabled ?? undefined,
  })

  return (
    <Button
      icon={icon}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      size="icon"
      disabled={disabled}
      centered
      className={className ? `${variantClasses} ${className}` : variantClasses}
    />
  )
}

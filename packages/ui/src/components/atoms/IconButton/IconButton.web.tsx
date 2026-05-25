import { cn } from '#Lib/cn'

import { Button } from '../Button/Button.web'

import { iconButtonVariants } from './IconButton.variants'

import type { IIconButtonProps } from './IconButton'

/** Web implementation of the IconButton component — circular icon-only, composes Button. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant,
  size,
  disabled,
  className,
}: Readonly<IIconButtonProps>) {
  return (
    <Button
      icon={icon}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      size="icon"
      disabled={disabled}
      centered
      className={cn(
        iconButtonVariants({ variant, size, disabled: disabled ?? undefined }),
        className
      )}
    />
  )
}

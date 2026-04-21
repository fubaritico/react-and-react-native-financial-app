import { cn } from '../../lib/cn'
import { buttonVariants } from '../../variants'

import type { IButtonProps } from './Button'

/** Web implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
}: IButtonProps) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    className={cn(
      buttonVariants({ variant, fullWidth, disabled }),
      'inline-flex gap-2 hover:opacity-80 transition-opacity cursor-pointer',
      disabled && 'cursor-not-allowed'
    )}
  >
    {title}
    {icon}
  </button>
)

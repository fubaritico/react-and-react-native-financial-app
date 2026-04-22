import { cn } from '../../lib/cn'
import { buttonVariants } from '../../variants'
import { Icon } from '../Icon/Icon.web'

import { ICON_COLOR } from './Button.constants'

import type { IButtonProps } from './Button'

/** Web implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
  iconPosition = 'right',
}: IButtonProps) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    className={cn(
      buttonVariants({ variant, fullWidth, disabled }),
      'inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
      iconPosition === 'left' && 'flex-row-reverse',
      disabled && 'cursor-not-allowed'
    )}
  >
    {title}
    {icon ? (
      <Icon
        name={icon}
        iconSize="xs"
        color={ICON_COLOR[variant ?? 'primary'] ?? 'white'}
      />
    ) : null}
  </button>
)

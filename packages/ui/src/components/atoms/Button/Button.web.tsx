import { cn } from '../../../lib/cn'
import { Icon } from '../Icon/Icon.web'

import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'

/** Web implementation of the Button component. */
export const Button = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  icon,
  iconPosition = 'right',
  accessibilityLabel,
  ariaCurrent,
}: IButtonProps) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    aria-label={accessibilityLabel}
    aria-current={ariaCurrent}
    className={cn(
      buttonVariants({ variant, size, fullWidth, disabled }),
      'inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
      iconPosition === 'left' && 'flex-row-reverse',
      disabled && 'cursor-not-allowed'
    )}
  >
    {children ?? (
      <>
        {title}
        {icon ? <Icon name={icon} iconSize="xs" color="currentColor" /> : null}
      </>
    )}
  </button>
)

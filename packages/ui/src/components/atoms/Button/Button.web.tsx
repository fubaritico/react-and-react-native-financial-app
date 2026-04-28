import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'

import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'
import type { Ref } from 'react'

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
  ariaHaspopup,
  ariaExpanded,
  ariaControls,
  className,
  ref,
}: Readonly<IButtonProps>) => (
  <button
    ref={ref as Ref<HTMLButtonElement>}
    onClick={onPress}
    disabled={!!disabled}
    aria-label={accessibilityLabel}
    aria-current={ariaCurrent}
    aria-haspopup={ariaHaspopup}
    aria-expanded={ariaExpanded}
    aria-controls={ariaControls}
    className={cn(
      buttonVariants({ variant, size, fullWidth, disabled }),
      'inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
      iconPosition === 'left' && 'flex-row-reverse',
      disabled && 'cursor-not-allowed',
      className
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

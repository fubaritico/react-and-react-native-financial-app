import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'

import { web } from './Button.styles'
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
      web.root,
      web.focusRing,
      iconPosition === 'left' && 'flex-row-reverse',
      disabled && web.disabled,
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

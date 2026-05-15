import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'

import { web } from './Button.styles'
import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'
import type { Ref } from 'react'

/** CSS variable bridge for spinner color per variant. */
const SPINNER_CSS_COLOR: Record<string, string> = {
  primary: 'var(--color-primary-foreground)',
  secondary: 'var(--color-foreground)',
  tertiary: 'var(--color-foreground-muted)',
  destroy: 'var(--color-destructive-foreground)',
  outline: 'var(--color-foreground)',
  ghost: 'var(--color-foreground)',
}

/** Web implementation of the Button component. */
export const Button = ({
  title,
  children,
  onPress,
  centered,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  loading,
  icon,
  iconPosition = 'right',
  accessibilityLabel,
  ariaCurrent,
  ariaHaspopup,
  ariaExpanded,
  ariaControls,
  className,
  ref,
}: Readonly<IButtonProps>) => {
  const isDisabled = !!disabled || !!loading
  const spinnerColor = SPINNER_CSS_COLOR[variant ?? 'primary'] ?? 'currentColor'

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      onClick={onPress}
      disabled={isDisabled}
      aria-label={accessibilityLabel}
      aria-current={ariaCurrent}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-busy={loading ?? undefined}
      className={cn(
        buttonVariants({
          variant,
          size,
          fullWidth,
          disabled: isDisabled || undefined,
          centered,
        }),
        web.root,
        web.focusRing,
        iconPosition === 'left' && 'flex-row-reverse',
        isDisabled && web.disabled,
        className
      )}
    >
      {loading ? (
        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: `color-mix(in srgb, ${spinnerColor} 25%, transparent)`,
            borderTopColor: spinnerColor,
            borderRightColor: spinnerColor,
            borderBottomColor: spinnerColor,
            animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      ) : (
        (children ?? (
          <>
            {title}
            {icon ? (
              <Icon name={icon} iconSize="xs" color="currentColor" />
            ) : null}
          </>
        ))
      )}
    </button>
  )
}

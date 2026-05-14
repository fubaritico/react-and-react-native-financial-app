import { useCallback, useEffect, useRef } from 'react'

import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { shared, web } from './Checkbox.styles'
import { checkboxVariants } from './Checkbox.variants'

import type { ICheckboxProps } from './Checkbox'
import type { ChangeEvent } from 'react'

/**
 * Resolves which icon to show inside the box.
 * @param checked - Whether the checkbox is checked
 * @param indeterminate - Whether the checkbox is in mixed state
 * @returns Icon name or null when unchecked
 */
function resolveCheckIcon(
  checked: boolean,
  indeterminate?: boolean
): 'minus' | 'tick' | null {
  if (indeterminate) return 'minus'
  if (checked) return 'tick'
  return null
}

/**
 * Web implementation of the Checkbox component.
 * @param props - Checkbox props (checked, onChange, label, disabled, indeterminate, error, size, accessibilityLabel)
 */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  indeterminate,
  error,
  size,
  accessibilityLabel,
}: Readonly<ICheckboxProps>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isVisuallyChecked = indeterminate ?? checked
  const iconName = resolveCheckIcon(checked, indeterminate)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked)
    },
    [onChange]
  )

  return (
    <div>
      <label
        className={cn(shared.root, 'flex', disabled ? web.disabled : web.label)}
      >
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={accessibilityLabel ?? label}
          className="peer sr-only"
        />
        <span
          className={cn(
            checkboxVariants({
              size,
              checked: isVisuallyChecked,
              hasError: !!error,
              disabled: !!disabled,
            }),
            web.boxBase,
            !disabled && !error && web.boxHover,
            disabled && web.disabled
          )}
          aria-hidden="true"
        >
          {iconName ? (
            <Icon name={iconName} iconSize="xs" color="white" />
          ) : null}
        </span>
        {label ? (
          <Typography variant="body" color={disabled ? 'muted' : 'foreground'}>
            {label}
          </Typography>
        ) : null}
      </label>
      {error ? (
        <p className={cn(shared.errorWrap, 'ml-8')}>
          <Typography variant="caption" color="destructive">
            {error}
          </Typography>
        </p>
      ) : null}
    </div>
  )
}

import { useCallback } from 'react'

import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { shared, web } from './TextInput.styles'
import { textInputVariants } from './TextInput.variants'

import type { ITextInputProps } from './TextInput'
import type { ChangeEvent } from 'react'

/** Web implementation of the TextInput component. */
export const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  icon,
  trailingElement,
  prefix,
  secureTextEntry,
  maxLength,
  autoCapitalize,
  keyboardType,
  accessibilityLabel,
  className,
}: Readonly<ITextInputProps & { className?: string }>) => {
  const inputClasses = textInputVariants({ error })

  /** Forwards native input change to onChangeText callback */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeText(e.target.value)
    },
    [onChangeText]
  )

  return (
    <div className={cn('flex flex-col', shared.wrapper, className)}>
      {label && (
        <Typography variant="label" color="muted">
          {label}
        </Typography>
      )}
      <div className={cn(inputClasses, 'flex items-center', web.inputRow)}>
        {prefix ? (
          <Typography
            variant="body"
            color="beige-500"
            as="span"
            className="mr-2"
          >
            {prefix}
          </Typography>
        ) : null}
        <input
          type={
            secureTextEntry
              ? 'password'
              : keyboardType === 'email-address'
                ? 'email'
                : 'text'
          }
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={keyboardType === 'email-address' ? 'email' : undefined}
          autoCapitalize={autoCapitalize}
          aria-label={accessibilityLabel ?? label}
          className={cn(
            'flex-1 bg-transparent text-sm text-foreground',
            web.input
          )}
        />
        {trailingElement ??
          (icon ? <Icon name={icon} iconSize="sm" color="muted" /> : null)}
      </div>
      {helperText ? (
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="left"
          as="span"
        >
          {helperText}
        </Typography>
      ) : null}
    </div>
  )
}

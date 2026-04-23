import { cn } from '../../lib/cn'
import { Icon } from '../Icon/Icon.web'
import { Typography } from '../Typography/Typography.web'

import styles from './TextInput.styles'
import { textInputVariants } from './TextInput.variants'

import type { ITextInputProps } from './TextInput'

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
}: ITextInputProps) => {
  const inputClasses = textInputVariants({ error })

  return (
    <div className={cn('flex flex-col', styles.wrapper)}>
      <Typography variant="label" color="muted">
        {label}
      </Typography>
      <div
        className={cn(
          inputClasses,
          'flex items-center focus-within:border-foreground transition-colors'
        )}
      >
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
          type={secureTextEntry ? 'password' : 'text'}
          value={value}
          onChange={(e) => {
            onChangeText(e.target.value)
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-beige-500"
        />
        {trailingElement ??
          (icon ? (
            <Icon
              name={icon}
              iconSize="sm"
              color="var(--color-foreground-muted)"
            />
          ) : null)}
      </div>
      {helperText ? (
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="right"
          as="span"
        >
          {helperText}
        </Typography>
      ) : null}
    </div>
  )
}

import { cn } from '../../lib/cn'
import { Icon } from '../Icon/Icon.web'

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
      <label className={styles.label}>{label}</label>
      <div
        className={cn(
          inputClasses,
          'flex items-center focus-within:border-foreground transition-colors'
        )}
      >
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
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
        <span
          className={cn(
            styles.helperText,
            error ? 'text-destructive' : 'text-foreground-muted'
          )}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

import { cn } from '../../lib/cn'
import { textInputVariants } from '../../variants/textInput.variants'
import { Icon } from '../Icon/Icon.web'

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
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-grey-500">{label}</label>
      <div
        className={cn(
          inputClasses,
          'flex items-center focus-within:border-grey-900 transition-colors'
        )}
      >
        {prefix ? (
          <span className="text-beige-500 text-sm mr-2">{prefix}</span>
        ) : null}
        <input
          type={secureTextEntry ? 'password' : 'text'}
          value={value}
          onChange={(e) => {
            onChangeText(e.target.value)
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-grey-900 outline-none placeholder:text-beige-500"
        />
        {trailingElement ??
          (icon ? <Icon name={icon} iconSize="sm" color="#696868" /> : null)}
      </div>
      {helperText ? (
        <span
          className={cn(
            'text-xs text-right',
            error ? 'text-red' : 'text-grey-500'
          )}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

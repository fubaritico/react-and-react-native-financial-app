import { useState } from 'react'

import { TextInput } from '../TextInput/TextInput.web'

import type { IPasswordInputProps } from './PasswordInput'

/** Web implementation of the PasswordInput component. */
export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  showToggle = true,
}: IPasswordInputProps) => {
  const [visible, setVisible] = useState(false)

  const eyeIcon = showToggle ? (
    <button
      type="button"
      onClick={() => {
        setVisible((v) => !v)
      }}
      className="ml-2 text-grey-500 hover:text-grey-900 transition-colors cursor-pointer"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? '\u25C9' : '\u25CE'}
    </button>
  ) : undefined

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      icon={eyeIcon}
      secureTextEntry={!visible}
    />
  )
}

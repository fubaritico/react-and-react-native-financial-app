import { Icon } from '@financial-app/icons'
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

  const toggle = showToggle ? (
    <button
      type="button"
      onClick={() => {
        setVisible((v) => !v)
      }}
      className="ml-2 hover:opacity-70 transition-opacity cursor-pointer"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      <Icon
        name={visible ? 'hidePassword' : 'showPassword'}
        size={16}
        color="#696868"
      />
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
      trailingElement={toggle}
      secureTextEntry={!visible}
    />
  )
}

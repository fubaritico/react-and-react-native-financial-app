import { Icon } from '@financial-app/icons'
import { useState } from 'react'
import { Pressable } from 'react-native'

import { TextInput } from '../TextInput/TextInput.native'

import type { IPasswordInputProps } from './PasswordInput'

/** Native implementation of the PasswordInput component. */
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
    <Pressable
      onPress={() => {
        setVisible((v) => !v)
      }}
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
    >
      <Icon
        name={visible ? 'hidePassword' : 'showPassword'}
        size={16}
        color="#696868"
      />
    </Pressable>
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

import { useState } from 'react'
import { Pressable } from 'react-native'

import tw from '#Lib/tw'

import { TextInput } from '../TextInput/TextInput.native'

import type { IPasswordInputProps } from './PasswordInput'

import { Icon } from '#Atoms'

/** Native implementation of the PasswordInput component. */
export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  showToggle = true,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
}: Readonly<IPasswordInputProps>) => {
  const [visible, setVisible] = useState(false)

  const toggle = showToggle ? (
    <Pressable
      onPress={() => {
        setVisible((v) => !v)
      }}
      accessibilityLabel={visible ? hidePasswordLabel : showPasswordLabel}
    >
      <Icon
        name={visible ? 'hidePassword' : 'showPassword'}
        iconSize="sm"
        color={tw.color('foreground-muted')}
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
